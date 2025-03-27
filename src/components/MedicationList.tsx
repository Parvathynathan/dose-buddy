
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MedicationForm, { Medication } from "./MedicationForm";
import {
  Clock,
  Edit,
  MoreVertical,
  Pizza,
  Trash2,
} from "lucide-react";

interface MedicationListProps {
  medications: Medication[];
  onUpdate: (updatedMedication: Medication) => void;
  onDelete: (id: string) => void;
}

const MedicationList = ({
  medications,
  onUpdate,
  onDelete,
}: MedicationListProps) => {
  const { toast } = useToast();
  const [editingMedication, setEditingMedication] = useState<Medication | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast({
      title: "Deleted",
      description: "Medication has been removed",
    });
  };

  const formatFoodRelation = (relation: string) => {
    const formattedText = relation.charAt(0).toUpperCase() + relation.slice(1);
    return `${formattedText} Food`;
  };

  const getFoodRelationIcon = (relation: string) => {
    return <Pizza size={16} className="mr-1" />;
  };

  const getTimeIcon = () => {
    return <Clock size={16} className="mr-1" />;
  };

  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-lg shadow-soft animate-fade-in">
        <div className="text-lg font-medium mb-2">No medications yet</div>
        <p className="text-muted-foreground mb-6">
          Add your first medication to get started
        </p>
        <MedicationForm
          onAddMedication={(med) => {
            onUpdate(med);
            toast({
              title: "Success",
              description: "Medication added successfully",
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
          </DialogHeader>
          {editingMedication && (
            <MedicationForm
              onAddMedication={onUpdate}
              initialData={editingMedication}
              isEdit={true}
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border bg-card shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Medication</TableHead>
              <TableHead className="w-[25%]">Schedule</TableHead>
              <TableHead className="w-[20%]">Food</TableHead>
              <TableHead className="w-[5%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((medication) => (
              <TableRow key={medication.id} className="group">
                <TableCell className="font-medium">
                  {medication.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getTimeIcon()}
                    {medication.reminderTime || "Not set"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getFoodRelationIcon(medication.foodRelation)}
                    <span className="hidden sm:inline">
                      {formatFoodRelation(medication.foodRelation)}
                    </span>
                    <span className="sm:hidden">
                      {medication.foodRelation === "before"
                        ? "Before"
                        : medication.foodRelation === "with"
                        ? "With"
                        : "After"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEdit(medication)}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(medication.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MedicationList;
