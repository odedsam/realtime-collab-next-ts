'use client';

import { ElementType, ReactNode } from 'react';
import { cn } from '@/utils';

type HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
  as?: HeadingLevels;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
  className?: string;
  children: ReactNode;
  id?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  uppercase?: boolean;
  [key: string]: any;
}

const sizeMap: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const weightMap: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

const alignMap: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const Heading = ({
  as = 'h3',
  size = 'lg',
  weight = 'semibold',
  color = 'text-gray-900',
  className,
  children,
  id,
  align = 'left',
  uppercase = false,
  ...rest
}: HeadingProps) => {
  const Tag: ElementType = as;

  return (
    <Tag id={id} className={cn(sizeMap[size], weightMap[weight], color, alignMap[align], uppercase && 'uppercase', className)} {...rest}>
      {children}
    </Tag>
  );
};

interface ParagraphProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'justify';
  lineClamp?: number;
  ellipsis?: boolean;
  uppercase?: boolean;
  id?: string;
  [key: string]: any;
}

const paraSizeMap: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const paraAlignMap: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const Paragraph = ({
  size = 'md',
  color = 'text-gray-700',
  className,
  children,
  align = 'left',
  lineClamp,
  ellipsis = false,
  uppercase = false,
  id,
  ...rest
}: ParagraphProps) => {
  return (
    <p
      id={id}
      className={cn(
        paraSizeMap[size],
        color,
        paraAlignMap[align],
        uppercase && 'uppercase',
        ellipsis && 'truncate',
        lineClamp ? `line-clamp-${lineClamp}` : '',
        className,
      )}
      {...rest}>
      {children}
    </p>
  );
};

/* Usuage Example :

!Heading
import React from 'react';
import { Heading } from './Heading';

export default function HeadingExample() {
  return (
    <>
      <Heading as="h1" size="3xl" weight="extrabold" color="text-lime-500" align="center" uppercase>
       Main Healine
      </Heading>

      <Heading as="h3" size="lg" weight="semibold" color="text-gray-800" id="section-subtitle">
        Sub Headline with id and Accesibility
      </Heading>
    </>
  );
}



*/

/* Usage :

!Paragraph
import React from 'react';
import { Paragraph } from './Paragraph';

export default function ParagraphExample() {
  return (
    <>
      <Paragraph
        size="md"
        color="text-gray-600"
        align="justify"
        lineClamp={3}
        ellipsis
      >
        This is a paragraph text demonstrating text truncation with three lines,
        adding ellipsis at the end. The text can be very long but will display
        cleanly and responsively.
      </Paragraph>

      <Paragraph size="sm" color="text-gray-500" uppercase>
        Small text with uppercase letters.
      </Paragraph>
    </>
  );
}


*/
