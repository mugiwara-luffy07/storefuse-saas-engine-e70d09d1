import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useTenantStore } from '@/store/tenantStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { TenantLogo } from '@/components/TenantLogo';

export default function AdminLogin() {
  const { tenant } = useParams<{ tenant: string }>();
  const navigate = useNavigate();
  const { config } = useTenantStore();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!config || !tenant) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email && password) {
      login(
        { id: '1', email, role: 'admin', tenant },
        'mock-token-' + Date.now()
      );
      toast.success('Welcome back!');
      navigate(`/${tenant}/admin/dashboard`);
    } else {
      toast.error('Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <Link
          to={`/${tenant}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to store
        </Link>

        <div className="bg-card rounded-xl border border-border p-8 shadow-sm animate-fade-in">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <TenantLogo logo={config.logo} brandName={config.brandName} size="lg" />
            </div>
            <p className="text-muted-foreground">Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-styled"
                placeholder="admin@brand.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-styled pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-tenant w-full py-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-tenant-secondary/30 border-t-tenant-secondary rounded-full animate-spin mx-auto" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Demo: Use any email/password to login
          </p>
        </div>
      </div>
    </div>
  );
}
