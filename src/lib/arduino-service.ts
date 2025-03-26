
import { doc, updateDoc, Timestamp, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

// Update the Arduino connection status
export const updateArduinoStatus = async (userId: string, connected: boolean) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      arduinoConnected: connected,
      arduinoLastSeen: Timestamp.now()
    });
    return true;
  } catch (error: any) {
    console.error("Error updating Arduino status:", error);
    throw new Error(error.message);
  }
};

// Listen for changes in the Arduino time
export const listenToArduinoTime = (userId: string, callback: (time: string) => void) => {
  const userDocRef = doc(db, "users", userId);
  return onSnapshot(userDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      if (data.time) {
        callback(data.time);
      }
    }
  });
};
