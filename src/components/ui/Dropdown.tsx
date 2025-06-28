'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils';

export interface DropdownItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  // Core props
  isOpen: boolean;
  onToggle: () => void;
  items: DropdownItem[];

  // Trigger customization
  trigger?: ReactNode;
  triggerClassName?: string;

  // Dropdown positioning & styling
  position?: 'left' | 'right' | 'center';
  variant?: 'mobile' | 'desktop';
  width?: 'auto' | 'full' | 'trigger' | string;

  // Styling
  className?: string;
  itemClassName?: string;
  backdrop?: boolean;

  // Behavior
  closeOnClick?: boolean;
  closeOnOutsideClick?: boolean;

  // Labels
  ariaLabel?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onToggle,
  items,
  trigger,
  triggerClassName = '',
  position = 'left',
  variant = 'desktop',
  width = 'auto',
  className = '',
  itemClassName = '',
  backdrop = false,
  closeOnClick = true,
  closeOnOutsideClick = true,
  ariaLabel = 'Dropdown menu',
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!closeOnOutsideClick || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle, closeOnOutsideClick]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }

    if (closeOnClick) {
      onToggle();
    }
  };

  const getPositionClasses = () => {
    if (variant === 'mobile') return '';

    switch (position) {
      case 'right':
        return 'right-0';
      case 'center':
        return 'left-1/2 transform -translate-x-1/2';
      default:
        return 'left-0';
    }
  };

  const getWidthClasses = () => {
    switch (width) {
      case 'full':
        return 'w-full';
      case 'trigger':
        return 'w-full';
      case 'auto':
        return 'w-auto min-w-[200px]';
      default:
        return typeof width === 'string' ? width : 'w-auto min-w-[200px]';
    }
  };

  const defaultTrigger = (
    <button
      onClick={onToggle}
      className={cn(
        'flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200',
        triggerClassName,
      )}
      aria-label={ariaLabel}
      aria-expanded={isOpen}>
      <span>Menu</span>
      <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')} />
    </button>
  );

  if (variant === 'mobile') {
    return (
      <div ref={dropdownRef} className="relative">
        {trigger || defaultTrigger}

        {isOpen && (
          <>
            {backdrop && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onToggle} />}
            <div className={cn('lg:hidden bg-black/95 backdrop-blur-md border-t border-gray-800', className)}>
              <nav className="py-4 space-y-1">
                {items.map((item) => (
                  <div key={item.id}>
                    {item.divider ? (
                      <hr className="my-2 border-gray-700" />
                    ) : (
                      <button
                        onClick={() => handleItemClick(item)}
                        disabled={item.disabled}
                        className={cn(
                          'w-full text-left flex items-center space-x-3 px-4 py-3',
                          'text-gray-300 hover:text-white hover:bg-gray-800/50',
                          'transition-colors duration-200 font-medium',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          itemClassName,
                        )}>
                        {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                        <span>{item.label}</span>
                      </button>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop variant
  return (
    <div ref={dropdownRef} className="relative">
      {trigger || defaultTrigger}

      {isOpen && (
        <>
          {backdrop && <div className="fixed inset-0 z-40" onClick={onToggle} />}
          <div
            className={cn(
              'absolute top-full mt-2 bg-gray-900 border border-gray-700',
              'rounded-lg shadow-xl z-50',
              getPositionClasses(),
              getWidthClasses(),
              className,
            )}>
            <div className="py-2">
              {items.map((item) => (
                <div key={item.id}>
                  {item.divider ? (
                    <hr className="my-1 border-gray-700" />
                  ) : (
                    <button
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                      className={cn(
                        'w-full text-left flex items-center space-x-3 px-4 py-2',
                        'text-gray-300 hover:text-white hover:bg-gray-800',
                        'transition-colors duration-200 text-sm',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        itemClassName,
                      )}>
                      {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                      <span>{item.label}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
