
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  Timestamp 
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
        timeOfDay: data.timeOfDay,
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
    await updateDoc(medicationRef, {
      ...medication,
      updatedAt: Timestamp.now(),
    });
    
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
