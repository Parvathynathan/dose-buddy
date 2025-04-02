
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import MedicationForm from "@/components/MedicationForm";
import MedicationList from "@/components/MedicationList";
import WiFiCredentialsPopup from "@/components/WiFiCredentialsPopup";
import { Medication } from "@/components/MedicationForm";
import { 
  getMedications, 
  addMedication, 
  updateMedication, 
  deleteMedication 
} from "@/lib/medication-service";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, logout, justLoggedIn, clearJustLoggedIn } = useAuth();
  const [showWifiPopup, setShowWifiPopup] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Show WiFi popup when user just logged in
    if (justLoggedIn) {
      setShowWifiPopup(true);
      clearJustLoggedIn();
    }
  }, [justLoggedIn, clearJustLoggedIn]);

  useEffect(() => {
    const loadMedications = async () => {
      if (user?.uid) {
        try {
          setLoading(true);
          const meds = await getMedications(user.uid);
          setMedications(meds);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load medications",
            variant: "destructive",
          });
          console.error("Failed to load medications:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMedications();
  }, [user, toast]);

  const handleAddMedication = async (medication: Medication) => {
    if (user?.uid) {
      try {
        const { name, dosage, foodRelation, reminderTime } = medication;
        const newMed = await addMedication(user.uid, { 
          name, dosage, foodRelation, reminderTime 
        });
        
        setMedications(prev => [...prev, newMed]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add medication",
          variant: "destructive",
        });
        console.error("Failed to add medication:", error);
      }
    }
  };

  const handleUpdateMedication = async (medication: Medication) => {
    try {
      await updateMedication(medication.id, medication);
      setMedications(prev => 
        prev.map(med => med.id === medication.id ? medication : med)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update medication",
        variant: "destructive",
      });
      console.error("Failed to update medication:", error);
    }
  };

  const handleDeleteMedication = async (medicationId: string) => {
    try {
      await deleteMedication(medicationId);
      setMedications(prev => prev.filter(med => med.id !== medicationId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete medication",
        variant: "destructive",
      });
      console.error("Failed to delete medication:", error);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome to DOSE-MATE</h1>
          <p className="text-muted-foreground">Manage your medications easily</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowWifiPopup(true)} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            WiFi Setup
          </Button>
          <Button onClick={logout} variant="ghost">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Medication</h2>
          <MedicationForm onAddMedication={handleAddMedication} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Medications</h2>
          {loading ? (
            <div className="p-8 text-center">Loading medications...</div>
          ) : (
            <MedicationList 
              medications={medications}
              onUpdate={handleUpdateMedication}
              onDelete={handleDeleteMedication}
            />
          )}
        </div>
      </div>

      <WiFiCredentialsPopup 
        open={showWifiPopup} 
        onOpenChange={setShowWifiPopup} 
      />
    </div>
  );
};

export default Dashboard;
