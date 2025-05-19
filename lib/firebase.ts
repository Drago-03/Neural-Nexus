import { initializeApp, getApps, getApp, FirebaseOptions, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit as firestoreLimit,
  CollectionReference,
  DocumentData,
  Firestore,
  enableMultiTabIndexedDbPersistence,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  connectFirestoreEmulator,
  Timestamp,
  deleteDoc,
  increment,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  FirebaseStorage,
  deleteObject
} from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAnalytics, logEvent, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getPerformance, trace } from 'firebase/performance';

// Error reporting
type ErrorWithMessage = {
  message: string;
  [key: string]: any;
};

const logError = (error: unknown) => {
  // Improve error object for logging
  const errorWithMessage = error as ErrorWithMessage;
  console.error("Firebase Error:", {
    message: errorWithMessage.message || "Unknown error",
    code: errorWithMessage.code,
    stack: errorWithMessage.stack,
    timestamp: new Date().toISOString(),
  });
};

// Configure Firebase
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;
let githubProvider: GithubAuthProvider;
let functions: any;
let analytics: any = null;
let performance: any = null;

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isClient = typeof window !== 'undefined';

// Only initialize Firebase if we have valid config
const hasValidConfig = firebaseConfig.apiKey && 
                      firebaseConfig.apiKey !== "undefined" &&
                      firebaseConfig.projectId && 
                      firebaseConfig.appId;

if (hasValidConfig) {
  try {
    // Initialize Firebase
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    // Initialize auth with persistence
    auth = getAuth(app);
    
    // Set auth persistence on client side only
    if (isClient) {
      setPersistence(auth, browserLocalPersistence).catch(logError);
    }
    
    // Initialize Firestore with settings for better performance
    if (!getApps().length) {
      db = initializeFirestore(app, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      });
      
      // Enable offline persistence when supported
      if (isClient) {
        enableIndexedDbPersistence(db).catch((err) => {
          if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab
            console.warn('Firebase persistence unavailable - multiple tabs open');
          } else if (err.code === 'unimplemented') {
            // Current browser doesn't support persistence
            console.warn('Firebase persistence not supported in this browser');
          }
        });
      }
    } else {
      db = getFirestore(app);
    }
    
    // Initialize other services
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();
    functions = getFunctions(app);
    
    // Only initialize analytics and performance on client in production
    if (isClient) {
      // Initialize analytics if supported by the browser
      isAnalyticsSupported().then((supported) => {
        if (supported && isProduction) {
          analytics = getAnalytics(app);
          performance = getPerformance(app);
          
          // Log app initialization
          logEvent(analytics, 'app_initialized');
        }
      }).catch(logError);
    }
    
    // Use emulators in development
    if (isDevelopment && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
      // Connect to emulators if available
      if (isClient) {
        const host = 'localhost';
        connectFirestoreEmulator(db, host, 8080);
        // Add other emulators as needed
        console.log('Using Firebase emulators for development');
      }
    }
    
    console.log("Firebase initialized successfully");
  } catch (error) {
    logError(error);
    // Create minimal placeholders to prevent app crashes
    createPlaceholders();
  }
} else {
  console.warn("Firebase config is missing or invalid. Using placeholders.");
  createPlaceholders();
}

// Create placeholder objects to prevent app crashes
function createPlaceholders() {
  const noop = () => {};
  const noopPromise = () => Promise.resolve(null);
  
  // Mock Auth
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
      setTimeout(() => callback(null), 0);
      return noop;
    },
    signInWithPopup: noopPromise,
    signOut: noopPromise,
    createUserWithEmailAndPassword: noopPromise,
    signInWithEmailAndPassword: noopPromise,
    sendPasswordResetEmail: noopPromise,
  } as unknown as Auth;
  
  // Mock Firestore
  db = { 
    collection: () => ({}),
    doc: () => ({
      get: noopPromise,
      set: noopPromise,
      update: noopPromise,
    }),
  } as unknown as Firestore;
  
  // Mock Storage
  storage = {
    ref: () => ({
      put: noopPromise,
      getDownloadURL: noopPromise,
    }),
  } as unknown as FirebaseStorage;
  
  // Mock provider
  googleProvider = {} as GoogleAuthProvider;
  githubProvider = {} as GithubAuthProvider;
  
  // Mock functions
  functions = {
    httpsCallable: () => noopPromise,
  };
  
  // Mock analytics
  analytics = {
    logEvent: noop,
  };
  
  // Mock performance
  performance = {
    trace: () => ({ start: noop, stop: noop }),
  };
}

