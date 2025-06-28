import { cn } from '@/utils';
import { useEffect } from 'react';
import { Button } from './Buttons';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children, className }) => {
  const baseClasses = cn('fixed inset-0 z-50 flex items-center justify-center', className);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      {isOpen && <div className={baseClasses}>{children}</div>}
    </>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => {
  const baseClasses = cn(
    'bg-white rounded-lg shadow-lg p-6 w-full max-w-md', // Changed colors
    className,
    'transform transition-all duration-300',
  );
  return <div className={baseClasses}>{children}</div>;
};

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => {
  const baseClasses = cn('flex flex-col gap-2', className);
  return <div className={baseClasses}>{children}</div>;
};

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className }) => {
  const baseClasses = cn('text-lg font-semibold', className);
  return <h2 className={baseClasses}>{children}</h2>;
};

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, className }) => {
  const baseClasses = cn('text-sm text-gray-500', className);
  return <p className={baseClasses}>{children}</p>;
};

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => {
  const baseClasses = cn('flex justify-end gap-4', className);
  return <div className={baseClasses}>{children}</div>;
};

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const DialogClose: React.FC<DialogCloseProps> = ({ className, ...props }) => {
  const baseClasses = cn(
    'absolute top-4 right-4 p-1 rounded-full bg-white/50 hover:bg-white/70',
    'text-gray-500 hover:text-gray-900',
    className,
  );
  return (
    <Button variant="ghost" size="icon" className={baseClasses} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span className="sr-only">Close</span>
    </Button>
  );
};
