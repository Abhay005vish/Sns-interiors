import { cn } from '../ui/utils';

export function Heading({ as: Tag = 'h2', children, className }: { as?: 'h1' | 'h2' | 'h3' | 'h4'; children: React.ReactNode; className?: string }) {
  return <Tag className={cn('font-serif text-foreground', className)}>{children}</Tag>;
}
