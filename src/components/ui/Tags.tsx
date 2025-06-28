
import { cn } from '@/utils';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

interface BoxTagProps {
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  children: React.ReactNode;
}

const tagVariants = cva('px-3 py-1 rounded-md text-sm border inline-block', {
  variants: {
    variant: {
      default: 'bg-primary text-white border-quinary',
      blue: 'bg-blue-900/30 text-blue-300 border-blue-700/50',
      purple: 'bg-purple-900/30 text-purple-300 border-purple-700/50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const BoxTag = ({ icon, className, children }: BoxTagProps) => {
  return (
    <div
      className={cn(
        'rounded-lg bg-primary border border-teriary flex items-center justify-center shrink-0',
        className,
      )}>
      {icon && <>{icon}</>}
      {children}
    </div>
  );
};

export const LanguageTag = ({ icon, className }: BoxTagProps) => {
  return <BoxTag icon={icon} className={cn('bg-blue-600', className)} />;
};

export const Tag = ({ children, variant, className, ...props }: TagProps) => {
  return (
    <span className={cn(tagVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
};
