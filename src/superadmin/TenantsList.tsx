import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ExternalLink, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Tenant {
  id: string;
  tenantId: string;
  brandName: string;
  primaryColor: string;
  logo: string;
  createdAt: string;
  productsCount: number;
  ordersCount: number;
}

const mockTenants: Tenant[] = [
  {
    id: '1',
    tenantId: 'mizuki',
    brandName: 'Mizuki',
    primaryColor: '#1a1a1a',
    logo: '/logos/mizuki.svg',
    createdAt: '2024-01-01',
    productsCount: 8,
    ordersCount: 156,
  },
  {
    id: '2',
    tenantId: 'pinkthreads',
    brandName: 'Pink Threads',
    primaryColor: '#db2777',
    logo: '/logos/pinkthreads.svg',
    createdAt: '2024-01-05',
    productsCount: 6,
    ordersCount: 89,
  },
];

export default function TenantsList() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTenants = tenants.filter(
    (t) =>
      t.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tenantId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      setTenants(tenants.filter((t) => t.id !== id));
      toast.success('Tenant deleted');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Tenants</h1>
          <p className="text-muted-foreground">Manage your brand tenants</p>
        </div>
        <Link
          to="/superadmin/create"
          className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Tenant
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tenants..."
          className="input-styled pl-10"
        />
      </div>

      {/* Tenants Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTenants.map((tenant, index) => (
          <div
            key={tenant.id}
            className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  {tenant.brandName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{tenant.brandName}</h3>
                  <p className="text-sm text-muted-foreground">/{tenant.tenantId}</p>
                </div>
              </div>
              <div
                className="w-6 h-6 rounded-full border-2 border-border"
                style={{ backgroundColor: tenant.primaryColor }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-lg font-semibold">{tenant.productsCount}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-lg font-semibold">{tenant.ordersCount}</p>
                <p className="text-xs text-muted-foreground">Orders</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Created {new Date(tenant.createdAt).toLocaleDateString()}
            </p>

            <div className="flex items-center gap-2">
              <Link
                to={`/${tenant.tenantId}`}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View
              </Link>
              <Link
                to={`/${tenant.tenantId}/admin/dashboard`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Admin
              </Link>
              <button
                onClick={() => handleDelete(tenant.id)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No tenants found</p>
          <Link
            to="/superadmin/create"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium"
          >
            Create your first tenant
          </Link>
        </div>
      )}
    </div>
  );
}