// Analytics helper
export const trackEvent = (eventName: string, eventParams?: any) => {
  try {
    if (analytics && isProduction) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (error) {
    logError(error);
  }
};

// Performance monitoring helper
export const startTrace = (traceName: string) => {
  try {
    if (performance && isProduction) {
      const newTrace = trace(performance, traceName);
      newTrace.start();
      return newTrace;
    }
  } catch (error) {
    logError(error);
  }
  return null;
};

// Authentication functions
export const signInWithGoogle = async () => {
  if (!hasValidConfig) {
    console.warn("Firebase auth not available - using demo mode");
    return {
      uid: "demo-user-123",
      displayName: "Demo User",
      email: "mantejarora@gmail.com",
      photoURL: "/default-avatar.png",
    } as unknown as FirebaseUser;
  }
  
  try {
    const traceObj = startTrace('auth_sign_in_google');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create or update user in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user document
      await setDoc(userRef, {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        walletConnected: false,
        ownedModels: []
      });
    } else {
      // Update login timestamp
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    }
    
    trackEvent('login', { method: 'google' });
    traceObj?.stop();
    
    return user;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      id: user.uid,
      name: displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      walletConnected: false,
      ownedModels: []
    });
    
    trackEvent('sign_up', { method: 'email' });
    return { user };
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!hasValidConfig) {
    console.warn("Firebase auth not available - using demo mode");
    return null;
  }
  
  try {
    const traceObj = startTrace('auth_sign_in_email');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login in Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
    
    trackEvent('user_login', { method: 'email' });
    traceObj?.stop();
    
    return user;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  if (!hasValidConfig) {
    console.warn("Firebase auth not available - using demo mode");
    return false;
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
    trackEvent('password_reset_requested');
    return true;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const logOut = async () => {
  if (!hasValidConfig) {
    console.warn("Firebase auth not available - using demo mode");
    return null;
  }
  
  try {
    await signOut(auth);
    trackEvent('user_logout');
  } catch (error) {
    logError(error);
    throw error;
  }
};

// User helpers
export const getCurrentUser = () => {
  if (!hasValidConfig) {
    console.warn("Firebase auth not available - using demo mode");
    return Promise.resolve(null);
  }
  
  return new Promise<FirebaseUser | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const updateUserProfile = async (userId: string, data: any) => {
  if (!hasValidConfig) {
    console.warn("Firebase Firestore not available - using demo mode");
    return null;
  }
  
  try {
    const traceObj = startTrace('update_user_profile');
    const userRef = doc(db, 'users', userId);
    
    // Add update timestamp
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(userRef, updateData);
    
    // Also update displayName in Firebase Auth if included
    if (data.displayName && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: data.displayName });
    }
    
    traceObj?.stop();
    return true;
  } catch (error) {
    logError(error);
    throw error;
  }
};

// Model functions
export const uploadModel = async (
  userId: string, 
  modelFile: File, 
  metadata: any, 
  onProgress?: (progress: number) => void
) => {
  try {
    const traceObj = startTrace('upload_model');
    const timestamp = new Date().getTime();
    const fileExtension = modelFile.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExtension}`;
    const filePath = `models/${userId}/${fileName}`;
    
    // Upload file to storage
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, modelFile);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          logError(error);
          traceObj?.stop();
          reject(error);
        },
        async () => {
          try {
            // Get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Create model in Firestore
            const modelRef = doc(collection(db, 'models'));
            const modelData = {
              id: modelRef.id,
              userId,
              name: metadata.title,
              description: metadata.description,
              price: parseFloat(metadata.price),
              category: metadata.category,
              tags: metadata.tags,
              fileUrl: downloadURL,
              filePath,
              fileSize: modelFile.size,
              fileType: modelFile.type,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              downloads: 0,
              rating: 0,
              ratings: [],
              isPublic: metadata.isPublic || true,
              status: 'active',
            };
            
            await setDoc(modelRef, modelData);
            
            // Add model to user's owned models
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
              ownedModels: arrayUnion(modelRef.id),
            });
            
            trackEvent('model_uploaded', {
              model_id: modelRef.id,
              category: metadata.category,
              file_size: modelFile.size,
            });
            
            traceObj?.stop();
            resolve(modelData);
          } catch (error) {
            logError(error);
            traceObj?.stop();
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getModels = async (categoryFilter?: string, limitCount: number = 50) => {
  try {
    const traceObj = startTrace('get_models');
    const modelsCollection = collection(db, 'models');
    let modelsQuery;
    
    if (categoryFilter) {
      modelsQuery = query(
        modelsCollection, 
        where('category', '==', categoryFilter),
        where('status', '==', 'active'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );
    } else {
      modelsQuery = query(
        modelsCollection,
        where('status', '==', 'active'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );
    }
    
    const modelsSnapshot = await getDocs(modelsQuery);
    const result = modelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    traceObj?.stop();
    return result;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getUserModels = async (userId: string) => {
  try {
    const traceObj = startTrace('get_user_models');
    const modelsCollection = collection(db, 'models');
    const modelsQuery = query(
      modelsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const modelsSnapshot = await getDocs(modelsQuery);
    const result = modelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    traceObj?.stop();
    return result;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const deleteModel = async (modelId: string, userId: string) => {
  try {
    // Check if the user owns the model
    const modelRef = doc(db, 'models', modelId);
    const modelSnap = await getDoc(modelRef);
    
    if (!modelSnap.exists()) {
      throw new Error('Model not found');
    }
    
    const modelData = modelSnap.data();
    if (modelData.userId !== userId) {
      throw new Error('Unauthorized - you do not own this model');
    }
    
    // Delete the file from storage if it exists
    if (modelData.filePath) {
      const storageRef = ref(storage, modelData.filePath);
      await deleteObject(storageRef);
    }
    
    // Delete model document
    await deleteDoc(modelRef);
    
    // Remove from user's owned models
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const ownedModels = userData.ownedModels || [];
      const updatedModels = ownedModels.filter((id: string) => id !== modelId);
      
      await updateDoc(userRef, {
        ownedModels: updatedModels,
      });
    }
    
    trackEvent('model_deleted', { model_id: modelId });
    return true;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const incrementModelDownloads = async (modelId: string) => {
  try {
    const modelRef = doc(db, 'models', modelId);
    await updateDoc(modelRef, {
      downloads: increment(1),
    });
    
    trackEvent('model_downloaded', { model_id: modelId });
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
};

// Add GitHub sign-in function
export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    
    // Create or update user in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user document
      await setDoc(userRef, {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        walletConnected: false,
        ownedModels: []
      });
    } else {
      // Update login timestamp
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    }
    
    trackEvent('login', { method: 'github' });
    return { user };
  } catch (error) {
    logError(error);
    throw error;
  }
};

// Export the services (which may be real or placeholders)
export { auth, db, storage, functions, analytics, performance }; 