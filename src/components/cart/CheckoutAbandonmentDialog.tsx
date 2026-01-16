import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface CheckoutAbandonmentDialogProps {
  open: boolean;
  onConfirmLeave: () => void;
  onContinue: () => void;
  filledFieldsCount: number;
}

export const CheckoutAbandonmentDialog: React.FC<CheckoutAbandonmentDialogProps> = ({
  open,
  onConfirmLeave,
  onContinue,
  filledFieldsCount,
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onContinue()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <ShoppingCart className="h-5 w-5 text-amber-600" />
            </div>
            <DialogTitle>Abandonar checkout?</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {filledFieldsCount > 0 ? (
              <>
                Você já preencheu <strong>{filledFieldsCount} campo{filledFieldsCount > 1 ? 's' : ''}</strong> do formulário. 
                Se sair agora, seus dados serão perdidos e você precisará preenchê-los novamente.
              </>
            ) : (
              'Se sair agora, você precisará iniciar o processo de checkout novamente.'
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onContinue} className="w-full sm:w-auto">
            Continuar preenchendo
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirmLeave}
            className="w-full sm:w-auto"
          >
            Sair mesmo assim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};