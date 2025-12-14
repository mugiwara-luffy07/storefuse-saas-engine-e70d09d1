import { cn } from '@/lib/utils';

interface TenantLogoProps {
  logo?: string;
  brandName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-9 w-auto',
  md: 'h-10 w-auto',
  lg: 'h-14 w-auto',
};

const containerSizes = {
  sm: 'px-3 py-2',
  md: 'px-4 py-2.5',
  lg: 'px-5 py-3',
};

export function TenantLogo({ logo, brandName, size = 'md', className }: TenantLogoProps) {
  if (!logo) {
    return (
      <span className={cn("text-xl md:text-2xl font-semibold tracking-tight", className)}>
        {brandName}
      </span>
    );
  }

  return (
    <div className={cn(
      "bg-foreground/90 dark:bg-foreground/95 rounded-lg inline-flex items-center justify-center",
      containerSizes[size],
      className
    )}>
      <img
        src={logo}
        alt={`${brandName} logo`}
        className={cn(sizeClasses[size], "object-contain")}
      />
    </div>
  );
}
