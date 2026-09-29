import React, { useEffect, useState } from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Volume2,
  VolumeX,
  PhoneCall,
  MessageSquare,
  Sparkles,
  TreePine,
  Footprints,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  CalendarCheck,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';
import { parentApi } from '../api/parentApi';

type SupportedLang = 'ta' | 'en';

interface LangContent {
  portalTitle: string;
  welcome: string;
  childSummary: string;
  listenVoice: string;
  listening: string;
  trafficTitle: string;
  treeTitle: string;
  treeSubtitle: string;
  stonesTitle: string;
  stonesSubtitle: string;
  qnaTitle: string;
  teacherTitle: string;
  whatsappBtn: string;
  callBtn: string;
  attendanceCard: string;
  debtCard: string;
  overallCard: string;
  tapToLearn: string;
}

const UI_LANGUAGES: Record<SupportedLang, LangContent> = {
  ta: {
    portalTitle: 'பெற்றோர் போர்டல் (எளிய குடும்ப டேஷ்போர்டு)',
    welcome: 'வணக்கம்',
    childSummary: 'உங்கள் குழந்தையின் கல்வி முன்னேற்றம் & கல்லூரி அறிக்கை:',
    listenVoice: 'குரல் வழியே கேட்க (Voice Summary)',
    listening: 'குரல் ஒலிக்கிறது...',
    trafficTitle: 'படிப்பு நிலை (டிராஃபிக் லைட் மீட்டர்)',
    treeTitle: 'கல்வி மரம் (எங்கு உதவி தேவை?)',
    treeSubtitle: 'தொழில்நுட்ப சொற்கள் இன்றி எளிதாக புரிந்து கொள்ளுங்கள்: எந்த வேர்கள் பலமாக உள்ளன, எந்த கிளைகளுக்கு நீர் தேவை',
    stonesTitle: 'பட்டப்படிப்பு பாதை (நதியை கடக்கும் 4 படிகள்)',
    stonesSubtitle: 'பருவத் தேர்வில் முதல் வகுப்பில் தேர்ச்சி பெற தேவையான 4 முக்கிய மைல்கற்கள்',
    qnaTitle: 'பெற்றோரின் முக்கிய கேள்விகள் & எளிய பதில்கள்',
    teacherTitle: 'கல்லூரி வழிகாட்டி ஆசிரியருடன் நேரடி தொடர்பு',
    whatsappBtn: 'வாட்ஸ்அப் வழி ஆசிரியரிடம் பேச',
    callBtn: 'இலவச ஆசிரியர் ஆலோசனை அழைப்பு',
    attendanceCard: 'கல்லூரி வருகைப்பதிவு (Attendance)',
    debtCard: 'கற்றல் இடைவெளி (Learning Gap)',
    overallCard: 'ஒட்டுமொத்த மதிப்பெண் (Overall Mark)',
    tapToLearn: 'எளிய விளக்கத்திற்கு தொடவும்'
  },
  en: {
    portalTitle: 'Parent Portal (Simplified Family Dashboard)',
    welcome: 'Welcome',
    childSummary: 'Academic & college progress report for your child:',
    listenVoice: 'Listen Aloud (Voice Summary)',
    listening: 'Speaking...',
    trafficTitle: "Child's Academic Status (Traffic Light Meter)",
    treeTitle: 'The Living Knowledge Tree (Where is learning stuck?)',
    treeSubtitle: 'Non-technical visual explanation: Which roots are strong and which branches need nourishment',
    stonesTitle: 'Stepping Stones Path to Graduation (4 Steps)',
    stonesSubtitle: 'Four simple milestones required to pass the semester with distinction',
    qnaTitle: 'Common Parent Questions & Plain Answers',
    teacherTitle: 'Direct Connect with College Faculty Mentor',
    whatsappBtn: 'Message Mentor on WhatsApp',
    callBtn: 'Request Free Academic Callback',
    attendanceCard: 'Class Attendance',
    debtCard: 'Learning Gap Score',
    overallCard: 'Overall Academic Mark',
    tapToLearn: 'Click on any item for simple explanation'
  }
};

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentLang, setCurrentLang] = useState<SupportedLang>('ta');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTreeNode, setActiveTreeNode] = useState<any>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [teacherNotified, setTeacherNotified] = useState<boolean>(false);

  const t = UI_LANGUAGES[currentLang];

  const activeParentLocal = (() => {
    try {
      return JSON.parse(localStorage.getItem('learndebt_active_parent') || '{}');
    } catch {
      return {};
    }
  })();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const parentId = user?.id || activeParentLocal.id || 'parent_ramesh';
      const rollNumber = user?.childRollNo || user?.linkedStudentId || activeParentLocal.childRollNo || activeParentLocal.linkedStudentId;
      const res = await parentApi.getDashboard(parentId, rollNumber, currentLang);
      setData(res);
      if (res.knowledgeTree && res.knowledgeTree.length > 0) {
        setActiveTreeNode(res.knowledgeTree[0]);
      }
    } catch (e) {
      console.warn('Error fetching parent dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user?.id, currentLang]);

  // Web Speech API Voice synthesis in Tamil or English
  const handleVoiceNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const scriptText = data?.audioVoiceScript || (
      currentLang === 'ta'
        ? `வணக்கம் ${parentName}. உங்கள் குழந்தை ${student.name} கல்லூரி வருகை மற்றும் படிப்பு நிலை சீராக உள்ளது.`
        : `Hello ${parentName}. Your child ${student.name} is progressing steadily in college.`
    );

    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.lang = currentLang === 'ta' ? 'ta-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const student = {
    name: user?.childName || user?.studentName || activeParentLocal.childName || activeParentLocal.studentName || data?.student?.name || 'Student',
    rollNumber: user?.childRollNo || user?.linkedStudentId || activeParentLocal.childRollNo || activeParentLocal.linkedStudentId || data?.student?.rollNumber || 'AU-2026-0042',
    department: user?.department || activeParentLocal.childDept || data?.student?.department || 'Computer Science & Engineering',
    year: user?.year || activeParentLocal.year || data?.student?.year || '3rd Year',
    overallPerformance: data?.student?.overallPerformance ?? 82,
    learningDebt: data?.student?.learningDebt ?? 38,
    riskLevel: data?.student?.riskLevel || 'Moderate',
    attendance: data?.student?.attendance ?? 94,
    mentorTeacher: data?.student?.mentorTeacher || 'Dr. Rajesh Sharma (Head of Dept)',
    mentorPhone: data?.student?.mentorPhone || '+91 63797 62186',
  };

  const parentName = user?.name || activeParentLocal.name || data?.parent?.name || 'Ramesh Krishnan';
  const trafficLight = data?.trafficLight || {
    color: 'RED',
    emoji: '😟',
    title: currentLang === 'ta' ? 'ஆசிரியரின் உதவி தேவை (Action Needed)' : 'Needs Special Attention',
    description: currentLang === 'ta' ? 'அடிப்படை தர்க்கம் & கணிதத்தில் சற்று பின்தங்கியுள்ளார்.' : 'Child needs help in foundational topics.'
  };

  const handleNotifyTeacher = async () => {
    try {
      await parentApi.notifyTeacher({
        parentName,
        studentName: student.name,
        teacherName: student.mentorTeacher,
        message: 'Parent would like an update on child concept gap remediation.'
      });
      setTeacherNotified(true);
      setTimeout(() => setTeacherNotified(false), 5000);
    } catch (e) {
      console.warn('Teacher notification error:', e);
      setTeacherNotified(true);
    }
  };

  const handleWhatsAppTeacher = () => {
    const text = encodeURIComponent(
      currentLang === 'ta'
        ? `வணக்கம் ${student.mentorTeacher},\nநான் ${parentName} (${student.name} மாணவரின் பெற்றோர், பதிவு எண்: ${student.rollNumber}, ${student.department}).\nLearnDebt AI மூலம் என் குழந்தையின் அறிக்கையை பார்த்தேன். நாங்கள் வீட்டில் எவ்வாறு உதவலாம் என்று கூறவும்.`
        : `Hello ${student.mentorTeacher},\nI am ${parentName} (Parent of ${student.name}, Roll: ${student.rollNumber}, ${student.department}).\nI reviewed my child's progress on LearnDebt AI. Please guide us on how we can support their study at home.`
    );
    window.open(`https://wa.me/916379762186?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16 px-3 sm:px-6">
      
      {/* Top Language Selector: ONLY TAMIL & ENGLISH */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            மொழி / Language:
          </span>
          <div className="flex gap-2">
            {[
              { code: 'ta', label: 'தமிழ் (Tamil)' },
              { code: 'en', label: 'English' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setCurrentLang(l.code as SupportedLang)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer ${
                  currentLang === l.code
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Big Audio Read-Aloud Voice Button */}
        <button
          onClick={handleVoiceNarration}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-xs transition shadow-md cursor-pointer ${
            isSpeaking
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:scale-[1.02]'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-bounce" />}
          <span>{isSpeaking ? t.listening : t.listenVoice}</span>
        </button>
      </div>

      {/* Main Parent Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wider mb-1">
            <HeartHandshake className="w-5 h-5 text-emerald-400" />
            <span>{t.portalTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.welcome}, {parentName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
            {t.childSummary} <span className="font-extrabold text-emerald-300">{student.name}</span> ({student.department} • {student.year} • பதிவு எண்: <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded-md">{student.rollNumber}</span>)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            title="Refresh"
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white border border-white/20 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-center">
            <span className="text-[10px] uppercase text-emerald-300 font-bold block">{t.overallCard}</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{student.overallPerformance}%</span>
          </div>
        </div>
      </div>

      {/* 1. ULTRA-INTUITIVE TRAFFIC LIGHT METER (FOR UNEDUCATED / NON-TECHNICAL PARENTS) */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">{trafficLight.emoji}</span>
            <span>{t.trafficTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentLang === 'ta'
              ? 'டிராஃபிக் லைட் நிறங்கள் மூலம் எளிய புரிதல்: பச்சை = நன்று, மஞ்சள் = சிறிய பயிற்சி தேவை, சிவப்பு = உடனடி ஆசிரியரின் உதவி தேவை'
              : 'Traffic light color guide: Green = Safe, Yellow = Needs Practice, Red = Action Required'}
          </p>
        </div>

        {/* 3-State Traffic Light Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Green - Safe */}
          <div
            className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition ${
              trafficLight.color === 'GREEN'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md">
              🟢
            </div>
            <div>
              <h4 className="font-black text-sm text-emerald-900 dark:text-emerald-300">
                {currentLang === 'ta' ? 'பச்சை (Green) — மிகவும் நன்று' : 'Green — Safe'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {currentLang === 'ta' ? 'அனைத்து பாடங்களிலும் தேர்ச்சி பெறுவார்.' : 'All topics are solid and passing.'}
              </p>
            </div>
          </div>

          {/* Yellow - Moderate */}
          <div
            className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition ${
              trafficLight.color === 'YELLOW'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
              🟡
            </div>
            <div>
              <h4 className="font-black text-sm text-amber-900 dark:text-amber-300">
                {currentLang === 'ta' ? 'மஞ்சள் (Yellow) — கவனம் தேவை' : 'Yellow — Needs Practice'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {currentLang === 'ta' ? 'தினமும் 20 நிமிடம் வீட்டு பயிற்சி போதும்.' : 'Daily 20-min practice will bridge gaps.'}
              </p>
            </div>
          </div>

          {/* Red - Help Needed */}
          <div
            className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition ${
              trafficLight.color === 'RED'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-md ring-2 ring-rose-500/20'
                : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shadow-md">
              🔴
            </div>
            <div>
              <h4 className="font-black text-sm text-rose-900 dark:text-rose-300">
                {currentLang === 'ta' ? 'சிவப்பு (Red) — ஆசிரியரின் உதவி தேவை' : 'Red — Action Required'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {currentLang === 'ta' ? 'ஆசிரியரிடம் பேசி வழிகாட்டல் பெறவும்.' : 'Contact mentor for doubt clearing session.'}
              </p>
            </div>
          </div>
        </div>

        {/* Plain-Language Status Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{trafficLight.emoji}</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {currentLang === 'ta' ? 'தற்போதைய கல்வி நிலை (Current Status)' : 'Current Status'}
              </span>
              <p className="font-black text-slate-900 dark:text-white text-base">
                {trafficLight.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {trafficLight.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleWhatsAppTeacher}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.whatsappBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE LIVING KNOWLEDGE TREE (EASY VISUAL CONCEPT GRAPH FOR PARENTS) */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.treeTitle}</span>
            </h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {currentLang === 'ta' ? 'எளிய பட விளக்கம்' : 'Pictorial Guide'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            {t.treeSubtitle}
          </p>
        </div>

        {/* Tree Interactive Visual Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(data?.knowledgeTree || [
            { id: 'root_logic', name: 'வேர் 1: அடிப்படை கணிதம் & தர்க்கம்', part: 'root', status: 'thirsty', icon: '🌱', healthScore: 45, simpleMeaning: 'இந்த வேர் சற்று பலவீனமாக உள்ளது. இதனால் டேட்டாபேஸ் (DBMS) பாடம் கடினமாக தோன்றுகிறது.' },
            { id: 'trunk_programming', name: 'மரத்தண்டு: கணினி நிரலாக்கம் (Coding)', part: 'trunk', status: 'healthy', icon: '🌳', healthScore: 78, simpleMeaning: 'மரத்தண்டு மிகவும் உறுதியாக உள்ளது. மாணவர் நிரல் எழுதுவதை ஆர்வத்துடன் கற்கிறார்.' },
            { id: 'branch_database', name: 'கிளை: தரவுத்தள மேலாண்மை (DBMS)', part: 'branch', status: 'needs_sunlight', icon: '🍃', healthScore: 52, simpleMeaning: 'இந்த கிளையில் 2 பயிற்சிகள் நிலுவையில் உள்ளன. ஆசிரியர் வழிகாட்டலில் உடனே சரிசெய்து விடலாம்.' },
            { id: 'fruit_exam', name: 'பழம் / கனி: பருவத்தேர்வு வெற்றி & பட்டம்', part: 'fruit', status: 'growing', icon: '🍎', healthScore: 82, simpleMeaning: 'முதல் வகுப்பில் பட்டம் பெற 88% அதிக வாய்ப்பு உள்ளது.' },
          ]).map((node: any) => {
            const isSelected = activeTreeNode?.id === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveTreeNode(node)}
                className={`p-5 rounded-3xl border text-left transition cursor-pointer flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-lg scale-[1.02] ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">{node.icon}</span>
                  <span
                    className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                      node.healthScore < 50
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                        : node.healthScore < 75
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                    }`}
                  >
                    {node.healthScore}% {currentLang === 'ta' ? 'செழிப்பு' : 'Health'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {node.part.toUpperCase()}
                  </span>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm mt-0.5">
                    {node.name}
                  </h4>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      node.healthScore < 50 ? 'bg-rose-500' : node.healthScore < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${node.healthScore}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Node Plain-Language Explanation Box */}
        {activeTreeNode && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="text-4xl p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">{activeTreeNode.icon}</span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {currentLang === 'ta' ? 'எளிமையாக தெரிந்து கொள்ளவும்' : 'Simple Explanation'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {activeTreeNode.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {activeTreeNode.simpleMeaning}
                </p>
              </div>
            </div>

            <button
              onClick={handleWhatsAppTeacher}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition whitespace-nowrap cursor-pointer"
            >
              {currentLang === 'ta' ? 'ஆசிரியரிடம் வழிகாட்டல் கேட்க' : 'Consult Mentor on this topic'}
            </button>
          </div>
        )}
      </div>

      {/* 3. STEPPING STONES RIVER PATH TO GRADUATION */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Footprints className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{t.stonesTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.stonesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(data?.steppingStones || [
            { step: 1, name: 'படி 1: கல்லூரி வருகைப்பதிவு (92%)', done: true, note: 'தவறாமல் கல்லூரி செல்கிறார் (Regular)' },
            { step: 2, name: 'படி 2: அடிப்படை இடைவெளி தேர்வு', done: false, note: '1 பயிற்சி தேர்வு நிலுவை (Pending)' },
            { step: 3, name: 'படி 3: ஆசிரியரிடம் சந்தேகம் தெளிவுபெறுதல்', done: true, note: 'வழிகாட்டி ஆசிரியர் பேசினார்' },
            { step: 4, name: 'படி 4: இறுதி பருவத்தேர்வு வெற்றி', done: false, note: 'டிசம்பர் மாதத்தில் நடைபெறும்' },
          ]).map((stone: any, idx: number) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 ${
                stone.done
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center font-black text-xs text-slate-700 dark:text-slate-300">
                  #{stone.step}
                </span>
                {stone.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {stone.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {stone.note}
                </p>
              </div>

              <div className="text-[11px] font-bold">
                {stone.done ? (
                  <span className="text-emerald-600 dark:text-emerald-400">✓ முடிந்தது (Completed)</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">⏳ நிலுவை (Action Pending)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FREQUENTLY ASKED QUESTIONS (COMMON PARENT WORRIES & SIMPLE ANSWERS) */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.qnaTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'ta'
              ? 'பெற்றோர்கள் வழக்கமாக கேட்கும் முக்கிய சந்தேகங்கள்'
              : 'Important questions frequently asked by parents'}
          </p>
        </div>

        <div className="space-y-3">
          {(data?.commonQuestions || [
            {
              q: 'என் குழந்தை இந்த பருவத்தேர்வில் நல்ல மதிப்பெண் பெற்று தேர்ச்சி பெறுவாரா?',
              a: 'கண்டிப்பாக தேர்ச்சி பெறுவார்! கல்லூரி வருகை 92% மிக சிறப்பாக உள்ளது. தர்க்கவியல் பாடத்தில் உள்ள 2 சிறிய பயிற்சிகளை முடித்தால் முதல் வகுப்பில் தேர்ச்சி பெற்று விடுவார்.'
            },
            {
              q: 'இன்று வீட்டில் பெற்றோராகிய நான் என்ன உதவி செய்ய வேண்டும்?',
              a: 'இன்று இரவு குழந்தையிடம் கல்லூரியில் இன்று என்ன பாடம் கற்றாய் என்று 10 நிமிடம் அன்பாக கேளுங்கள். அவர்கள் விவரிக்கும்போது தன்னம்பிக்கை அதிகரிக்கும்.'
            },
            {
              q: 'நான் நேரில் கல்லூரிக்கு வந்து ஆசிரியரை சந்திக்க வேண்டுமா?',
              a: 'நேரில் வர வேண்டிய அவசியமில்லை. கீழே உள்ள பச்சை பட்டனை அழுத்தி ஆசிரியரிடம் வாட்ஸ்அப் அல்லது தொலைபேசி மூலம் நேரடியாக பேசலாம்.'
            }
          ]).map((faq: any, i: number) => {
            const isOpen = expandedFaq === i;
            return (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : i)}
                  className="w-full p-4 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xs font-black">
                      Q
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. DIRECT TEACHER CONNECT & FREE CALLBACK ACTION BAR */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-extrabold text-blue-300 tracking-wider block mb-1">
            Faculty Mentorship
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {t.teacherTitle}
          </h3>
          <p className="text-xs text-slate-200 mt-1 max-w-xl">
            {currentLang === 'ta' ? 'வகுப்பு வழிகாட்டி' : 'Class Faculty'}: <span className="font-extrabold text-white">{student.mentorTeacher}</span> • {currentLang === 'ta' ? 'தொலைபேசி' : 'Contact'}: <span className="font-mono text-emerald-300">{student.mentorPhone}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleWhatsAppTeacher}
            className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.whatsappBtn}</span>
          </button>

          <button
            onClick={handleNotifyTeacher}
            className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{teacherNotified ? '✓ தகவல் அனுப்பப்பட்டது' : t.callBtn}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
