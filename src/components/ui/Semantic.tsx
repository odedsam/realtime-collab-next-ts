import { cn } from '@/utils';

type SectionProps = React.HTMLAttributes<HTMLElement>;

type DialogProps = React.HTMLAttributes<HTMLDialogElement> & {
  open: boolean;
  className?: string;
};

type ArticleProps = React.HTMLAttributes<HTMLElement> & {
  title?: string;
};

type MainProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
};

type AsideProps = React.HTMLAttributes<HTMLElement>;

type HeaderProps = React.HTMLAttributes<HTMLElement>;

type FooterProps = React.HTMLAttributes<HTMLElement>;

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  fluid?: boolean;
  onClick?: () => void;
};

type NavProps = React.HTMLAttributes<HTMLElement> & {
  role?: string;
};

type ParagraphLevel = 'p1' | 'p2' | 'p3' | 'p4';

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> & {
  level?: ParagraphLevel;
  className?: string;
};

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
  className?: string;
};

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
};

export function Img({ className, alt = 'image', ...rest }: ImgProps) {
  return <img className={cn(className)} alt={alt} {...rest} />;
}

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={cn(className)} {...props}>
      {children}
    </section>
  );
}

export function Article({ children, title, className, ...props }: ArticleProps) {
  return (
    <article className={cn('mb-8', className)} {...props}>
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {children}
    </article>
  );
}

export function Main({ children, className, ...props }: MainProps) {
  return (
    <main className={cn(className)} {...props}>
      {children}
    </main>
  );
}

export function Dialog({ children, className, open, ...props }: DialogProps) {
  return (
    <dialog className={cn(className)} open={open} {...props}>
      {children}
    </dialog>
  );
}

export function Aside({ children, className, ...props }: AsideProps) {
  return (
    <aside className={cn('w-64 p-4 bg-gray-100 rounded-md', className)} {...props}>
      {children}
    </aside>
  );
}

export function Header({ children, className, ...props }: HeaderProps) {
  return (
    <header className={cn(className)} {...props}>
      {children}
    </header>
  );
}

export function Nav({ children, className, role = 'navigation', ...props }: NavProps) {
  return (
    <nav className={cn('w-full', className)} role={role} {...props}>
      {children}
    </nav>
  );
}

export function Footer({ children, className, ...props }: FooterProps) {
  return (
    <footer className={cn(className)} {...props}>
      {children}
    </footer>
  );
}

export function Container({ children, className, fluid, ...props }: ContainerProps) {
  return (
    <div className={cn(fluid ? 'w-full' : 'max-w-7xl', className)} {...props}>
      {children}
    </div>
  );
}

const paragraphSizes: Record<ParagraphLevel, string> = {
  p1: 'text-sm md:text-base lg:text-lg',
  p2: 'text-base md:text-lg lg:text-xl',
  p3: 'text-lg md:text-xl lg:text-2xl',
  p4: 'text-xl md:text-2xl lg:text-3xl',
};

export function Paragraph({ children, level = 'p2', className, ...props }: ParagraphProps) {
  return (
    <p className={cn('font-clash', paragraphSizes[level], className)} {...props}>
      {children}
    </p>
  );
}

const headingSizes: Record<HeadingLevel, string> = {
  h1: 'text-2xl md:text-3xl lg:text-4xl',
  h2: 'text-xl md:text-2xl lg:text-3xl',
  h3: 'text-lg md:text-xl lg:text-2xl',
  h4: 'text-base md:text-lg lg:text-xl',
  h5: 'text-sm md:text-base lg:text-lg',
  h6: 'text-xs md:text-sm lg:text-base',
};

export function Heading({ children, level = 'h1', className, ...props }: HeadingProps) {
  const Tag = level;
  return (
    <Tag className={cn('font-clash', headingSizes[level], className)} {...props}>
      {children}
    </Tag>
  );
}
