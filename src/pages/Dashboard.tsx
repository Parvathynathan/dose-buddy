
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MedicationForm, { Medication } from "@/components/MedicationForm";
import MedicationList from "@/components/MedicationList";
import { LogOut, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data
const initialMedications: Medication[] = [
  {
    id: "1",
    name: "Aspirin",
    dosage: "100mg",
    timeOfDay: "morning",
    foodRelation: "after",
  },
  {
    id: "2",
    name: "Vitamin D",
    dosage: "1000 IU",
    timeOfDay: "morning",
    foodRelation: "with",
  },
  {
    id: "3",
    name: "Melatonin",
    dosage: "5mg",
    timeOfDay: "night",
    foodRelation: "before",
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading medications from API
    const timer = setTimeout(() => {
      setMedications(initialMedications);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddMedication = (newMedication: Medication) => {
    setMedications((prev) => [...prev, newMedication]);
  };

  const handleUpdateMedication = (updatedMedication: Medication) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === updatedMedication.id ? updatedMedication : med
      )
    );
  };

  const handleDeleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  const handleSignOut = () => {
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    
    // Redirect to login page
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">DOSE-MATE</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container py-8 animate-fade-in">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Medications</h2>
              <p className="text-muted-foreground">
                Manage your medications and schedule
              </p>
            </div>
            <MedicationForm onAddMedication={handleAddMedication} />
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <MedicationList
              medications={medications}
              onUpdate={handleUpdateMedication}
              onDelete={handleDeleteMedication}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
