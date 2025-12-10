import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_TENANT } from '@/config/defaultTenant';

// Root page redirects to default tenant
export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/${DEFAULT_TENANT}`, { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}
