import { cn } from '@/utils';

type LoadingProps = {
  message?: string;
  className?: string;
};
export const Loading = ({ message, className }: LoadingProps) => {
  return (
    <div className={cn('flex min-h-screen animate-pulse items-center justify-center bg-gray-100', className)}>
      <p className="p-6 text-4xl text-gray-600">{message} ... </p>
    </div>
  );
};

{
  /* <Loading  className='optional' message="http://localhost:3000/rooms" /> */
}
