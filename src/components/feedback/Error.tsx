import { cn } from '@/utils';
import { Button } from '../ui/Buttons';
import { capitalizeFirstLetter } from '@/utils/format';

type ErrorProps = {
  errMsg?: string | null;
  className?: string;
  path?: string;
};

export const ErrorMsg = ({ errMsg, className, path }: ErrorProps) =>{
  return (
    <div className="">
      <div className="flex min-h-screen items-center justify-center bg-red-50 bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className={cn('grid gap-y-14 rounded-lg bg-white p-24 text-center text-red-700 shadow-md', className)}>
          <h2 className="mb-2 text-xl font-semibold">Error</h2>
          <p>{errMsg && errMsg}</p>
          {path && <Button href={`${path}`}>Back to {capitalizeFirstLetter(path.split('/').pop() || '')}</Button>}
        </div>
      </div>
    </div>
  );
}

// usage : // <ErrorMsg className='optional' errMsg="hey" path="http://localhost:3000/rooms" />
