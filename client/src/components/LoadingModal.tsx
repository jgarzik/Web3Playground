/**
 * Loading Modal Component
 * 
 * Displays loading states during blockchain transactions with customizable
 * title and message content.
 */

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingModalProps {
  title: string;
  message: string;
  open?: boolean;
}

export default function LoadingModal({ 
  title, 
  message, 
  open = true 
}: LoadingModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-6 py-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-muted-foreground">
              {message}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
