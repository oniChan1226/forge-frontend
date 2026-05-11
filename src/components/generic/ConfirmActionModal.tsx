import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Loader from "@/utils/Loader";

interface ConfirmActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isConfirming?: boolean;
}

export function ConfirmActionModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isConfirming = false,
}: ConfirmActionModalProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    // Keep the modal locked while the destructive action is in flight.
    if (isConfirming && !nextOpen) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal>
      <DialogContent
        className="sm:max-w-md z-80 rounded-md"
        showCloseButton={!isConfirming}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-destructive/12 to-transparent rounded-md" />

        <DialogHeader className="gap-1">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isConfirming}
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            <Loader isLoading={isConfirming} loadedText={confirmLabel} loadingText={confirmLabel + "..."}/>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
