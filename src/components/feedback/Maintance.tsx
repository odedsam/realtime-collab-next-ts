'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/Dialog';
import { useDialogStore } from '@/store/useDialogStore';
import { Button } from '@/components/ui/Buttons';

export default function MaintanceDialog() {
  const { isOpen, close } = useDialogStore();
  return (
    <>
      <Dialog isOpen={isOpen} onClose={close}>
        <DialogContent className="bg-slate-800">
          <DialogClose onClick={close} />

          <DialogHeader>
            <DialogTitle className="text-white">Heads Up!</DialogTitle>
            <DialogDescription className="text-purple-300">
              Some features like <strong>Log In</strong> and <strong>Sign Up</strong> are still under maintenance.
              <br />
              We’re working hard to get everything running smoothly — thank you for your patience.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={close}>Got It</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
