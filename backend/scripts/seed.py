import sys
import os
from datetime import datetime, timedelta
import hashlib
import uuid

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import get_db
from app.auth import hash_password

def generate_fingerprint(question: str, subject_id: str, concept_id: str) -> str:
    raw = f"{question.strip().lower()}:{subject_id.strip().lower()}:{concept_id.strip().lower()}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

def seed_database():
    print("[SEED] Seeding MongoDB database with expanded question bank...")
    db = get_db()

    collections = [
        "users", "students", "subjects", "concepts", "questions",
        "assessments", "question_attempts", "student_concepts",
        "learning_debt_history", "notifications", "subscriptions", "payments",
        "department_assignments"
    ]
    for col in collections:
        db[col].delete_many({})

    now = datetime.utcnow()

    # 1. Users (Students, Staff, Parents, Admins)
    users_data = [
        # Students
        {
            "_id": "student_arun",
            "name": "Arun Kumar",
            "email": "arun@student.edu",
            "passwordHash": hash_password("student123"),
            "role": "student",
            "department": "Computer Science",
            "year": "3rd Year",
            "rollNumber": "CS2023-042",
            "phone": "+91 98450 11223",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Arun",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        },
        {
            "_id": "student_priya",
            "name": "Priya Patel",
            "email": "priya.patel@student.edu",
            "passwordHash": hash_password("student123"),
            "role": "student",
            "department": "AI & Data Science",
            "year": "2nd Year",
            "rollNumber": "AI2023-018",
            "phone": "+91 98450 44556",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaP",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        },
        {
            "_id": "student_rahul",
            "name": "Rahul Verma",
            "email": "rahul.verma@student.edu",
            "passwordHash": hash_password("student123"),
            "role": "student",
            "department": "Information Technology",
            "year": "4th Year",
            "rollNumber": "IT2023-055",
            "phone": "+91 98450 77889",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulV",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        },

        # Staff / Teachers
        {
            "_id": "teacher_rajesh",
            "name": "Dr. Rajesh Sharma",
            "email": "rajesh@teacher.edu",
            "passwordHash": hash_password("teacher123"),
            "role": "teacher",
            "staffId": "STAFF-CS-01",
            "designation": "Associate Professor & Head of Dept",
            "department": "Computer Science",
            "phone": "+91 63797 62186",
            "year": "Faculty",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        },
        {
            "_id": "teacher_priya_sharma",
            "name": "Ms. Priya Sharma",
            "email": "priya.sharma@learndebt.ai",
            "passwordHash": hash_password("teacher123"),
            "role": "teacher",
            "staffId": "STAFF-CS-02",
            "designation": "Assistant Professor",
            "department": "Computer Science & Engineering",
            "phone": "+91 99112 55667",
            "year": "Faculty",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        },
        {
            "_id": "teacher_suresh",
            "name": "Prof. Suresh Nair",
            "email": "suresh.nair@learndebt.ai",
            "passwordHash": hash_password("teacher123"),
            "role": "teacher",
            "staffId": "STAFF-IT-01",
            "designation": "Senior Professor & Academic Dean",
            "department": "Information Technology",
            "phone": "+91 99112 88990",
            "year": "Faculty",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=SureshNair",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        },

        # Parents
        {
            "_id": "parent_ramesh",
            "name": "Ramesh Sharma",
            "email": "ramesh.sharma@parent.org",
            "phone": "+91 98450 12345",
            "pin": "1234",
            "passwordHash": hash_password("parent123"),
            "role": "parent",
            "linkedStudentId": "student_arun",
            "linkedStudentName": "Arun Kumar",
            "childRollNo": "CS2023-042",
            "preferredLanguage": "hi",
            "relationship": "Father",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        },
        {
            "_id": "parent_sarah",
            "name": "Sarah Jenkins",
            "email": "sarah@parent.org",
            "phone": "+91 98765 43210",
            "pin": "1234",
            "passwordHash": hash_password("parent123"),
            "role": "parent",
            "linkedStudentId": "student_arun",
            "linkedStudentName": "Arun Kumar",
            "childRollNo": "CS2023-042",
            "preferredLanguage": "en",
            "relationship": "Mother / Guardian",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        },
        {
            "_id": "parent_sunita",
            "name": "Sunita Patel",
            "email": "sunita.patel@parent.org",
            "phone": "+91 97123 45678",
            "pin": "1234",
            "passwordHash": hash_password("parent123"),
            "role": "parent",
            "linkedStudentId": "student_priya",
            "linkedStudentName": "Priya Patel",
            "childRollNo": "AI2023-018",
            "preferredLanguage": "hi",
            "relationship": "Mother",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        },
        {
            "_id": "parent_rajesh_v",
            "name": "Rajesh Verma",
            "email": "rajesh.verma@parent.org",
            "phone": "+91 98234 56789",
            "pin": "1234",
            "passwordHash": hash_password("parent123"),
            "role": "parent",
            "linkedStudentId": "student_rahul",
            "linkedStudentName": "Rahul Verma",
            "childRollNo": "IT2023-055",
            "preferredLanguage": "en",
            "relationship": "Father",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshVerma",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        },

        # Admin
        {
            "_id": "admin_system",
            "name": "Admin System",
            "email": "admin@learndebt.ai",
            "phone": "+91 90000 00000",
            "passwordHash": hash_password("admin123"),
            "role": "admin",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        }
    ]
    db["users"].insert_many(users_data)

    # 2. Student Profiles
    students_data = [
        {
            "userId": "student_arun",
            "name": "Arun Kumar",
            "rollNumber": "CS2023-042",
            "department": "Computer Science",
            "year": "3rd Year",
            "phone": "+91 98450 11223",
            "linkedParentName": "Ramesh Sharma",
            "linkedParentPhone": "+91 98450 12345",
            "subjects": ["DBMS", "Data Structures", "Computer Networks", "Mathematics"],
            "overallPerformance": 78,
            "learningDebt": 68,
            "riskLevel": "High",
            "attendance": 92,
            "createdAt": now,
            "updatedAt": now
        },
        {
            "userId": "student_priya",
            "name": "Priya Patel",
            "rollNumber": "AI2023-018",
            "department": "AI & Data Science",
            "year": "2nd Year",
            "phone": "+91 98450 44556",
            "linkedParentName": "Sunita Patel",
            "linkedParentPhone": "+91 97123 45678",
            "subjects": ["Python", "Linear Algebra", "Data Structures", "Statistics"],
            "overallPerformance": 84,
            "learningDebt": 34,
            "riskLevel": "Medium",
            "attendance": 95,
            "createdAt": now,
            "updatedAt": now
        },
        {
            "userId": "student_rahul",
            "name": "Rahul Verma",
            "rollNumber": "IT2023-055",
            "department": "Information Technology",
            "year": "4th Year",
            "phone": "+91 98450 77889",
            "linkedParentName": "Rajesh Verma",
            "linkedParentPhone": "+91 98234 56789",
            "subjects": ["Cloud Computing", "Information Security", "Software Engineering"],
            "overallPerformance": 91,
            "learningDebt": 14,
            "riskLevel": "Low",
            "attendance": 98,
            "createdAt": now,
            "updatedAt": now
        }
    ]
    db["students"].insert_many(students_data)

    # 3. Comprehensive Question Bank across multiple subjects and concepts
    raw_questions = [
        # DBMS - Functional Dependency
        {
            "question": "What is a Functional Dependency in relational database design?",
            "options": [
                "A constraint between two sets of attributes in a relation.",
                "A key that uniquely identifies a row.",
                "A table join technique in SQL.",
                "A foreign key constraint between two tables."
            ],
            "correctAnswer": 0,
            "explanation": "Functional dependency X -> Y specifies that attribute set X uniquely determines attribute set Y.",
            "subjectId": "DBMS", "conceptId": "c_fd", "difficulty": "medium"
        },
        {
            "question": "Which Armstrong Axiom states that if X -> Y, then XZ -> YZ?",
            "options": ["Reflexivity", "Augmentation", "Transitivity", "Union"],
            "correctAnswer": 1,
            "explanation": "Augmentation axiom allows adding attribute set Z to both sides of dependency X -> Y.",
            "subjectId": "DBMS", "conceptId": "c_fd", "difficulty": "medium"
        },
        {
            "question": "If X -> Y and Y -> Z hold, which property proves X -> Z?",
            "options": ["Transitivity", "Reflexivity", "Decomposition", "Pseudo-transitivity"],
            "correctAnswer": 0,
            "explanation": "Transitivity rule states that functionally determined attributes can be chained X -> Y and Y -> Z implies X -> Z.",
            "subjectId": "DBMS", "conceptId": "c_fd", "difficulty": "easy"
        },
        {
            "question": "What is attribute closure X+ used for in Functional Dependency analysis?",
            "options": [
                "Finding all attributes functionally determined by X under a set of FDs.",
                "Calculating table primary keys.",
                "Determining foreign key relationships.",
                "Creating database indexes."
            ],
            "correctAnswer": 0,
            "explanation": "The closure X+ is the set of all attributes functionally determined by X given functional dependencies F.",
            "subjectId": "DBMS", "conceptId": "c_fd", "difficulty": "hard"
        },

        # DBMS - Normalization
        {
            "question": "A relation is in 3NF if it is in 2NF and has no:",
            "options": [
                "Partial dependency",
                "Transitive dependency on non-prime attributes",
                "Multivalued dependency",
                "Join dependency"
            ],
            "correctAnswer": 1,
            "explanation": "Third Normal Form (3NF) eliminates transitive functional dependencies.",
            "subjectId": "DBMS", "conceptId": "c_norm", "difficulty": "hard"
        },
        {
            "question": "Which normal form requires every determinant to be a super key?",
            "options": ["1NF", "2NF", "3NF", "BCNF"],
            "correctAnswer": 3,
            "explanation": "Boyce-Codd Normal Form (BCNF) requires X to be a superkey for every non-trivial X -> Y.",
            "subjectId": "DBMS", "conceptId": "c_norm", "difficulty": "hard"
        },
        {
            "question": "What condition must be satisfied for a relation to be in 2NF?",
            "options": [
                "It is in 1NF and contains no partial dependencies on key attributes.",
                "It contains no transitive dependencies.",
                "All domain values are atomic.",
                "Every determinant is a candidate key."
            ],
            "correctAnswer": 0,
            "explanation": "2NF requires 1NF compliance plus the removal of partial dependencies where non-prime attributes depend on proper subsets of candidate keys.",
            "subjectId": "DBMS", "conceptId": "c_norm", "difficulty": "medium"
        },

        # DBMS - SQL Joins
        {
            "question": "Which SQL JOIN returns all rows from the left table and matched rows from the right table?",
            "options": ["INNER JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN"],
            "correctAnswer": 1,
            "explanation": "LEFT JOIN returns all records from the left table, and matching records from right table (with NULLs for non-matches).",
            "subjectId": "DBMS", "conceptId": "SQL Joins", "difficulty": "easy"
        },
        {
            "question": "What is the result of a CROSS JOIN between a table with 5 rows and a table with 4 rows?",
            "options": ["9 rows", "20 rows", "5 rows", "0 rows"],
            "correctAnswer": 1,
            "explanation": "CROSS JOIN produces Cartesian product resulting in 5 * 4 = 20 rows.",
            "subjectId": "DBMS", "conceptId": "SQL Joins", "difficulty": "medium"
        },

        # Data Structures - Binary Search Trees
        {
            "question": "What is the worst-case time complexity of searching an element in a Binary Search Tree (BST)?",
            "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
            "correctAnswer": 2,
            "explanation": "In a degenerate (skewed) BST, search degenerates to linear scan O(N).",
            "subjectId": "Data Structures", "conceptId": "c_bst", "difficulty": "medium"
        },
        {
            "question": "Which tree traversal of a Binary Search Tree produces elements in sorted ascending order?",
            "options": ["Pre-order", "In-order", "Post-order", "Level-order"],
            "correctAnswer": 1,
            "explanation": "In-order traversal (Left, Root, Right) yields keys in non-decreasing sorted order for BSTs.",
            "subjectId": "Data Structures", "conceptId": "c_bst", "difficulty": "easy"
        },
        {
            "question": "What property defines a self-balancing AVL Binary Search Tree?",
            "options": [
                "Height difference between left and right subtrees of any node is at most 1.",
                "Tree must be full and complete.",
                "Every node must have exactly two children.",
                "Leaf nodes must be at the same depth."
            ],
            "correctAnswer": 0,
            "explanation": "AVL trees strictly enforce balance factor |height(left) - height(right)| <= 1.",
            "subjectId": "Data Structures", "conceptId": "c_bst", "difficulty": "hard"
        },

        # Data Structures - Arrays & Strings
        {
            "question": "What is the average time complexity of accessing an element by index in an Array?",
            "options": ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
            "correctAnswer": 0,
            "explanation": "Array indexing uses memory base address offset math achieving O(1) constant lookup time.",
            "subjectId": "Data Structures", "conceptId": "Arrays & Strings", "difficulty": "easy"
        },

        # Java - OOP & Threads
        {
            "question": "Which keyword in Java prevents a class from being subclassed?",
            "options": ["static", "final", "abstract", "synchronized"],
            "correctAnswer": 1,
            "explanation": "Declaring a Java class final prevents inheritance and child class extension.",
            "subjectId": "Java", "conceptId": "OOP Principles", "difficulty": "easy"
        },
        {
            "question": "What is the purpose of the synchronized keyword in Java?",
            "options": [
                "Ensures only one thread accesses a method or block at a time.",
                "Speeds up garbage collection.",
                "Makes variables immutable.",
                "Prevents method overriding."
            ],
            "correctAnswer": 0,
            "explanation": "synchronized provides mutual exclusion locking for concurrent multi-threading.",
            "subjectId": "Java", "conceptId": "Multithreading", "difficulty": "medium"
        }
    ]

    questions_data = []
    for idx, q in enumerate(raw_questions):
        fp = generate_fingerprint(q["question"], q["subjectId"], q["conceptId"])
        questions_data.append({
            "_id": f"q_{idx+1:03d}",
            "question": q["question"],
            "options": q["options"],
            "correctAnswer": q["correctAnswer"],
            "explanation": q["explanation"],
            "department": q.get("department", "Computer Science"),
            "subjectId": q["subjectId"],
            "conceptId": q["conceptId"],
            "difficulty": q["difficulty"],
            "questionType": "multiple_choice",
            "source": "curated",
            "fingerprint": fp,
            "createdAt": now
        })

    db["questions"].insert_many(questions_data)
    print(f"[SEED] Inserted {len(questions_data)} curated questions.")

    # 4. Seed Initial Department Assignments created by Staff
    sample_assignments = [
        {
            "_id": "assign_cs_301",
            "title": "CS301: Relational Normalization & Functional Dependency",
            "description": "Midterm staff evaluation assessing Functional Dependency axioms, closure calculations, and 2NF/3NF/BCNF normal forms.",
            "department": "Computer Science",
            "targetYear": "3rd Year",
            "subjectId": "DBMS",
            "conceptId": "c_fd",
            "durationMinutes": 30,
            "questionIds": ["q_001", "q_002", "q_003", "q_004", "q_005"],
            "assignedBy": "Dr. Rajesh Sharma (Head of CS)",
            "dueDate": "2026-10-10",
            "submissionsCount": 12,
            "averageScore": 74,
            "status": "published",
            "createdAt": now
        },
        {
            "_id": "assign_it_202",
            "title": "IT202: Binary Search Trees & Traversal Diagnostics",
            "description": "Department assignment for Information Technology students focusing on BST worst-case lookups and balanced AVL tree mechanics.",
            "department": "Information Technology",
            "targetYear": "2nd Year",
            "subjectId": "Data Structures",
            "conceptId": "c_bst",
            "durationMinutes": 25,
            "questionIds": ["q_010", "q_011", "q_012"],
            "assignedBy": "Prof. Anita Sen",
            "dueDate": "2026-10-12",
            "submissionsCount": 8,
            "averageScore": 68,
            "status": "published",
            "createdAt": now
        },
        {
            "_id": "assign_ece_201",
            "title": "EC201: Semiconductor Physics & Logic Gates Evaluation",
            "description": "Diagnostic evaluation for ECE department covering digital logic circuits and Boolean minimizations.",
            "department": "Electronics & Communication",
            "targetYear": "2nd Year",
            "subjectId": "Physics",
            "conceptId": "Classical Mechanics",
            "durationMinutes": 30,
            "questionIds": ["q_013", "q_014"],
            "assignedBy": "Dr. V. Ramanujan",
            "dueDate": "2026-10-15",
            "submissionsCount": 15,
            "averageScore": 81,
            "status": "published",
            "createdAt": now
        }
    ]
    db["department_assignments"].insert_many(sample_assignments)
    print(f"[SEED] Inserted {len(sample_assignments)} staff department assignments.")

    # 5. Initial Mastery & History
    db["student_concepts"].insert_many([
        {
            "studentId": "student_arun",
            "conceptId": "c_fd",
            "masteryScore": 45,
            "assessmentCount": 3,
            "correctAnswers": 7,
            "attemptedQuestions": 15,
            "lastScore": 40,
            "trend": "declining",
            "updatedAt": now
        },
        {
            "studentId": "student_arun",
            "conceptId": "c_norm",
            "masteryScore": 55,
            "assessmentCount": 2,
            "correctAnswers": 6,
            "attemptedQuestions": 10,
            "lastScore": 50,
            "trend": "stable",
            "updatedAt": now
        }
    ])

    print("[SEED] Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
