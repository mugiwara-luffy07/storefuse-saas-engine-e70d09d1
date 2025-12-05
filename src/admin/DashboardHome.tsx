import { useParams } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { useTenantStore } from '@/store/tenantStore';
import { getProductsByTenant } from '@/data/mockProducts';

const stats = [
  {
    label: 'Total Products',
    value: '24',
    change: '+3 this month',
    icon: Package,
    trend: 'up',
  },
  {
    label: 'Total Orders',
    value: '156',
    change: '+12 this week',
    icon: ShoppingCart,
    trend: 'up',
  },
  {
    label: 'Revenue',
    value: '$12,450',
    change: '+8.2% vs last month',
    icon: DollarSign,
    trend: 'up',
  },
  {
    label: 'Conversion Rate',
    value: '3.2%',
    change: '+0.4% this week',
    icon: TrendingUp,
    trend: 'up',
  },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', total: 156, status: 'pending' },
  { id: 'ORD-002', customer: 'Jane Smith', total: 89, status: 'confirmed' },
  { id: 'ORD-003', customer: 'Mike Johnson', total: 234, status: 'dispatched' },
  { id: 'ORD-004', customer: 'Sarah Wilson', total: 178, status: 'delivered' },
];

export default function DashboardHome() {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();

  if (!config || !tenant) return null;

  const products = getProductsByTenant(tenant);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with {config.brandName}.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="stat-card animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-tenant-primary/10">
                <stat.icon className="w-5 h-5 text-tenant-primary" />
              </div>
            </div>
            <p className="text-2xl font-semibold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-green-600 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="admin-card">
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">${order.total}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : order.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'dispatched'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="admin-card">
          <h2 className="font-semibold mb-4">Top Products</h2>
          <div className="space-y-3">
            {products.slice(0, 4).map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <span className="text-sm font-medium text-muted-foreground w-6">
                  #{index + 1}
                </span>
                <div className="w-12 h-14 rounded-md overflow-hidden bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <p className="font-medium">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
