import { useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useTenantStore } from '@/store/tenantStore';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { tenant } = useParams<{ tenant: string }>();
  const { loadTenant, isLoading, config } = useTenantStore();

  useEffect(() => {
    if (tenant) {
      loadTenant(tenant);
    }
  }, [tenant, loadTenant]);

  if (isLoading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading brand...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
