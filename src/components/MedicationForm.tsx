
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

type MedicationFormProps = {
  onAddMedication: (medication: Medication) => void;
  initialData?: Medication;
  isEdit?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  foodRelation: string;
  reminderTime?: string;
  userId?: string;
};

const MedicationForm = ({
  onAddMedication,
  initialData,
  isEdit = false,
  open,
  onOpenChange,
}: MedicationFormProps) => {
  const { toast } = useToast();
  const [medication, setMedication] = useState<Omit<Medication, "id">>({
    name: initialData?.name || "",
    dosage: initialData?.dosage || "",
    foodRelation: initialData?.foodRelation || "",
    reminderTime: initialData?.reminderTime || "",
  });
  
  const [internalOpen, setInternalOpen] = useState(false);
  
  const effectiveOpen = open !== undefined ? open : internalOpen;
  const effectiveOnOpenChange = onOpenChange || setInternalOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!medication.name || !medication.foodRelation) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create new medication with random ID
    const newMedication: Medication = {
      ...medication,
      id: initialData?.id || Math.random().toString(36).substring(2, 9),
    };

    onAddMedication(newMedication);
    effectiveOnOpenChange(false);
    
    // Reset form
    if (!isEdit) {
      setMedication({
        name: "",
        dosage: "",
        foodRelation: "",
        reminderTime: "",
      });
    }

    toast({
      title: "Success",
      description: isEdit
        ? "Medication updated successfully"
        : "Medication added successfully",
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="med-name">Medication Name</Label>
          <Input
            id="med-name"
            placeholder="e.g., Aspirin"
            value={medication.name}
            onChange={(e) =>
              setMedication({ ...medication, name: e.target.value })
            }
            className="h-12"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="med-dosage">Dosage</Label>
          <Input
            id="med-dosage"
            placeholder="e.g., 100mg"
            value={medication.dosage}
            onChange={(e) =>
              setMedication({ ...medication, dosage: e.target.value })
            }
            className="h-12"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="med-reminder-time">Specific Reminder Time</Label>
          <Input
            id="med-reminder-time"
            type="time"
            value={medication.reminderTime || ""}
            onChange={(e) =>
              setMedication({ ...medication, reminderTime: e.target.value })
            }
            className="h-12"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="med-food">Relation to Food</Label>
          <Select
            value={medication.foodRelation}
            onValueChange={(value) =>
              setMedication({ ...medication, foodRelation: value })
            }
          >
            <SelectTrigger id="med-food" className="h-12">
              <SelectValue placeholder="Select relation to food" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="before">Before Food</SelectItem>
              <SelectItem value="with">With Food</SelectItem>
              <SelectItem value="after">After Food</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => effectiveOnOpenChange(false)}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? "Update Medication" : "Add Medication"}
        </Button>
      </DialogFooter>
    </form>
  );

  if (open !== undefined) {
    return formContent;
  }

  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Medication" : "Add New Medication"}
          </DialogTitle>
          <DialogDescription>
            Enter your medication details below.
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default MedicationForm;
