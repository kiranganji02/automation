import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

/**
 * Helper to get current active user ID from localStorage or auth
 */
export const getActiveUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('ipc_user') || '{}');
    return user.id || user.email || 'guest_student';
  } catch (e) {
    return 'guest_student';
  }
};

/**
 * Test Firebase Firestore database connection
 */
export const testDatabaseConnection = async () => {
  if (!isFirebaseConfigured || !db) {
    return { success: false, mode: 'local', message: 'Firebase keys not configured. Running in Local Storage mode.' };
  }
  try {
    const testDoc = doc(db, '_connection_test', 'ping');
    await setDoc(testDoc, { ping: true, timestamp: serverTimestamp() }, { merge: true });
    return { success: true, mode: 'firebase', message: 'Successfully connected to Firebase Cloud Firestore!' };
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return { success: false, mode: 'error', message: error.message || 'Failed to reach Firebase Firestore.' };
  }
};

/**
 * ── 1. USER PROFILE ──
 */
export const saveUserProfileToDb = async (userId, profileData) => {
  // Always update localStorage first for instantaneous UI update
  localStorage.setItem('ipc_user', JSON.stringify({ ...profileData, id: userId }));

  if (!isFirebaseConfigured || !db) return { success: true, localOnly: true };

  try {
    const userRef = doc(db, 'users', String(userId));
    await setDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, localOnly: false };
  } catch (error) {
    console.warn('Firestore write failed for user profile:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfileFromDb = async (userId) => {
  if (!isFirebaseConfigured || !db) {
    const local = localStorage.getItem('ipc_user');
    return local ? JSON.parse(local) : null;
  }

  try {
    const userRef = doc(db, 'users', String(userId));
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      localStorage.setItem('ipc_user', JSON.stringify(data));
      return data;
    }
    const local = localStorage.getItem('ipc_user');
    return local ? JSON.parse(local) : null;
  } catch (error) {
    console.warn('Firestore fetch failed, fallback to local:', error);
    const local = localStorage.getItem('ipc_user');
    return local ? JSON.parse(local) : null;
  }
};

/**
 * ── 2. RESUME ANALYSIS ──
 */
export const saveResumeAnalysisToDb = async (userId, analysisData, rawText = '') => {
  // Dual-write: localStorage
  localStorage.setItem('ipc_resume_analysis', JSON.stringify(analysisData));
  if (rawText) localStorage.setItem('ipc_resume', rawText);

  if (!isFirebaseConfigured || !db) return { success: true, localOnly: true };

  try {
    const resumeRef = doc(db, 'resumes', `${userId}_latest`);
    await setDoc(resumeRef, {
      userId,
      scores: analysisData.scores,
      stats: analysisData.stats,
      sections: analysisData.sections,
      keywords: analysisData.keywords,
      roles: analysisData.roles || [],
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore write failed for resume analysis:', error);
    return { success: false, error: error.message };
  }
};

/**
 * ── 3. JOB ANALYSES & MATCHING ──
 */
export const saveJobAnalysisToDb = async (userId, jobData) => {
  localStorage.setItem('ipc_matched_job', JSON.stringify(jobData));

  if (!isFirebaseConfigured || !db) return { success: true, localOnly: true };

  try {
    const jobRef = doc(db, 'job_analyses', `${userId}_${Date.now()}`);
    await setDoc(jobRef, {
      userId,
      ...jobData,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.warn('Firestore write failed for job analysis:', error);
    return { success: false, error: error.message };
  }
};

/**
 * ── 4. SKILL GAP ASSESSMENT ──
 */
export const saveSkillAssessmentToDb = async (userId, skillData) => {
  localStorage.setItem('ipc_skill_gap_result', JSON.stringify(skillData));

  if (!isFirebaseConfigured || !db) return { success: true, localOnly: true };

  try {
    const skillRef = doc(db, 'skill_assessments', `${userId}_latest`);
    await setDoc(skillRef, {
      userId,
      ...skillData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore write failed for skill assessment:', error);
    return { success: false, error: error.message };
  }
};

/**
 * ── 5. MOCK INTERVIEW RESULTS ──
 */
export const saveInterviewResultToDb = async (userId, interviewData) => {
  // Update local history
  try {
    const current = JSON.parse(localStorage.getItem('ipc_interview_history') || '[]');
    current.unshift(interviewData);
    localStorage.setItem('ipc_interview_history', JSON.stringify(current.slice(0, 20)));
  } catch (e) {
    console.warn(e);
  }

  if (!isFirebaseConfigured || !db) return { success: true, localOnly: true };

  try {
    const interviewRef = doc(db, 'interviews', `${userId}_${Date.now()}`);
    await setDoc(interviewRef, {
      userId,
      ...interviewData,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.warn('Firestore write failed for interview result:', error);
    return { success: false, error: error.message };
  }
};

/**
 * ── 6. PREPARATION PLANS ──
 */
export const savePrepPlanToDb = async (userId, planData) => {
  localStorage.setItem('ipc_prep_plan', JSON.stringify(planData));

  if (!isFirebaseConfigured || !db) return { success: true, localOnly: true };

  try {
    const planRef = doc(db, 'prep_plans', `${userId}_latest`);
    await setDoc(planRef, {
      userId,
      ...planData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore write failed for preparation plan:', error);
    return { success: false, error: error.message };
  }
};
