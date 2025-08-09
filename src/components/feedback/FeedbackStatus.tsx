import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

export type StatusWrapperProps = {
  isLoading: boolean;
  error: string | null;
  notFound?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  notFoundMessage?: string;
  onBackClick?: () => void;
  children: React.ReactNode;
};

const wrapperVariants = cva('flex min-h-screen items-center justify-center p-4', {
  variants: {
    statusType: {
      loading: 'bg-gray-100',
      error: 'bg-red-50 bg-gradient-to-br from-red-50 to-red-100',
      notFound: 'bg-gray-100',
      content: '',
    },
  },
  defaultVariants: {
    statusType: 'content',
  },
});

const messageBoxVariants = cva('rounded-lg p-6 text-center shadow-md', {
  variants: {
    statusType: {
      loading: 'bg-white text-gray-600',
      error: 'bg-white text-red-700',
      notFound: 'bg-white text-red-500',
      content: '',
    },
  },
  defaultVariants: {
    statusType: 'content',
  },
});

export const StatusWrapper: React.FC<StatusWrapperProps> = ({
  isLoading,
  error,
  notFound = false,
  loadingMessage = 'Loading details...',
  errorMessage = 'An unexpected error occurred.',
  notFoundMessage = 'Resource not found.',
  onBackClick,
  children,
}) => {
  if (isLoading) {
    return (
      <div className={cn(wrapperVariants({ statusType: 'loading' }))}>
        <div className={cn(messageBoxVariants({ statusType: 'loading' }))}>
          <p className="text-lg">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(wrapperVariants({ statusType: 'error' }))}>
        <div className={cn(messageBoxVariants({ statusType: 'error' }))}>
          <h2 className="mb-2 text-xl font-semibold text-red-500">Error</h2>
          <p>{error}</p>
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={cn(wrapperVariants({ statusType: 'notFound' }))}>
        <div className={cn(messageBoxVariants({ statusType: 'notFound' }))}>
          <p className="text-lg">{notFoundMessage}</p>
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render children when no loading/error/not found state is active
  return <>{children}</>;
};

//usage

{
  /* <StatusWrapper
  isLoading={isLoading}
  error={error}
  notFound={notFound}
  loadingMessage="Loading Data..."
  errorMessage="Oh no! Something went wrong while loading the data."
  notFoundMessage="The item you were looking for was not found."
  onBackClick={handleBackClick}></StatusWrapper>; */
}
