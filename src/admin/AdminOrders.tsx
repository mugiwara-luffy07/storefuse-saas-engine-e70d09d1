import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Eye, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered';
  createdAt: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-K8X2M1',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      address: '123 Main St, New York, NY 10001',
    },
    items: [
      {
        name: 'Oversized Cotton Tee',
        size: 'M',
        quantity: 2,
        price: 68,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=120&fit=crop',
      },
    ],
    total: 145.99,
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'ORD-P3N7Q2',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8901',
      address: '456 Oak Ave, Los Angeles, CA 90001',
    },
    items: [
      {
        name: 'Silk Camisole',
        size: 'S',
        quantity: 1,
        price: 98,
        image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=100&h=120&fit=crop',
      },
      {
        name: 'Wide Leg Jeans',
        size: '26',
        quantity: 1,
        price: 148,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100&h=120&fit=crop',
      },
    ],
    total: 255.99,
    status: 'confirmed',
    createdAt: '2024-01-14T15:45:00Z',
  },
  {
    id: 'ORD-R9T4W5',
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 234 567 8902',
      address: '789 Pine Rd, Chicago, IL 60601',
    },
    items: [
      {
        name: 'Cashmere Knit Sweater',
        size: 'L',
        quantity: 1,
        price: 298,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=120&fit=crop',
      },
    ],
    total: 307.99,
    status: 'dispatched',
    createdAt: '2024-01-13T09:20:00Z',
  },
  {
    id: 'ORD-L2V8X3',
    customer: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 234 567 8903',
      address: '321 Elm St, Miami, FL 33101',
    },
    items: [
      {
        name: 'Structured Blazer',
        size: 'M',
        quantity: 1,
        price: 248,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=120&fit=crop',
      },
    ],
    total: 257.99,
    status: 'delivered',
    createdAt: '2024-01-10T14:00:00Z',
  },
];

const statusOptions = ['pending', 'confirmed', 'dispatched', 'delivered'] as const;

export default function AdminOrders() {
  const { tenant } = useParams<{ tenant: string }>();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!tenant) return null;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    toast.success(`Order status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'dispatched':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Orders</h1>
        <p className="text-muted-foreground">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="input-styled pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-styled w-full sm:w-40"
        >
          <option value="all">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4 hidden md:table-cell">Customer</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <p className="text-sm">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value as Order['status'])
                        }
                        className={`appearance-none text-xs px-3 py-1.5 pr-7 rounded-full cursor-pointer font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold">Order {selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-muted rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              {/* Customer */}
              <div>
                <h3 className="font-medium mb-2">Customer Details</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Name:</span>{' '}
                    {selectedOrder.customer.name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span>{' '}
                    {selectedOrder.customer.email}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Phone:</span>{' '}
                    {selectedOrder.customer.phone}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Address:</span>{' '}
                    {selectedOrder.customer.address}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-muted/50 rounded-lg p-3"
                    >
                      <div className="w-12 h-14 rounded-md overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
