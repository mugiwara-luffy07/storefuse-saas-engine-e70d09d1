import { Link } from 'react-router-dom';
import { Building2, Plus, ShoppingBag, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Tenants', value: '2', icon: Building2, color: 'bg-blue-500' },
  { label: 'Total Orders', value: '245', icon: ShoppingBag, color: 'bg-green-500' },
  { label: 'Active This Month', value: '89', icon: TrendingUp, color: 'bg-purple-500' },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-6 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/superadmin/tenants"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
          >
            <Building2 className="w-4 h-4" />
            View Tenants
          </Link>
          <Link
            to="/superadmin/create-tenant"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create Tenant
          </Link>
        </div>
      </div>
    </div>
  );
}
