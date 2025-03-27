
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  Timestamp,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { Medication } from "@/components/MedicationForm";

// Get all medications for a user
export const getMedications = async (userId: string) => {
  try {
    const medicationsRef = collection(db, "medications");
    const q = query(medicationsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const medications: Medication[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      medications.push({
        id: doc.id,
        name: data.name,
        dosage: data.dosage,
        foodRelation: data.foodRelation,
        reminderTime: data.reminderTime,
      });
    });
    
    return medications;
  } catch (error: any) {
    console.error("Error getting medications:", error);
    throw new Error(error.message);
  }
};

// Add a new medication
export const addMedication = async (userId: string, medication: Omit<Medication, "id">) => {
  try {
    const medicationsRef = collection(db, "medications");
    const docRef = await addDoc(medicationsRef, {
      ...medication,
      userId,
      createdAt: Timestamp.now(),
    });
    
    // Update the user document with the time for Arduino to read
    await updateArduinoTime(userId, medication.reminderTime);
    
    return {
      id: docRef.id,
      ...medication,
    };
  } catch (error: any) {
    console.error("Error adding medication:", error);
    throw new Error(error.message);
  }
};

// Update a medication
export const updateMedication = async (medicationId: string, medication: Partial<Medication>) => {
  try {
    const medicationRef = doc(db, "medications", medicationId);
    
    // Get the current medication to retrieve userId if not provided
    let userId = medication.userId;
    if (!userId) {
      const medicationDoc = await getDoc(medicationRef);
      if (medicationDoc.exists()) {
        userId = medicationDoc.data().userId;
      }
    }
    
    await updateDoc(medicationRef, {
      ...medication,
      updatedAt: Timestamp.now(),
    });
    
    // If reminderTime is updated and we have a userId, update the Arduino time as well
    if (medication.reminderTime && userId) {
      await updateArduinoTime(userId, medication.reminderTime);
    }
    
    return true;
  } catch (error: any) {
    console.error("Error updating medication:", error);
    throw new Error(error.message);
  }
};

// Delete a medication
export const deleteMedication = async (medicationId: string) => {
  try {
    const medicationRef = doc(db, "medications", medicationId);
    await deleteDoc(medicationRef);
    
    return true;
  } catch (error: any) {
    console.error("Error deleting medication:", error);
    throw new Error(error.message);
  }
};

// Update the time field in the user's document for Arduino to read
export const updateArduinoTime = async (userId: string, reminderTime: string) => {
  try {
    // Format the time as expected by Arduino (HH:MM)
    const timeForArduino = reminderTime.substring(0, 5); // Extract HH:MM from the ISO string
    
    // Set the time directly in the user document
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { 
      time: timeForArduino 
    }, { merge: true });
    
    console.log(`Updated Arduino time to ${timeForArduino} for user ${userId}`);
    return true;
  } catch (error: any) {
    console.error("Error updating Arduino time:", error);
    throw new Error(error.message);
  }
};
