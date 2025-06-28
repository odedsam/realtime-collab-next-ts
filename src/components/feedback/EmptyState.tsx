import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}>
      {Icon && <Icon className="w-12 h-12 text-gray-400 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6 max-w-md">{description}</p>}
      {action && action}
    </div>
  );
};

export default EmptyState;
