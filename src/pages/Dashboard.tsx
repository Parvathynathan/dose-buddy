
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MedicationList from "@/components/MedicationList";
import MedicationForm, { Medication } from "@/components/MedicationForm";
import { useAuth } from "@/contexts/AuthContext";
import { getMedications, addMedication, updateMedication, deleteMedication } from "@/lib/medication-service";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
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
    },
  });

  // Update medication mutation
  const updateMedicationMutation = useMutation({
    mutationFn: (medication: Medication) => 
      updateMedication(medication.id, medication),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.uid] });
    },
  });

  // Delete medication mutation
  const deleteMedicationMutation = useMutation({
    mutationFn: (id: string) => deleteMedication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.uid] });
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
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

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
