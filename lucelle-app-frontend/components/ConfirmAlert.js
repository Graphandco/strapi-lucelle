"use client";

import { toast } from "sonner";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ConfirmAlert({
   children,
   title,
   description,
   action,
   notif,
   confirmText = "Supprimer",
}) {
   const handleAction = async () => {
      try {
         await action();
         if (notif) {
            toast.success(notif);
         }
      } catch (error) {
         console.error("Erreur lors de l'action:", error);
         toast.error("Une erreur est survenue");
      }
   };

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{title}</AlertDialogTitle>
               <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>Annuler</AlertDialogCancel>
               <AlertDialogAction onClick={handleAction}>
                  {confirmText}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
