import { cn } from '@/utils';

type BadgeProps = {
  text: string;
  color?: 'red' | 'green' | 'blue' | 'yellow';
  className?: string;
};

const colorMap = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
};

export const Badge = ({ text, color = 'red', className }: BadgeProps) => {
  return (
    <div
      className={cn(
        'text-white rounded-md text-xs font-bold px-2 py-1 inline-block max-w-fit',
        colorMap[color],
        className,
      )}>
      {text}
    </div>
  );
};

type AlertBadgeProps = {
  count?: number | string;
  maxCount?: number;
  className?: string;
};

const AlertBadge = ({ count = 0, maxCount = 9, className }: AlertBadgeProps) => {
  if (!count || (typeof count === 'number' && count < 1)) return null;

  const displayCount = typeof count === 'number' && count > maxCount ? `${maxCount}+` : count;

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        'absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full cursor-pointer',
        className,
      )}>
      {displayCount}
    </span>
  );
};

export default AlertBadge;
