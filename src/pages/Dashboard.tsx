
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MedicationForm, { Medication } from "@/components/MedicationForm";
import MedicationList from "@/components/MedicationList";
import { LogOut, Plus, Bell, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data
const initialMedications: Medication[] = [
  {
    id: "1",
    name: "Aspirin",
    dosage: "100mg",
    timeOfDay: "morning",
    foodRelation: "after",
    reminderTime: "08:00",
  },
  {
    id: "2",
    name: "Vitamin D",
    dosage: "1000 IU",
    timeOfDay: "morning",
    foodRelation: "with",
    reminderTime: "09:30",
  },
  {
    id: "3",
    name: "Melatonin",
    dosage: "5mg",
    timeOfDay: "night",
    foodRelation: "before",
    reminderTime: "22:00",
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

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

  // Get upcoming medications based on reminder time
  const getUpcomingMedications = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    return medications
      .filter(med => med.reminderTime)
      .map(med => {
        const [hours, minutes] = med.reminderTime!.split(':').map(Number);
        const reminderTimeMinutes = hours * 60 + minutes;
        const timeDiff = reminderTimeMinutes - currentTimeMinutes;
        
        // Consider medications in the next 2 hours or if they're overdue (up to -30 minutes)
        return {
          ...med,
          timeDiff,
          isUpcoming: timeDiff > -30 && timeDiff < 120
        };
      })
      .filter(med => med.isUpcoming)
      .sort((a, b) => a.timeDiff - b.timeDiff);
  };

  const upcomingMedications = getUpcomingMedications();

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
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline">
              {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
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

          {/* Reminder Section */}
          {!isLoading && upcomingMedications.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="text-primary" size={20} />
                <h3 className="font-semibold">Upcoming Medications</h3>
              </div>
              <ul className="space-y-3">
                {upcomingMedications.map(med => (
                  <li key={med.id} className="flex items-center justify-between bg-background rounded-md p-3 shadow-sm">
                    <div>
                      <p className="font-medium">{med.name} ({med.dosage})</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock size={14} className="mr-1" />
                        <span>{med.reminderTime}</span>
                        <span className="mx-2">•</span>
                        <span>{formatFoodRelation(med.foodRelation)}</span>
                      </div>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded-full ${med.timeDiff < 0 
                      ? 'bg-destructive/10 text-destructive' 
                      : med.timeDiff < 30 
                        ? 'bg-warning/10 text-warning' 
                        : 'bg-muted text-muted-foreground'}`}>
                      {med.timeDiff < 0 
                        ? 'Overdue' 
                        : med.timeDiff < 30 
                          ? 'Soon' 
                          : `In ${Math.floor(med.timeDiff / 60)}h ${med.timeDiff % 60}m`}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

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

const formatFoodRelation = (relation: string) => {
  if (relation === "before") {
    return "Before Food";
  } else if (relation === "with") {
    return "With Food";
  } else if (relation === "after") {
    return "After Food";
  } else {
    return "Any Time";
  }
};

export default Dashboard;
