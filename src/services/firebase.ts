/**
 * Firebase Client Integration for LearnDebt AI
 * Project: learndept-ai (https://console.firebase.google.com/project/learndept-ai/overview)
 * 
 * MongoDB Atlas remains the Single Source of Truth.
 * Firebase provides real-time secondary subscription state synchronization and notifications.
 */

export interface FirebaseSubscriptionState {
  firebase_uid: string;
  subscription_status: 'ACTIVE' | 'EXPIRED' | 'TRIAL' | 'FREE';
  subscription_plan: 'STUDENT_PRO' | 'INSTITUTION_PRO' | 'TEACHER_PRO' | 'FREE';
  subscription_expires_at?: string;
  synced_at: string;
  source: 'MongoDB_Atlas';
  demo: boolean;
}

export const FIREBASE_CONFIG = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'learndept-ai',
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'learndept-ai'}.firebaseapp.com`,
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'learndept-ai'}-default-rtdb.firebaseio.com`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'learndept-ai'}.appspot.com`,
};

class FirebaseSyncService {
  private projectId: string = FIREBASE_CONFIG.projectId;
  private localCache: Map<string, FirebaseSubscriptionState> = new Map();

  /**
   * Synchronize local subscription state to Firebase project learndept-ai.
   * If remote network fails, local memory buffer retains the state safely without breaking user flow.
   */
  async syncSubscription(state: FirebaseSubscriptionState): Promise<{ success: boolean; mode: string }> {
    this.localCache.set(state.firebase_uid, state);
    
    try {
      const endpoint = `https://${this.projectId}-default-rtdb.firebaseio.com/subscriptions/${state.firebase_uid}.json`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      if (response.ok) {
        console.log(`[Firebase] Successfully synced subscription for ${state.firebase_uid} to ${this.projectId}`);
        return { success: true, mode: 'remote' };
      }
    } catch {
      console.warn(`[Firebase] Network sync offline for ${this.projectId}. MongoDB Atlas is authoritative.`);
    }

    return { success: true, mode: 'buffered' };
  }

  /**
   * Read cached subscription state.
   */
  getCachedSubscription(userId: string): FirebaseSubscriptionState | null {
    return this.localCache.get(userId) || null;
  }
}

export const firebaseSync = new FirebaseSyncService();
