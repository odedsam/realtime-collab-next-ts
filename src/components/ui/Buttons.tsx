import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
        favorite:
          'bg-red-600 text-white hover:bg-red-700 transition-all duration-200 ease-in-out hover:shadow-red-500/30 hover:shadow-lg',
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
  target?: string;
  full?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      iconPosition = 'left',
      children,
      href,
      target,
      full = false,
      ...props
    },
    ref,
  ) => {
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

interface CarouselButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const CarouselButton = ({
  direction,
  onClick,
  disabled,
  className,
}: CarouselButtonProps) => (
  <Button
    className={cn(
      'p-2 rounded-full bg-primary text-gray-def hover:bg-gray-700 transition-colors h-auto',
      className,
    )}
    disabled={disabled}
    onClick={onClick}
    icon={
      direction === 'prev' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />
    }
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} items`}
  />
);

export const ButtonFacebook = ({ onClick }: { onClick?: () => void }) => {
  const FacebookIcon = () => (
    <img src="/icons/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
  );
  return (
    <button
      type="button"
      className="font-manrope cursor-pointer w-full flex items-center justify-center gap-2 bg-[#1877F3] text-white rounded px-4 py-2 hover:bg-[#145db2] transition"
      // onClick={() => (window.location.href = '/api/auth/facebook')}
      onClick={onClick}>
      <FacebookIcon />
      Continue with Facebook
    </button>
  );
};

export const ButtonGoogle = ({ onClick }: { onClick?: () => void }) => {
  const GoogleIcon = () => {
    return (
      <svg className="w-6 h-6" viewBox="0 0 48 48">
        <path
          fill="#4285F4"
          d="M24 9.5c3.64 0 6.43 1.39 8.28 2.56l6.15-6.15C34.58 2.03 29.71 0 24 0 14.71 0 6.9 5.39 2.82 13.23l7.32 5.69C13.13 12.08 18.02 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M46.9 24.48c0-1.49-.13-2.92-.37-4.31H24v8.18h13.06c-.6 3.18-2.24 5.83-4.63 7.63l7.26 5.62C44.18 36.69 46.9 31.14 46.9 24.48z"
        />
        <path
          fill="#FBBC05"
          d="M11.54 28.04c-.55-1.56-.85-3.22-.85-4.96s.3-3.4.85-4.96L4.18 12.45C2.54 15.78 1.6 19.33 1.6 23.08s.94 7.3 2.58 10.63l7.36-5.67z"
        />
        <path
          fill="#EA4335"
          d="M24 46c5.73 0 10.47-1.85 13.96-5.03l-7.26-5.62c-2.03 1.36-4.62 2.17-7.47 2.17-5.98 0-11.06-3.87-12.89-9.2l-7.32 5.67C6.91 40.62 14.72 46 24 46z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
    );
  };

  return (
    <button
      type="button"
      className="font-manrope cursor-pointer w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black border border-gray-300 rounded px-4 py-2  transition"
      // onClick={() => (window.location.href = '/api/auth/google')}>
      onClick={onClick}>
      <GoogleIcon />
      Continue with Google
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
