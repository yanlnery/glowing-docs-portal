import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onContinue()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <ShoppingCart className="h-5 w-5 text-amber-600" />
            </div>
            <AlertDialogTitle>Abandonar checkout?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {filledFieldsCount > 0 ? (
              <>
                Você já preencheu <strong>{filledFieldsCount} campo{filledFieldsCount > 1 ? 's' : ''}</strong> do formulário. 
                Se sair agora, seus dados serão perdidos e você precisará preenchê-los novamente.
              </>
            ) : (
              'Se sair agora, você precisará iniciar o processo de checkout novamente.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onContinue} className="mt-0">
            Continuar preenchendo
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmLeave}
            className="bg-destructive hover:bg-destructive/90"
          >
            Sair mesmo assim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};