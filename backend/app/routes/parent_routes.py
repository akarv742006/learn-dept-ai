from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from app.database import get_db

router = APIRouter(prefix="/api/parent", tags=["Parent"])

MULTILINGUAL_EXPLANATIONS = {
    "ta": {
        "greeting": "வணக்கம் பெற்றோரே,",
        "status_safe": "உங்கள் குழந்தையின் கல்வி முன்னேற்றம் சிறப்பாக உள்ளது. கவலைப்பட ஏதுமில்லை.",
        "status_warning": "அடிப்படை பாடங்களில் (குறிப்பாக தர்க்கவியல் & கணிதம்) சிறிது கவனம் தேவைப்படுகிறது. தினமும் 20 நிமிடம் வீட்டில் பயிற்சி செய்தால் எளிதாக தேர்ச்சி பெற்று விடுவார்.",
        "status_danger": "அடிப்படை பாடங்களில் உள்ள இடைவெளிகள் அடுத்த கட்ட உயர்நிலை பாடங்களை பாதிக்கின்றன. தயவுசெய்து வகுப்பு வழிகாட்டி ஆசிரியரை தொடர்பு கொள்ளவும்.",
        "tree_root": "அடிப்படை தர்க்கவியல் மற்றும் கணித வேர்கள் வலுப்பெற வேண்டும். இந்த வேர்களை பலப்படுத்தினால், கணினி மற்றும் தரவுத்தள கிளைகள் எளிதில் மலரும்.",
        "recommendation": "இன்று இரவு குழந்தையிடம் பேசி ஊக்கப்படுத்துங்கள். இன்று கல்லூரியில் என்ன கற்றுக்கொண்டாய் என்று 10 நிமிடம் அன்புடன் கேளுங்கள்."
    },
    "en": {
        "greeting": "Hello Parent,",
        "status_safe": "Your child is progressing well on their academic path. Keep encouraging them!",
        "status_warning": "Your child has a few foundational prerequisite gaps in logic and math. Daily 20-minute practice at home will resolve them easily.",
        "status_danger": "Critical foundational gaps are blocking advanced coursework. Please connect with the course faculty mentor.",
        "tree_root": "The foundational roots (Logic & Relational Math) need nourishment. Strengthening this will unlock advanced computer science topics.",
        "recommendation": "Encourage 15-20 minutes of daily practice. Ask your child to explain what they learned in college today."
    }
}

