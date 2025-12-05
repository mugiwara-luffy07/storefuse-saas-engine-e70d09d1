import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useTenantStore } from '@/store/tenantStore';
import { useCartStore } from '@/store/cartStore';

export function Navbar() {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();
  const getTenantItemCount = useCartStore((state) => state.getTenantItemCount);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!config || !tenant) return null;

  const itemCount = getTenantItemCount(tenant);

  return (
    <nav className="nav-tenant sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to={`/${tenant}`} className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-semibold tracking-tight">
              {config.brandName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {config.categories.map((category) => (
              <Link
                key={category}
                to={`/${tenant}/products?category=${category.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-full transition-colors hidden md:flex">
              <Search className="w-5 h-5" />
            </button>
            <Link 
              to={`/${tenant}/admin`}
              className="p-2 hover:bg-muted rounded-full transition-colors hidden md:flex"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              to={`/${tenant}/cart`}
              className="p-2 hover:bg-muted rounded-full transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-tenant-primary text-tenant-secondary text-xs font-medium rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-muted rounded-full transition-colors md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-down">
            <div className="flex flex-col gap-4">
              {config.categories.map((category) => (
                <Link
                  key={category}
                  to={`/${tenant}/products?category=${category.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
              <Link
                to={`/${tenant}/admin`}
                className="text-sm font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" /> Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
