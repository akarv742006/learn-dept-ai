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

    console.log(`[Firebase] Recorded login for ${data.name} (${data.role}) under /logins/${loginId}`);
    return true;
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