@router.get("/dashboard")
def get_parent_dashboard(
    parent_id: Optional[str] = Query("parent_ramesh"),
    roll_number: Optional[str] = Query(None),
    lang: str = Query("ta")
):
    db = get_db()
    
    # 1. Resolve parent user
    parent_user = None
    if parent_id:
        parent_user = db["users"].find_one({"_id": parent_id}) or db["users"].find_one({"email": parent_id})
    if not parent_user and roll_number:
        parent_user = db["users"].find_one({"childRollNo": roll_number, "role": "parent"})
    if not parent_user:
        parent_user = db["users"].find_one({"role": "parent"})

    # 2. Resolve linked student
    linked_student_id = parent_user.get("linkedStudentId", "student_arun") if parent_user else "student_arun"
    if roll_number:
        matched_student = db["students"].find_one({"rollNumber": roll_number})
        if matched_student:
            linked_student_id = matched_student.get("userId", str(matched_student.get("_id")))

    student_user = db["users"].find_one({"_id": linked_student_id}) or db["users"].find_one({"role": "student"})
    sid = str(student_user["_id"]) if student_user else linked_student_id

    student_profile = db["students"].find_one({"userId": sid}) or db["students"].find_one({"rollNumber": parent_user.get("childRollNo") if parent_user else None}) or {
        "rollNumber": "CS2023-042",
        "department": "Computer Science",
        "year": "3rd Year",
        "overallPerformance": 78,
        "learningDebt": 68,
        "riskLevel": "High",
        "attendance": 92
    }

    # 3. Simple Visual Meter / Traffic Light Status
    debt = student_profile.get("learningDebt", 42)
    attendance = student_profile.get("attendance", 92)
    overall = student_profile.get("overallPerformance", 78)

    is_tamil = (lang == "ta")

    if debt > 50:
        light_color = "RED"
        mood_emoji = "😟"
        simple_title = "ஆசிரியரின் உதவி தேவை (Action Needed)" if is_tamil else "Needs Special Attention"
        simple_description = "அடிப்படை கணிதம் & தர்க்கத்தில் சற்று பின்தங்கியுள்ளார்." if is_tamil else "Child is struggling with foundational logic & math concepts."
    elif debt > 25:
        light_color = "YELLOW"
        mood_emoji = "😐"
        simple_title = "கவனம் தேவை (Needs Practice)" if is_tamil else "Making Fair Progress"
        simple_description = "சிறிய வீட்டு பயிற்சி மூலம் சுலபமாக முன்னேறலாம்." if is_tamil else "A little daily practice will bridge the remaining gaps."
    else:
        light_color = "GREEN"
        mood_emoji = "😊"
        simple_title = "மிகவும் நன்று (Doing Great!)" if is_tamil else "Excellent Progress!"
        simple_description = "உங்கள் குழந்தை அனைத்து பாடங்களையும் சிறப்பாக கற்கிறார்." if is_tamil else "Your child is mastering all concepts with ease."

    # 4. Living Tree Metaphor Nodes (Tamil and English ONLY)
    tree_nodes = [
        {
            "id": "root_logic",
            "name": "வேர் 1: அடிப்படை கணிதம் & தர்க்கம்" if is_tamil else "Root 1: Foundational Logic & Math",
            "part": "root",
            "status": "thirsty" if debt > 40 else "healthy",
            "icon": "🌱",
            "healthScore": 45 if debt > 40 else 85,
            "simpleMeaning": "இந்த வேர் சற்று பலவீனமாக உள்ளது. இதனால் டேட்டாபேஸ் (DBMS) பாடம் கடினமாக தோன்றுகிறது. 2 நாட்கள் பயிற்சி தேவை." if is_tamil else "This root is weak, which makes Database topics feel hard. Daily practice will strengthen it."
        },
        {
            "id": "trunk_programming",
            "name": "மரத்தண்டு: கணினி நிரலாக்கம் (Coding)" if is_tamil else "Trunk: Core Programming & Coding",
            "part": "trunk",
            "status": "healthy",
            "icon": "🌳",
            "healthScore": 78,
            "simpleMeaning": "மரத்தண்டு மிகவும் உறுதியாக உள்ளது. மாணவர் நிரல் எழுதுவதை ஆர்வத்துடன் கற்கிறார்." if is_tamil else "Main trunk is solid. Your child codes and practices algorithms enthusiastically."
        },
        {
            "id": "branch_database",
            "name": "கிளை: தரவுத்தள மேலாண்மை (DBMS)" if is_tamil else "Branch: Databases (DBMS)",
            "part": "branch",
            "status": "needs_sunlight" if debt > 40 else "flourishing",
            "icon": "🍃",
            "healthScore": 52 if debt > 40 else 88,
            "simpleMeaning": "இந்த கிளையில் 2 பயிற்சிகள் நிலுவையில் உள்ளன. ஆசிரியர் வழிகாட்டலில் உடனே சரிசெய்து விடலாம்." if is_tamil else "Branch has 2 pending practice tests. Easily completed in a short study session."
        },
        {
            "id": "fruit_exam",
            "name": "பழம் / கனி: பருவத்தேர்வு வெற்றி & பட்டம்" if is_tamil else "Fruit: Exam Pass & Graduation",
            "part": "fruit",
            "status": "growing",
            "icon": "🍎",
            "healthScore": 82,
            "simpleMeaning": "முதல் வகுப்பில் பட்டம் பெற 88% அதிக வாய்ப்பு உள்ளது." if is_tamil else "88% probability of passing the semester with distinction."
        }
    ]

    # 5. Stepping Stones Bridge (Tamil and English ONLY)
    stepping_stones = [
        {
            "step": 1,
            "name": "படி 1: கல்லூரி வருகைப்பதிவு (92%)" if is_tamil else "Step 1: Class Attendance (92%)",
            "done": True,
            "note": "தவறாமல் கல்லூரி செல்கிறார் (Regular)" if is_tamil else "Very regular in classes"
        },
        {
            "step": 2,
            "name": "படி 2: அடிப்படை இடைவெளி தேர்வு" if is_tamil else "Step 2: Foundational Gap Quiz",
            "done": False,
            "note": "1 பயிற்சி தேர்வு நிலுவை (Pending)" if is_tamil else "1 targeted practice quiz pending"
        },
        {
            "step": 3,
            "name": "படி 3: ஆசிரியரிடம் சந்தேகம் தெளிவுபெறுதல்" if is_tamil else "Step 3: Teacher Doubt Clearing",
            "done": True,
            "note": "வழிகாட்டி ஆசிரியர் பேசினார்" if is_tamil else "Mentor consultation active"
        },
        {
            "step": 4,
            "name": "படி 4: இறுதி பருவத்தேர்வு வெற்றி" if is_tamil else "Step 4: Final Semester Examination",
            "done": False,
            "note": "டிசம்பர் மாதத்தில் நடைபெறும்" if is_tamil else "Scheduled in December"
        }
    ]

    lang_dict = MULTILINGUAL_EXPLANATIONS.get(lang, MULTILINGUAL_EXPLANATIONS["ta"])
    audio_script = (
        f"{lang_dict['greeting']} {student_user.get('name', 'மாணவர்')} அவர்களின் கல்லூரி வருகைப்பதிவு {attendance} சதவீதம். "
        f"மொத்த கல்வி மதிப்பீடு {overall} சதவீதம். "
        f"{lang_dict['status_warning'] if debt > 40 else lang_dict['status_safe']} {lang_dict['recommendation']}"
    )

    return {
        "parent": {
            "id": parent_user.get("_id") if parent_user else parent_id,
            "name": parent_user.get("name") if parent_user else "Ramesh Krishnan",
            "email": parent_user.get("email") if parent_user else "ramesh@parent.org",
            "phone": parent_user.get("phone", "+91 98450 12345"),
            "relationship": parent_user.get("relationship", "தந்தை / Father"),
            "preferredLanguage": lang
        },
        "student": {
            "id": sid,
            "name": student_user.get("name") if student_user else "Arun Kumar",
            "rollNumber": student_profile.get("rollNumber", "CS2023-042"),
            "department": student_profile.get("department", "Computer Science"),
            "year": student_profile.get("year", "3rd Year"),
            "overallPerformance": overall,
            "learningDebt": debt,
            "riskLevel": student_profile.get("riskLevel", "High" if debt > 50 else "Medium"),
            "attendance": attendance,
            "mentorTeacher": "Dr. Rajesh Sharma (Head of Dept)",
            "mentorPhone": "+91 63797 62186"
        },
        "trafficLight": {
            "color": light_color,
            "emoji": mood_emoji,
            "title": simple_title,
            "description": simple_description
        },
        "knowledgeTree": tree_nodes,
        "steppingStones": stepping_stones,
        "audioVoiceScript": audio_script,
        "commonQuestions": [
            {
                "q": "என் குழந்தை இந்த பருவத்தேர்வில் நல்ல மதிப்பெண் பெற்று தேர்ச்சி பெறுவாரா?" if is_tamil else "Will my child pass this semester with good grades?",
                "a": "கண்டிப்பாக தேர்ச்சி பெறுவார்! கல்லூரி வருகை 92% மிக சிறப்பாக உள்ளது. தர்க்கவியல் பாடத்தில் உள்ள 2 சிறிய பயிற்சிகளை முடித்தால் முதல் வகுப்பில் தேர்ச்சி பெற்று விடுவார்." if is_tamil else "Yes, absolutely! Class attendance is stellar at 92%. Completing the 2 pending practice tests will guarantee first-class results."
            },
            {
                "q": "இன்று வீட்டில் பெற்றோராகிய நான் என்ன உதவி செய்ய வேண்டும்?" if is_tamil else "How can I support my child at home today?",
                "a": "இன்று இரவு குழந்தையிடம் கல்லூரியில் இன்று என்ன பாடம் கற்றாய் என்று 10 நிமிடம் அன்பாக கேளுங்கள். அவர்கள் விவரிக்கும்போது தன்னம்பிக்கை அதிகரிக்கும்." if is_tamil else "Ask your child to teach you what they learned today for 10 minutes. Showing supportive interest boosts academic confidence immediately."
            },
            {
                "q": "நான் நேரில் கல்லூரிக்கு வந்து ஆசிரியரை சந்திக்க வேண்டுமா?" if is_tamil else "Do I need to visit the college to meet the teacher?",
                "a": "நேரில் வர வேண்டிய அவசியமில்லை. கீழே உள்ள பச்சை பட்டனை அழுத்தி ஆசிரியரிடம் வாட்ஸ்அப் அல்லது தொலைபேசி மூலம் நேரடியாக பேசலாம்." if is_tamil else "Visiting in person is not urgently required. You can use the green WhatsApp button below to speak directly with the mentor."
            }
        ]
    }

@router.post("/notify-teacher")
def notify_teacher_from_parent(payload: Dict[str, Any]):
    """Allows parents to send a 1-click friendly WhatsApp or SMS notification to the teacher"""
    db = get_db()
    parent_name = payload.get("parentName", "Parent")
    student_name = payload.get("studentName", "Student")
    teacher_name = payload.get("teacherName", "Teacher")
    message = payload.get("message", "Requesting progress checkup")

    notification_doc = {
        "userId": "teacher_rajesh",
        "senderRole": "parent",
        "senderName": parent_name,
        "title": f"Parent Inquiry: {student_name}",
        "message": f"{parent_name} sent an inquiry regarding {student_name}'s learning progress: {message}",
        "read": False,
        "createdAt": "Just now",
        "type": "parent_inquiry"
    }
    db["notifications"].insert_one(notification_doc)
    return {"success": True, "message": "Teacher has been notified via LearnDebt AI."}
