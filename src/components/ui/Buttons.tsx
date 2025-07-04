import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GoogleIcon, FacebookIcon } from '@/data/icons';
import Link from 'next/link';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-manrope font-semibold rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        black:
          'bg-primary text-white border-2 border-quinary hover:bg-[#2a2a2a] hover:text-gray-100 transition-all duration-200 ease-in-out hover:shadow-lg',
        dark: 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] hover:text-gray-100 transition-all duration-200 ease-in-out hover:shadow-lg',
        red: 'bg-red-def text-white hover:bg-[#cc0000] font-semibold hover:text-gray-100 transition-all duration-200 ease-in-out hover:shadow-lg hover:shadow-red-500/25',
        darker:
          'bg-[#141414] text-white hover:bg-[#242424] hover:text-gray-100 transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105',
        transparent:
          'bg-transparent text-white border-2 border-quinary hover:bg-[#2a2a2a] hover:text-gray-100 transition-all duration-200 ease-in-out hover:shadow-lg',
        bordered:
          'bg-[#141414] text-white hover:bg-[#242424] border-3 border-quinary hover:text-gray-100 transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105',
        ghost:
          'bg-transparent text-white hover:bg-[#2a2a2a] border border-white/10 transition-all duration-200 ease-in-out hover:shadow-md',
        favorite: 'bg-red-600 text-white hover:bg-red-700 transition-all duration-200 ease-in-out hover:shadow-red-500/30 hover:shadow-lg',
        saved:
          'bg-green-600 text-white hover:bg-green-700 transition-all duration-200 ease-in-out hover:shadow-green-500/30 hover:shadow-lg',
      },
      size: {
        default: 'h-12 px-8 py-4',
        sm: 'h-9 px-6 py-3 text-base',
        lg: 'h-14 px-10 py-5 text-xl',
        icon: 'h-12 w-12',
      },
      full: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'dark',
      size: 'default',
      full: false,
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
  target?: string;
  full?: boolean;
}

interface CarouselButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, icon, iconPosition = 'left', children, href, target, full = false, ...props }, ref) => {
    const content = icon ? (
      iconPosition === 'right' ? (
        <>
          {children}
          <span className="flex-shrink-0">{icon}</span>
        </>
      ) : (
        <>
          <span className="flex-shrink-0">{icon}</span>
          {children}
        </>
      )
    ) : (
      children
    );

    const classes = cn(buttonVariants({ variant, size, full, className }));

    if (href) {
      return (
        <Link href={href} target={target} className={classes}>
          {content}
        </Link>
      );
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };

export const CarouselButton = ({ direction, onClick, disabled, className }: CarouselButtonProps) => (
  <Button
    className={cn('bg-primary text-gray-def h-auto rounded-full p-2 transition-colors hover:bg-gray-700', className)}
    disabled={disabled}
    onClick={onClick}
    icon={direction === 'prev' ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} items`}
  />
);

interface AuthButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const FacebookButton = ({ onClick, disabled, label, className }: AuthButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        'font-manrope flex max-h-[42px] min-h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded bg-[#1877F3] px-4 py-2 text-white transition hover:bg-[#145db2]',
        className,
      )}
      disabled={disabled}
      onClick={onClick}>
      <FacebookIcon />
      {label}
    </button>
  );
};

export const GoogleButton = ({ onClick, disabled, label, className }: AuthButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        'font-manrope flex max-h-[42px] min-h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-black transition hover:bg-gray-200',
        className,
      )}
      disabled={disabled}
      onClick={onClick}>
      <GoogleIcon />
      {label}
    </button>
  );
};

/*
//  Click action
<Button onClick={() => console.log('Clicked')} variant="red">
  Click Me
</Button>

//  Navigation (internal)
<Button href="/dashboard" variant="bordered">
  Go to Dashboard
</Button>

//  Navigation (external)
<Button href="https://example.com" target="_blank" variant="dark">
  External Link
</Button>

//  With icon (left)
<Button variant="dark" icon={<ArrowLeft className="w-4 h-4" />}>
  Back
</Button>

//  With icon (right)
<Button variant="bordered" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
  Next
</Button>

//  Icon only button
<Button variant="red" size="icon" icon={<Plus className="w-5 h-5" />} />

//  Full width
<Button variant="black" full>
  Full Width Button
</Button>
 */
