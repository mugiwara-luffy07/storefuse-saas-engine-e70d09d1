import { useParams } from 'react-router-dom';
import { ClipboardList, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { useTenantStore } from '@/store/tenantStore';

const stats = [
  {
    label: 'Total Orders',
    value: '24',
    change: '+3 this week',
    icon: ClipboardList,
    trend: 'up',
  },
  {
    label: 'Pending Pricing',
    value: '8',
    change: 'Needs attention',
    icon: Clock,
    trend: 'neutral',
  },
  {
    label: 'In Production',
    value: '12',
    change: 'Currently processing',
    icon: DollarSign,
    trend: 'up',
  },
  {
    label: 'Completed',
    value: '156',
    change: 'Total delivered',
    icon: CheckCircle,
    trend: 'up',
  },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Priya Sharma', garment: 'Blouse', status: 'pricing_pending' },
  { id: 'ORD-002', customer: 'Anita Rao', garment: 'Churidhar', status: 'price_sent' },
  { id: 'ORD-003', customer: 'Meera Patel', garment: 'Frock', status: 'processing' },
  { id: 'ORD-004', customer: 'Deepika Kumar', garment: 'Salwar Kameez', status: 'delivered' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pricing_pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'price_sent':
      return 'bg-blue-100 text-blue-700';
    case 'processing':
      return 'bg-purple-100 text-purple-700';
    case 'packed':
      return 'bg-indigo-100 text-indigo-700';
    case 'dispatched':
      return 'bg-orange-100 text-orange-700';
    case 'delivered':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function DashboardHome() {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();

  if (!config || !tenant) return null;

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
            <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

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
              <div className="text-center">
                <p className="text-sm">{order.garment}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(order.status)}`}
              >
                {formatStatus(order.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
