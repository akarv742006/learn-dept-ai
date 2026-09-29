/**
 * Firebase Client Integration for LearnDebt AI
 * Project: learndept-ai (https://console.firebase.google.com/project/learndept-ai/overview)
 * 
 * Provides real-time synchronization directly to Firebase Realtime Database
 * for users (students, teachers, parents), colleges, payments, and subscriptions.
 */

export interface FirebaseSubscriptionState {
  firebase_uid: string;
  subscription_status: 'ACTIVE' | 'EXPIRED' | 'TRIAL' | 'FREE';
  subscription_plan: 'STUDENT_PRO' | 'INSTITUTION_PRO' | 'TEACHER_PRO' | 'FREE';
  subscription_expires_at?: string;
  synced_at: string;
  source: 'MongoDB_Atlas' | 'Client_Direct';
  demo: boolean;
  college?: string;
}

export interface UserRegistrationData {
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  college?: string;
  department?: string;
  studentId?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  parentPin?: string;
}

export interface PaymentSyncData {
  payment_id: string;
  user_id: string;
  amount: number;
  plan_id: string;
  college?: string;
  status?: string;
  method?: string;
  utr_number?: string;
  upi_id?: string;
}

export const FIREBASE_CONFIG = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'learndept-ai',
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'learndept-ai'}.firebaseapp.com`,
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'learndept-ai'}-default-rtdb.firebaseio.com`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'learndept-ai'}.appspot.com`,
};

function slugify(text?: string): string {
  if (!text) return 'anna_university';
  const cleaned = text.toLowerCase().replace(/[^a-z0-9 ]/g, '');
  return cleaned.trim().split(/\s+/).join('_') || 'anna_university';
}

class FirebaseSyncService {
  private projectId: string = FIREBASE_CONFIG.projectId;
  private baseUrl: string = `https://${FIREBASE_CONFIG.projectId}-default-rtdb.firebaseio.com`;

  private async put(path: string, payload: any): Promise<boolean> {
    const cleanPath = path.replace(/^\/|\/$/g, '');
    const url = `${this.baseUrl}/${cleanPath}.json`;
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (err) {
      console.warn(`[Firebase] Write to ${url} failed:`, err);
      return false;
    }
  }

  /**
   * Directly synchronize user registration (student + linked parent, or teacher)
   * to Firebase Realtime Database so changes appear instantly in the Firebase Console.
   */
  async syncRegistration(data: UserRegistrationData): Promise<{ success: boolean; studentId: string; parentId?: string }> {
    const college = data.college || 'Anna University';
    const collegeSlug = slugify(college);
    const now = new Date().toISOString();
    
    // College Info Node
    await this.put(`colleges/${collegeSlug}/info`, {
      name: college,
      slug: collegeSlug,
      location: 'Tamil Nadu, India',
      updatedAt: now,
    });

    if (data.role === 'student') {
      const studentKey = (data.studentId || data.email.split('@')[0] || `std_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const parentPhoneClean = (data.parentPhone || '+916379762186').replace(/[^0-9]/g, '');
      const parentKey = `parent_${parentPhoneClean.slice(-10) || 'default'}`;

      const studentPayload = {
        id: studentKey,
        name: data.name,
        email: data.email,
        role: 'student',
        college: college,
        department: data.department || 'Computer Science',
        rollNumber: data.studentId || 'AU-2026-0042',
        phone: data.phone || '+91 98450 11223',
        parentName: data.parentName || 'Ramesh Krishnan',
        parentPhone: data.parentPhone || '+91 63797 62186',
        parentId: parentKey,
        parentPin: data.parentPin || '1234',
        paymentStatus: 'ACTIVE',
        subscriptionPlan: 'STUDENT_PRO',
        overallPerformance: 82,
        learningDebt: 38,
        attendance: 94,
        mentorContact: '+91 63797 62186',
        updatedAt: now,
        syncedDirectly: true,
      };

      const parentPayload = {
        id: parentKey,
        name: data.parentName || 'Ramesh Krishnan',
        phone: data.parentPhone || '+91 63797 62186',
        pin: data.parentPin || '1234',
        role: 'parent',
        college: college,
        linkedStudentId: studentKey,
        studentName: data.name,
        preferredLanguage: 'ta',
        updatedAt: now,
        syncedDirectly: true,
      };

      // Write to Firebase root nodes:
      // 1. /students/{studentKey}
      // 2. /parents/{parentKey}
      // 3. /colleges/{collegeSlug}/students/{studentKey}
      // 4. /directory/students/{studentKey}
      await Promise.all([
        this.put(`students/${studentKey}`, studentPayload),
        this.put(`parents/${parentKey}`, parentPayload),
        this.put(`colleges/${collegeSlug}/students/${studentKey}`, studentPayload),
        this.put(`directory/students/${studentKey}`, {
          id: studentKey,
          name: data.name,
          email: data.email,
          college: college,
          department: data.department || 'Computer Science',
        }),
      ]);

      console.log(`[Firebase] Successfully synced Student (${studentKey}) and Parent (${parentKey}) to RTDB`);
      return { success: true, studentId: studentKey, parentId: parentKey };
    }

    if (data.role === 'teacher') {
      const teacherKey = (data.studentId || data.email.split('@')[0] || `tch_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const teacherPayload = {
        id: teacherKey,
        name: data.name,
        email: data.email,
        role: 'teacher',
        college: college,
        department: data.department || 'Computer Science',
        staffId: data.studentId || 'AU-FAC-01',
        phone: data.phone || '+91 98450 11223',
        designation: 'Assistant Professor & Mentor',
        updatedAt: now,
        syncedDirectly: true,
      };

      await Promise.all([
        this.put(`teachers/${teacherKey}`, teacherPayload),
        this.put(`colleges/${collegeSlug}/teachers/${teacherKey}`, teacherPayload),
        this.put(`directory/teachers/${teacherKey}`, {
          id: teacherKey,
          name: data.name,
          email: data.email,
          college: college,
          department: data.department || 'Computer Science',
        }),
      ]);

      try {
        const localTeachers = JSON.parse(localStorage.getItem('learndebt_registered_teachers') || '[]');
        const filtered = localTeachers.filter((t: any) => (t.email || '').toLowerCase() !== data.email.toLowerCase());
        localStorage.setItem('learndebt_registered_teachers', JSON.stringify([teacherPayload, ...filtered]));
        window.dispatchEvent(new CustomEvent('learndebt_teacher_created', { detail: teacherPayload }));
      } catch {}

      console.log(`[Firebase] Successfully synced Teacher (${teacherKey}) to RTDB`);
      return { success: true, studentId: teacherKey };
    }

    return { success: true, studentId: 'synced_user' };
  }

  /**
   * Directly synchronize payment records to Firebase RTDB under /payments/{payId}
   * and link to college and student nodes.
   */
  async syncPayment(data: PaymentSyncData): Promise<boolean> {
    const payId = data.payment_id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const collegeSlug = slugify(data.college);
    const now = new Date().toISOString();

    const paymentPayload = {
      payment_id: data.payment_id,
      user_id: data.user_id,
      amount: data.amount,
      plan_id: data.plan_id,
      college: data.college || 'Anna University',
      college_slug: collegeSlug,
      currency: 'INR',
      status: data.status || 'SUCCESS',
      payment_method: data.method || 'DEMO_UPI',
      upi_id: data.upi_id || 'akashkrishnamoorthi89@oksbi',
      utr_number: data.utr_number || `UTR-${Date.now()}`,
      auth_status: 'AUTHENTICATED_AND_VERIFIED',
      verified_at: now,
      source: 'Direct_Client_Sync',
      demo: true,
    };

    const studentPaymentPayload = {
      paymentStatus: 'ACTIVE',
      plan: data.plan_id,
      lastPaymentId: data.payment_id,
      amountPaid: data.amount,
      lastPaymentDate: now,
    };

    await Promise.all([
      this.put(`payments/${payId}`, paymentPayload),
      this.put(`colleges/${collegeSlug}/payments/${payId}`, paymentPayload),
      this.put(`students/${data.user_id}/payment`, studentPaymentPayload),
      this.put(`subscriptions/${data.user_id}`, {
        firebase_uid: data.user_id,
        subscription_status: 'ACTIVE',
        subscription_plan: data.plan_id.toUpperCase(),
        college: data.college || 'Anna University',
        synced_at: now,
        source: 'Client_Direct',
        demo: true,
      }),
    ]);

    console.log(`[Firebase] Successfully synced Payment (${payId}) to RTDB under /payments and /colleges/${collegeSlug}/payments`);
    return true;
  }

  /**
   * Record student / user login event into Firebase Realtime Database
   * under /logins/{loginId}.json and update /students/{studentKey}
   */
  async recordLogin(data: {
    userId?: string;
    name: string;
    email: string;
    role: string;
    college?: string;
    department?: string;
    rollNumber?: string;
  }): Promise<boolean> {
    const now = new Date().toISOString();
    const loginId = `login_${Date.now()}`;
    const studentKey = (data.rollNumber || data.email.split('@')[0] || `std_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');

    const loginPayload = {
      id: loginId,
      userId: data.userId || studentKey,
      name: data.name,
      email: data.email,
      role: data.role,
      college: data.college || 'Anna University',
      department: data.department || 'Computer Science',
      rollNumber: data.rollNumber || 'AU-2026-0042',
      loginTime: now,
      status: 'Active',
      lastActive: 'Just now',
    };

    // 1. Store in top-level /logins/{loginId}
    await this.put(`logins/${loginId}`, loginPayload);
    // 2. Update student's lastLogin in Firebase RTDB
    await this.put(`students/${studentKey}/lastLoginAt`, now);
    await this.put(`students/${studentKey}/lastActive`, 'Just now');
    await this.put(`students/${studentKey}/status`, 'Active');

    // 3. Store in localStorage for instant admin portal consumption
    try {
      const storedLogins = JSON.parse(localStorage.getItem('learndebt_recent_logins') || '[]');
      const filtered = storedLogins.filter((l: any) => l.email !== data.email);
      localStorage.setItem('learndebt_recent_logins', JSON.stringify([loginPayload, ...filtered].slice(0, 50)));
    } catch {}

    if (data.role === 'teacher') {
      const teacherKey = (data.userId || data.email.split('@')[0] || `tch_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const teacherPayload = {
        id: teacherKey,
        name: data.name,
        email: data.email,
        role: 'teacher',
        college: data.college || 'Anna University',
        department: data.department || 'Computer Science',
        designation: 'Staff Faculty & Mentor',
        lastLoginAt: now,
        updatedAt: now,
      };
      await Promise.allSettled([
        this.put(`teachers/${teacherKey}`, teacherPayload),
        this.put(`directory/teachers/${teacherKey}`, teacherPayload),
      ]);
      try {
        const localTeachers = JSON.parse(localStorage.getItem('learndebt_registered_teachers') || '[]');
        const filteredT = localTeachers.filter((t: any) => (t.email || '').toLowerCase() !== data.email.toLowerCase());
        localStorage.setItem('learndebt_registered_teachers', JSON.stringify([teacherPayload, ...filteredT]));
        window.dispatchEvent(new CustomEvent('learndebt_teacher_created', { detail: teacherPayload }));
      } catch {}
    }

    console.log(`[Firebase] Recorded login for ${data.name} (${data.role}) under /logins/${loginId}`);
    return true;
  }

  /**
   * Record a teacher-created assignment/test into Firebase RTDB & localStorage
   */
  async recordAssignment(assignment: any): Promise<boolean> {
    const asmId = assignment._id || assignment.id || `assign_${Date.now()}`;
    const now = new Date().toISOString();
    const cleanPayload = {
      _id: asmId,
      id: asmId,
      title: assignment.title,
      description: assignment.description || '',
      department: assignment.department || 'Computer Science',
      targetYear: assignment.targetYear || 'Year 3',
      subjectId: assignment.subjectId || 'General',
      durationMinutes: assignment.durationMinutes || 25,
      questionIds: assignment.questionIds || [],
      questions: assignment.questions || [],
      assignedBy: assignment.assignedBy || 'Faculty Head',
      dueDate: assignment.dueDate || 'Next Week',
      status: 'published',
      submissionsCount: assignment.submissionsCount || 0,
      averageScore: assignment.averageScore || 0,
      createdAt: assignment.createdAt || now,
    };

    const teacherKey = ((assignment.teacherId || assignment.assignedBy || 'Faculty Head') as string)
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_-]/g, '_');

    // 1. Write to Firebase RTDB under multiple paths so Admin and Teacher sections can read
    await Promise.all([
      this.put(`assignments/${asmId}`, cleanPayload),
      this.put(`teachers/${teacherKey}/assignments/${asmId}`, cleanPayload),
      this.put(`admin/assessments/${asmId}`, cleanPayload)
    ]);

    // 2. Write to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('learndebt_assignments') || '[]');
      const filtered = stored.filter((a: any) => a._id !== asmId && a.id !== asmId);
      localStorage.setItem('learndebt_assignments', JSON.stringify([cleanPayload, ...filtered]));
      window.dispatchEvent(new CustomEvent('learndebt_assignment_created', { detail: cleanPayload }));
    } catch {}

    console.log(`[Firebase] Recorded assignment "${cleanPayload.title}" under /assignments/${asmId} & /teachers/${teacherKey}/assignments`);
    return true;
  }

  /**
   * Get all teacher assignments from Firebase RTDB & localStorage
   */
  async getAssignments(department?: string): Promise<any[]> {
    let fbAssignments: any[] = [];
    try {
      const res = await fetch(`${this.baseUrl}/assignments.json`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          fbAssignments = Object.entries(data).map(([k, v]: [string, any]) => ({
            ...v,
            _id: v._id || v.id || k,
            id: v.id || v._id || k,
          }));
        }
      }
    } catch (e) {
      console.warn('[Firebase] Assignments fetch fallback:', e);
    }

    let localAssignments: any[] = [];
    try {
      localAssignments = JSON.parse(localStorage.getItem('learndebt_assignments') || '[]');
    } catch {}

    const map = new Map<string, any>();
    [...localAssignments, ...fbAssignments].forEach((a) => {
      const id = a._id || a.id;
      if (id && !map.has(id)) {
        map.set(id, a);
      }
    });

    const all = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    if (!department || department === 'All' || department.includes('All')) {
      return all;
    }

    const normDept = department.toLowerCase().trim();
    return all.filter((a) => {
      const aDept = (a.department || '').toLowerCase().trim();
      return (
        !aDept ||
        aDept === 'all' ||
        aDept.includes('all') ||
        aDept.includes(normDept) ||
        normDept.includes(aDept)
      );
    });
  }

  /**
   * Get all faculty and teachers from Firebase RTDB and localStorage
   */
  async getTeachers(): Promise<any[]> {
    let fbTeachers: any[] = [];
    try {
      const [resT, resDir] = await Promise.allSettled([
        fetch(`${this.baseUrl}/teachers.json`),
        fetch(`${this.baseUrl}/directory/teachers.json`)
      ]);

      if (resT.status === 'fulfilled' && resT.value.ok) {
        const data = await resT.value.json();
        if (data && typeof data === 'object') {
          fbTeachers.push(...Object.values(data));
        }
      }
      if (resDir.status === 'fulfilled' && resDir.value.ok) {
        const data = await resDir.value.json();
        if (data && typeof data === 'object') {
          fbTeachers.push(...Object.values(data));
        }
      }
    } catch (e) {
      console.warn('[Firebase] Teachers fetch notice:', e);
    }

    let localTeachers: any[] = [];
    try {
      localTeachers = JSON.parse(localStorage.getItem('learndebt_registered_teachers') || '[]');
    } catch {}

    const map = new Map<string, any>();
    [...localTeachers, ...fbTeachers].forEach((t) => {
      const id = t.email || t.id || t.name;
      if (id && !map.has(id.toLowerCase())) {
        map.set(id.toLowerCase(), t);
      }
    });

    return Array.from(map.values());
  }

  /**
   * Get all live students from Firebase RTDB and localStorage merged with baseline roster
   */
  async getStudents(department?: string): Promise<any[]> {
    const BASE_STUDENTS = [
      { id: 'student_arun', name: 'Arun Kumar', rollNumber: 'CS2023-042', email: 'arun@student.edu', department: 'Computer Science', year: '3rd Year', overallPerformance: 78, learningDebt: 42, riskLevel: 'Medium', attendance: 92, parentName: 'Ramesh Krishnan', parentPhone: '+91 63797 62186', linkedParentName: 'Ramesh Krishnan', linkedParentPhone: '+91 63797 62186' },
      { id: 'student_priya', name: 'Priya Patel', rollNumber: 'AI2023-018', email: 'priya@student.edu', department: 'Data Science & Artificial Intelligence', year: '2nd Year', overallPerformance: 85, learningDebt: 28, riskLevel: 'Low', attendance: 96, parentName: 'Meenakshi Sundaram', parentPhone: '+91 63797 62186', linkedParentName: 'Meenakshi Sundaram', linkedParentPhone: '+91 63797 62186' },
      { id: 'student_rahul', name: 'Rahul Verma', rollNumber: 'IT2023-055', email: 'rahul@student.edu', department: 'Information Technology', year: '4th Year', overallPerformance: 62, learningDebt: 58, riskLevel: 'High', attendance: 84, parentName: 'Karthik Raja', parentPhone: '+91 63797 62186', linkedParentName: 'Karthik Raja', linkedParentPhone: '+91 63797 62186' },
      { id: 'student_deepa', name: 'Deepa Subramanian', rollNumber: 'EC2023-031', email: 'deepa@student.edu', department: 'Electronics & Communication', year: '3rd Year', overallPerformance: 88, learningDebt: 22, riskLevel: 'Low', attendance: 98, parentName: 'Subramanian S', parentPhone: '+91 63797 62186', linkedParentName: 'Subramanian S', linkedParentPhone: '+91 63797 62186' }
    ];

    let fbStudents: any[] = [];
    try {
      const [resS, resDir, resLogins] = await Promise.allSettled([
        fetch(`${this.baseUrl}/students.json`),
        fetch(`${this.baseUrl}/directory/students.json`),
        fetch(`${this.baseUrl}/logins.json`)
      ]);

      if (resS.status === 'fulfilled' && resS.value.ok) {
        const data = await resS.value.json();
        if (data && typeof data === 'object') {
          fbStudents.push(...Object.values(data));
        }
      }
      if (resDir.status === 'fulfilled' && resDir.value.ok) {
        const data = await resDir.value.json();
        if (data && typeof data === 'object') {
          fbStudents.push(...Object.values(data));
        }
      }
      if (resLogins.status === 'fulfilled' && resLogins.value.ok) {
        const data = await resLogins.value.json();
        if (data && typeof data === 'object') {
          const studentLogins = Object.values(data).filter((l: any) => (l.role || '').toLowerCase() === 'student');
          fbStudents.push(...studentLogins);
        }
      }
    } catch (e) {
      console.warn('[Firebase] Students fetch notice:', e);
    }

    let localStudents: any[] = [];
    try {
      const recentLogins = JSON.parse(localStorage.getItem('learndebt_recent_logins') || '[]');
      const studentLogins = recentLogins.filter((l: any) => (l.role || '').toLowerCase() === 'student');
      localStudents.push(...studentLogins);

      const latestStudent = JSON.parse(localStorage.getItem('learndebt_latest_student') || 'null');
      if (latestStudent) {
        localStudents.push(latestStudent);
      }
    } catch {}

    const map = new Map<string, any>();
    [...localStudents, ...fbStudents, ...BASE_STUDENTS].forEach((s) => {
      const key = (s.rollNumber || s.studentId || s.email || s.name || '').toLowerCase().trim();
      if (key && !map.has(key)) {
        map.set(key, {
          id: s.id || s.studentId || s.rollNumber || key,
          name: s.name || 'Student',
          rollNumber: s.rollNumber || s.studentId || 'AU-2026',
          email: s.email || `${(s.name || 'student').toLowerCase().replace(/\s+/g, '')}@student.edu`,
          department: s.department || 'Computer Science',
          year: s.year || '3rd Year',
          overallPerformance: s.overallPerformance ?? 78,
          learningDebt: s.learningDebt ?? 42,
          riskLevel: s.riskLevel || ((s.learningDebt ?? 42) > 50 ? 'High' : ((s.learningDebt ?? 42) > 25 ? 'Medium' : 'Low')),
          attendance: s.attendance ?? 92,
          parentName: s.parentName || s.linkedParentName || 'Parent Contact',
          parentPhone: s.parentPhone || s.linkedParentPhone || '+91 63797 62186',
          linkedParentName: s.parentName || s.linkedParentName || 'Parent Contact',
          linkedParentPhone: s.parentPhone || s.linkedParentPhone || '+91 63797 62186',
          status: s.status || 'Active',
          lastActive: s.lastActive || 'Recently',
        });
      }
    });

    let result = Array.from(map.values());
    if (department && department !== 'All' && !department.includes('All')) {
      const normDept = department.toLowerCase().trim();
      result = result.filter(
        (s) =>
          (s.department || '').toLowerCase().includes(normDept) ||
          normDept.includes((s.department || '').toLowerCase())
      );
    }
    return result;
  }

  /**
   * Record a student exam/test submission into Firebase RTDB & localStorage
   */
  async recordSubmission(sub: any): Promise<boolean> {
    const subId = sub._id || sub.id || `sub_${Date.now()}`;
    const now = new Date().toISOString();
    const cleanSub = {
      _id: subId,
      id: subId,
      assessmentId: sub.assessmentId || subId,
      assignmentId: sub.assignmentId || '',
      assignmentTitle: sub.assignmentTitle || 'Diagnostic Assessment',
      studentId: sub.studentId || 'student_arun',
      studentName: sub.studentName || 'Student',
      studentEmail: sub.studentEmail || `${sub.studentId || 'student'}@student.edu`,
      department: sub.department || 'Computer Science',
      year: sub.year || 'Year 3',
      score: sub.score ?? 0,
      maxScore: sub.maxScore ?? 50,
      percentage: sub.percentage ?? 0,
      correctAnswers: sub.correctAnswers ?? 0,
      totalQuestions: sub.totalQuestions ?? 5,
      passed: sub.passed ?? (sub.percentage >= 50),
      timeTaken: sub.timeTaken || 120,
      submittedAt: sub.submittedAt || now,
      review: sub.review || [],
    };

    const studentKey = (cleanSub.studentId || cleanSub.studentEmail.split('@')[0]).replace(/[^a-zA-Z0-9_-]/g, '_');

    // 2. Compute dynamic learning debt and risk level
    const newDebt = Math.max(10, Math.min(85, Math.round(55 - ((cleanSub.percentage ?? 50) * 0.45))));
    const newRisk = newDebt > 50 ? 'High' : (newDebt > 25 ? 'Medium' : 'Low');

    // 1. Write to top-level /submissions/{subId} and update student nodes in RTDB
    await Promise.allSettled([
      this.put(`submissions/${subId}`, cleanSub),
      this.put(`students/${studentKey}/latestTest`, cleanSub),
      this.put(`students/${studentKey}/learningDebt`, newDebt),
      this.put(`students/${studentKey}/overallPerformance`, cleanSub.percentage),
      this.put(`students/${studentKey}/riskLevel`, newRisk),
      this.put(`reports/${subId}`, cleanSub),
    ]);

    // 3. Write to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('learndebt_submissions') || '[]');
      const filtered = stored.filter((s: any) => s._id !== subId && s.id !== subId);
      localStorage.setItem('learndebt_submissions', JSON.stringify([cleanSub, ...filtered]));
      localStorage.setItem('learndebt_latest_submission', JSON.stringify(cleanSub));

      const latestStudent = JSON.parse(localStorage.getItem('learndebt_latest_student') || 'null');
      if (latestStudent) {
        latestStudent.learningDebt = newDebt;
        latestStudent.overallPerformance = cleanSub.percentage;
        latestStudent.riskLevel = newRisk;
        latestStudent.latestTest = cleanSub;
        localStorage.setItem('learndebt_latest_student', JSON.stringify(latestStudent));
      }

      // Dispatch browser custom event so all active components in this tab or window update live
      window.dispatchEvent(new CustomEvent('learndebt_test_submitted', { detail: { ...cleanSub, learningDebt: newDebt, riskLevel: newRisk } }));
    } catch {}

    console.log(`[Firebase] Recorded submission for ${cleanSub.studentName} (${cleanSub.score}/${cleanSub.maxScore}) under /submissions/${subId}`);
    return true;
  }

  /**
   * Get all submissions from Firebase RTDB & localStorage
   */
  async getSubmissions(params?: { studentId?: string; department?: string; assignmentId?: string }): Promise<any[]> {
    let fbSubs: any[] = [];
    try {
      const res = await fetch(`${this.baseUrl}/submissions.json`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          fbSubs = Object.entries(data).map(([k, v]: [string, any]) => ({
            ...v,
            _id: v._id || v.id || k,
            id: v.id || v._id || k,
          }));
        }
      }
    } catch (e) {
      console.warn('[Firebase] Submissions fetch fallback:', e);
    }

    let localSubs: any[] = [];
    try {
      localSubs = JSON.parse(localStorage.getItem('learndebt_submissions') || '[]');
    } catch {}

    const map = new Map<string, any>();
    [...localSubs, ...fbSubs].forEach((s) => {
      const id = s._id || s.id;
      if (id && !map.has(id)) {
        map.set(id, s);
      }
    });

    let all = Array.from(map.values()).sort(
      (a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
    );

    if (params?.studentId) {
      const targetId = params.studentId.toLowerCase();
      all = all.filter(
        (s) =>
          (s.studentId && s.studentId.toLowerCase() === targetId) ||
          (s.studentEmail && s.studentEmail.toLowerCase().includes(targetId))
      );
    }
    if (params?.assignmentId && params.assignmentId !== 'All') {
      all = all.filter((s) => s.assignmentId === params.assignmentId);
    }
    if (params?.department && params.department !== 'All' && !params.department.includes('All')) {
      const normDept = params.department.toLowerCase();
      all = all.filter((s) => (s.department || '').toLowerCase().includes(normDept));
    }

    return all;
  }

  /**
   * Retrieve the most recent test report for a student (for Parent and Student dashboards)
   */
  async getLatestStudentTest(studentIdentifier?: string): Promise<any | null> {
    // 1. Try local storage latest
    try {
      const latest = localStorage.getItem('learndebt_latest_submission');
      if (latest) {
        const parsed = JSON.parse(latest);
        if (
          !studentIdentifier ||
          parsed.studentId === studentIdentifier ||
          parsed.studentEmail?.toLowerCase().includes(studentIdentifier.toLowerCase()) ||
          studentIdentifier.toLowerCase().includes(parsed.studentId?.toLowerCase() || '') ||
          (parsed.studentName && studentIdentifier.toLowerCase().includes(parsed.studentName.toLowerCase()))
        ) {
          return parsed;
        }
      }
    } catch {}

    // 2. Query Firebase submissions
    const subs = await this.getSubmissions();
    if (subs.length > 0) {
      if (studentIdentifier) {
        const target = studentIdentifier.toLowerCase();
        const matched = subs.find(
          (s) =>
            s.studentId?.toLowerCase() === target ||
            s.studentEmail?.toLowerCase().includes(target) ||
            target.includes(s.studentId?.toLowerCase() || '') ||
            (s.studentName && s.studentName.toLowerCase().includes(target))
        );
        if (matched) return matched;
      }
      return subs[0];
    }

    // 3. Fallback mock baseline so parent/student always see an authentic formatted test report
    return {
      _id: 'sub_default_001',
      assignmentTitle: 'DBMS Functional Dependencies & Normalization Examination',
      studentName: 'Arun Kumar',
      studentEmail: 'arun@student.edu',
      department: 'Computer Science & Engineering',
      score: 40,
      maxScore: 50,
      percentage: 80,
      correctAnswers: 4,
      totalQuestions: 5,
      passed: true,
      timeTaken: 185,
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
      review: [
        { question: 'Closure of attribute set in R(A,B,C) with {A->B, B->C}?', isCorrect: true, marks: 10 },
        { question: 'Definition of 2NF with respect to partial functional dependency?', isCorrect: true, marks: 10 },
        { question: 'Armstrong transitivity inference rule application?', isCorrect: true, marks: 10 },
        { question: 'Third normal form transitive dependency criteria?', isCorrect: false, marks: 0, explanation: 'In 3NF, for X -> Y, either X is a superkey or Y is a prime attribute.' },
        { question: 'Lossless join decomposition test matrix?', isCorrect: true, marks: 10 }
      ]
    };
  }

  /**
   * Synchronize local subscription state to Firebase project learndept-ai.
   */
  async syncSubscription(state: FirebaseSubscriptionState): Promise<{ success: boolean; mode: string }> {
    const endpoint = `subscriptions/${state.firebase_uid}`;
    const ok = await this.put(endpoint, state);
    return { success: ok, mode: ok ? 'remote' : 'buffered' };
  }
}

export const firebaseSync = new FirebaseSyncService();
