import { cn } from '@/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon: Icon, action, className }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      {Icon && <Icon className="mb-4 h-12 w-12 text-gray-400" />}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mb-6 max-w-md text-gray-600">{description}</p>}
      {action && action}
    </div>
  );
};

export default EmptyState;
