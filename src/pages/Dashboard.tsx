
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MedicationList from "@/components/MedicationList";
import MedicationForm, { Medication } from "@/components/MedicationForm";
import { useAuth } from "@/contexts/AuthContext";
import { getMedications, addMedication, updateMedication, deleteMedication } from "@/lib/medication-service";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pill, Wifi, AlertTriangle, Clock } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [arduinoStatus, setArduinoStatus] = useState({
    connected: false,
    lastSeen: null as Date | null,
    scheduledTime: ""
  });
  
  // Listen for Arduino status updates
  useEffect(() => {
    if (!user) return;
    
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setArduinoStatus({
          connected: data.arduinoConnected || false,
          lastSeen: data.arduinoLastSeen ? new Date(data.arduinoLastSeen.toDate()) : null,
          scheduledTime: data.time || ""
        });
      }
    });
    
    return () => unsubscribe();
  }, [user]);
  
  // Fetch medications
  const { data: medications = [], isLoading, error } = useQuery({
    queryKey: ['medications', user?.uid],
    queryFn: () => user ? getMedications(user.uid) : Promise.resolve([]),
    enabled: !!user,
  });

  // Add medication mutation
  const addMedicationMutation = useMutation({
    mutationFn: (medication: Omit<Medication, "id">) => 
      user ? addMedication(user.uid, medication) : Promise.resolve({} as Medication),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.uid] });
      toast({
        title: "Medication added",
        description: "Your medication has been scheduled and the dispenser has been updated."
      });
    },
  });

  // Update medication mutation
  const updateMedicationMutation = useMutation({
    mutationFn: (medication: Medication) => 
      updateMedication(medication.id, medication),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.uid] });
      toast({
        title: "Medication updated",
        description: "Your medication schedule has been updated on the dispenser."
      });
    },
  });

  // Delete medication mutation
  const deleteMedicationMutation = useMutation({
    mutationFn: (id: string) => deleteMedication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.uid] });
      toast({
        title: "Medication removed",
        description: "Your medication has been removed from the schedule."
      });
    },
  });

  const handleAddMedication = (medication: Medication) => {
    if (addMedicationMutation.isPending) return;

    const { id, ...medicationData } = medication;
    addMedicationMutation.mutate(medicationData);
  };

  const handleUpdateMedication = (medication: Medication) => {
    if (updateMedicationMutation.isPending) return;
    updateMedicationMutation.mutate(medication);
  };

  const handleDeleteMedication = (id: string) => {
    if (deleteMedicationMutation.isPending) return;
    deleteMedicationMutation.mutate(id);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Error handling is done in the useAuth hook
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Medications</h1>
          <p className="text-muted-foreground">
            Manage your medication schedule
          </p>
        </div>
        <div className="flex items-center gap-4">
          <MedicationForm onAddMedication={handleAddMedication} />
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Arduino Status Card */}
      <div className="bg-card rounded-lg shadow-sm p-4 mb-8 border">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Pill className="h-5 w-5" /> 
          Dispenser Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Wifi className={`h-5 w-5 ${arduinoStatus.connected ? "text-green-500" : "text-red-500"}`} />
            <span>{arduinoStatus.connected ? "Connected" : "Disconnected"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Next dose: {arduinoStatus.scheduledTime || "Not scheduled"}</span>
          </div>
          <div className="flex items-center gap-2">
            {arduinoStatus.lastSeen ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Last seen: {arduinoStatus.lastSeen.toLocaleTimeString()}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Device not yet connected</span>
              </>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p className="text-muted-foreground">Loading medications...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-4 rounded-md">
          <p className="text-destructive">Error loading medications</p>
        </div>
      ) : (
        <MedicationList
          medications={medications}
          onUpdate={handleUpdateMedication}
          onDelete={handleDeleteMedication}
        />
      )}
    </div>
  );
};

export default Dashboard;
