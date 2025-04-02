
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import MedicationForm from "@/components/MedicationForm";
import MedicationList from "@/components/MedicationList";
import WiFiCredentialsPopup from "@/components/WiFiCredentialsPopup";

const Dashboard = () => {
  const { user, logout, justLoggedIn, clearJustLoggedIn } = useAuth();
  const [showWifiPopup, setShowWifiPopup] = useState(false);

  useEffect(() => {
    // Show WiFi popup when user just logged in
    if (justLoggedIn) {
      setShowWifiPopup(true);
      clearJustLoggedIn();
    }
  }, [justLoggedIn, clearJustLoggedIn]);

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
          <MedicationForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Medications</h2>
          <MedicationList />
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
