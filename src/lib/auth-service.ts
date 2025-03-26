import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create a user document for Arduino to reference
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      createdAt: new Date(),
      arduinoConnected: false,
      time: ""  // This will be updated when a medication is added
    });
    
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Subscribe to auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
