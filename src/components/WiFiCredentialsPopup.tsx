
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WifiIcon, KeyRound } from "lucide-react";

interface WiFiCredentialsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WiFiCredentialsPopup = ({ open, onOpenChange }: WiFiCredentialsPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WifiIcon className="h-5 w-5 text-primary" />
            <span>WiFi Credentials</span>
          </DialogTitle>
          <DialogDescription>
            Use these credentials to connect your device to the network.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <WifiIcon className="h-4 w-4 text-primary" />
                <span className="font-semibold">Network Name (SSID)</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText("DOSE-MATE-NETWORK")}>
                Copy
              </Button>
            </div>
            <p className="text-sm font-mono bg-background p-2 rounded border">DOSE-MATE-NETWORK</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                <span className="font-semibold">Password</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText("dosem@te2024")}>
                Copy
              </Button>
            </div>
            <p className="text-sm font-mono bg-background p-2 rounded border">dosem@te2024</p>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WiFiCredentialsPopup;
