import logging
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from app.config import settings

logger = logging.getLogger("learndebt.database")

client = None
db = None
is_mongodb_connected = False

class MemoryCollection:
    def __init__(self, name: str, data_store: dict):
        self.name = name
        self._store = data_store.setdefault(name, [])

    def find_one(self, filter_dict=None):
        docs = self.find(filter_dict).to_list()
        return docs[0] if docs else None

    def find(self, filter_dict=None):
        filter_dict = filter_dict or {}
        results = []

        def eval_cond(val, cond):
            if isinstance(cond, dict):
                if "$in" in cond:
                    return val in cond["$in"]
                if "$regex" in cond:
                    import re
                    flags = re.IGNORECASE if cond.get("$options") == "i" else 0
                    return bool(re.search(cond["$regex"], str(val or ""), flags))
                return False
            return val == cond

        def match_filter(d, f):
            if not f:
                return True
            for k, v in f.items():
                if k == "$or" and isinstance(v, list):
                    if not any(match_filter(d, sub) for sub in v):
                        return False
                    continue
                if k == "$and" and isinstance(v, list):
                    if not all(match_filter(d, sub) for sub in v):
                        return False
                    continue
                if not eval_cond(d.get(k), v):
                    return False
            return True

        for doc in self._store:
            if match_filter(doc, filter_dict):
                results.append(dict(doc))
        return MemoryCursor(results)

    def insert_one(self, doc):
        self._store.append(dict(doc))
        return doc

    def insert_many(self, docs):
        for d in docs:
            self._store.append(dict(d))
        return docs

    def update_one(self, filter_dict, update_dict):
        doc = self.find_one(filter_dict)
        if doc:
            for item in self._store:
                if item.get("_id") == doc.get("_id"):
                    if "$set" in update_dict:
                        item.update(update_dict["$set"])
                    if "$inc" in update_dict:
                        for k, inc_val in update_dict["$inc"].items():
                            item[k] = item.get(k, 0) + inc_val
                    break
        return True

    def update_many(self, filter_dict, update_dict):
        docs = self.find(filter_dict).to_list()
        matched_ids = {d.get("_id") for d in docs if d.get("_id")}
        for item in self._store:
            if item.get("_id") in matched_ids:
                if "$set" in update_dict:
                    item.update(update_dict["$set"])
                if "$inc" in update_dict:
                    for k, inc_val in update_dict["$inc"].items():
                        item[k] = item.get(k, 0) + inc_val
        return True

    def count_documents(self, filter_dict=None):
        return len(self.find(filter_dict).to_list())

    def delete_many(self, filter_dict=None):
        if not filter_dict:
            self._store.clear()
            return
        to_remove = []
        for doc in self._store:
            match = True
            for k, v in filter_dict.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                to_remove.append(doc)
        for r in to_remove:
            self._store.remove(r)

    def delete_one(self, filter_dict=None):
        doc = self.find_one(filter_dict)
        class DeleteResult:
            def __init__(self, count):
                self.deleted_count = count
        if doc:
            for item in list(self._store):
                if item.get("_id") == doc.get("_id") or item.get("id") == doc.get("id"):
                    self._store.remove(item)
                    return DeleteResult(1)
        return DeleteResult(0)

    def create_index(self, keys, unique=False):
        pass

class MemoryCursor:
    def __init__(self, data):
        self.data = list(data)

    def sort(self, key, direction=1):
        reverse = (direction == -1)
        def _sort_key(doc):
            val = doc.get(key)
            if val is None:
                return ""
            if hasattr(val, "isoformat"):
                return val.isoformat()
            return str(val)
        self.data.sort(key=_sort_key, reverse=reverse)
        return self

    def limit(self, count):
        self.data = self.data[:count]
        return self

    def to_list(self):
        return self.data

    def __iter__(self):
        return iter(self.data)

    def __len__(self):
        return len(self.data)

import certifi

class MemoryDatabase:
    def __init__(self):
        self._data = {}

    def __getitem__(self, name):
        return MemoryCollection(name, self._data)

memory_db_instance = MemoryDatabase()

def connect_to_mongodb(uri: str, database_name: str = "learndebt"):
    global client, db, is_mongodb_connected
    if not uri or not uri.strip():
        return False, "No MongoDB URI provided in configuration."

    try:
        kwargs = {
            "serverSelectionTimeoutMS": 5000,
            "connectTimeoutMS": 5000
        }
        if "mongodb+srv://" in uri or "ssl=true" in uri.lower() or "tls=true" in uri.lower():
            kwargs["tlsCAFile"] = certifi.where()

        test_client = MongoClient(uri, **kwargs)
        test_client.admin.command('ping')

        client = test_client
        db = client[database_name]
        is_mongodb_connected = True
        logger.info(f"Successfully connected to MongoDB Atlas database: {database_name}")
        create_indexes()
        return True, f"Connected to MongoDB Atlas database '{database_name}'."
    except Exception as e:
        logger.warning(f"MongoDB Atlas connection failure ({e}). Falling back to memory store.")
        return False, str(e)

def init_db():
    global client, db, is_mongodb_connected
    settings.reload()
    uri = settings.MONGODB_URI
    if uri and ("mongodb+srv://" in uri or "mongodb://" in uri):
        success, msg = connect_to_mongodb(uri, settings.MONGODB_DATABASE)
        if success:
            return
        logger.warning(f"Could not connect to MongoDB Atlas URI: {msg}. Using resilient in-memory store.")

    is_mongodb_connected = False
    db = memory_db_instance

def get_connection_info():
    return {
        "isAtlas": is_mongodb_connected,
        "status": "Connected to MongoDB Atlas" if is_mongodb_connected else "Operating on In-Memory Store (Configure .env)",
        "databaseName": settings.MONGODB_DATABASE,
        "maskedUri": settings.get_masked_mongodb_uri()
    }

def create_indexes():
    if not is_mongodb_connected or db is None:
        return
    try:
        db.users.create_index([("email", ASCENDING)], unique=True)
        db.questions.create_index([("fingerprint", ASCENDING)], unique=True)
        db.question_attempts.create_index([("studentId", ASCENDING), ("questionId", ASCENDING)])
        db.assessments.create_index([("studentId", ASCENDING), ("createdAt", ASCENDING)])
        db.notifications.create_index([("userId", ASCENDING), ("createdAt", ASCENDING)])
        db.subscriptions.create_index([("userId", ASCENDING)])
        db.payments.create_index([("userId", ASCENDING)])
        db.department_assignments.create_index([("department", ASCENDING), ("createdAt", ASCENDING)])
    except Exception as e:
        logger.warning(f"Index creation warning: {e}")

init_db()

def get_db():
    if db is None:
        return memory_db_instance
    return db

