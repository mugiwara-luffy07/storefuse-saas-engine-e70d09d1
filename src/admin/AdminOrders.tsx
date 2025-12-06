import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Eye, X, ChevronDown, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useTenantStore } from '@/store/tenantStore';

interface CustomOrder {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  orderData: {
    fabric: { type: string; color: string };
    garment: string;
    design: { neckDesign: string; embroidery: string; painting: string };
    measurements: Record<string, number>;
    unit: string;
  };
  price: number | null;
  status: 'pricing_pending' | 'price_sent' | 'processing' | 'packed' | 'dispatched' | 'delivered';
  createdAt: string;
}

const mockOrders: CustomOrder[] = [
  {
    id: 'ORD-T001',
    customer: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      address: '123 MG Road, Bangalore, Karnataka 560001',
    },
    orderData: {
      fabric: { type: 'silk', color: 'Ivory' },
      garment: 'blouse',
      design: { neckDesign: 'boat', embroidery: 'zari', painting: 'none' },
      measurements: { bust: 36, waist: 30, hip: 38, shoulder: 14, armLength: 22, armHole: 16, frontLength: 15, backLength: 16 },
      unit: 'inches',
    },
    price: null,
    status: 'pricing_pending',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'ORD-T002',
    customer: {
      name: 'Anita Rao',
      email: 'anita@example.com',
      phone: '+91 98765 43211',
      address: '456 Jubilee Hills, Hyderabad, Telangana 500033',
    },
    orderData: {
      fabric: { type: 'cotton', color: 'Navy' },
      garment: 'churidhar',
      design: { neckDesign: 'mandarin', embroidery: 'thread', painting: 'floral' },
      measurements: { bust: 34, waist: 28, hip: 36, shoulder: 13.5, armLength: 21, armHole: 15, frontLength: 40, backLength: 41 },
      unit: 'inches',
    },
    price: 2500,
    status: 'price_sent',
    createdAt: '2024-01-14T15:45:00Z',
  },
  {
    id: 'ORD-T003',
    customer: {
      name: 'Meera Patel',
      email: 'meera@example.com',
      phone: '+91 98765 43212',
      address: '789 CG Road, Ahmedabad, Gujarat 380006',
    },
    orderData: {
      fabric: { type: 'chiffon', color: 'Blush' },
      garment: 'gown',
      design: { neckDesign: 'sweetheart', embroidery: 'sequin', painting: 'none' },
      measurements: { bust: 35, waist: 29, hip: 37, shoulder: 14, armLength: 22, armHole: 15.5, frontLength: 55, backLength: 56 },
      unit: 'inches',
    },
    price: 4500,
    status: 'processing',
    createdAt: '2024-01-13T09:20:00Z',
  },
  {
    id: 'ORD-T004',
    customer: {
      name: 'Deepika Kumar',
      email: 'deepika@example.com',
      phone: '+91 98765 43213',
      address: '321 Anna Nagar, Chennai, Tamil Nadu 600040',
    },
    orderData: {
      fabric: { type: 'linen', color: 'Natural' },
      garment: 'top',
      design: { neckDesign: 'v-neck', embroidery: 'none', painting: 'abstract' },
      measurements: { bust: 33, waist: 27, hip: 35, shoulder: 13, armLength: 20, armHole: 14.5, frontLength: 24, backLength: 25 },
      unit: 'inches',
    },
    price: 1800,
    status: 'delivered',
    createdAt: '2024-01-10T14:00:00Z',
  },
];

const statusOptions = ['pricing_pending', 'price_sent', 'processing', 'packed', 'dispatched', 'delivered'] as const;

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

export default function AdminOrders() {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();
  const [orders, setOrders] = useState<CustomOrder[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priceInput, setPriceInput] = useState('');

  if (!tenant || !config) return null;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (orderId: string, newStatus: CustomOrder['status']) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    toast.success(`Order status updated to ${formatStatus(newStatus)}`);
  };

  const updatePrice = (orderId: string) => {
    const price = parseFloat(priceInput);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, price, status: 'price_sent' } : order
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, price, status: 'price_sent' });
    }
    setPriceInput('');
    toast.success('Price updated and sent to customer');
  };

  const getGarmentName = (garmentId: string) => {
    return config.garmentOptions.find(g => g.id === garmentId)?.name || garmentId;
  };

  const getFabricName = (fabricId: string) => {
    return config.fabricOptions.find(f => f.id === fabricId)?.name || fabricId;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Custom Orders</h1>
        <p className="text-muted-foreground">Manage and track tailoring orders</p>
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
          className="input-styled w-full sm:w-48"
        >
          <option value="all">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
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
                <th className="text-left p-4">Garment</th>
                <th className="text-left p-4">Price</th>
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
                    <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{getGarmentName(order.orderData.garment)}</p>
                    <p className="text-xs text-muted-foreground">
                      {getFabricName(order.orderData.fabric.type)} - {order.orderData.fabric.color}
                    </p>
                  </td>
                  <td className="p-4">
                    {order.price ? (
                      <span className="font-medium">₹{order.price.toLocaleString()}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">Pending</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value as CustomOrder['status'])
                        }
                        className={`appearance-none text-xs px-3 py-1.5 pr-7 rounded-full cursor-pointer font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
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
          <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
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
              {/* Status & Price */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {formatStatus(selectedOrder.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  {selectedOrder.price ? (
                    <span className="font-semibold">₹{selectedOrder.price.toLocaleString()}</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        placeholder="Enter price"
                        className="input-styled w-32 text-sm"
                      />
                      <button
                        onClick={() => updatePrice(selectedOrder.id)}
                        className="btn-tenant text-sm py-1.5"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Set Price
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer */}
              <div>
                <h3 className="font-medium mb-2">Customer Details</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customer.name}</p>
                  <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customer.email}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customer.phone}</p>
                  <p><span className="text-muted-foreground">Address:</span> {selectedOrder.customer.address}</p>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="font-medium mb-2">Order Details</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fabric:</span>
                    <span>{getFabricName(selectedOrder.orderData.fabric.type)} - {selectedOrder.orderData.fabric.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Garment:</span>
                    <span>{getGarmentName(selectedOrder.orderData.garment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Neck Design:</span>
                    <span className="capitalize">{selectedOrder.orderData.design.neckDesign.replace('-', ' ')}</span>
                  </div>
                  {selectedOrder.orderData.design.embroidery !== 'none' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Embroidery:</span>
                      <span className="capitalize">{selectedOrder.orderData.design.embroidery}</span>
                    </div>
                  )}
                  {selectedOrder.orderData.design.painting !== 'none' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Painting:</span>
                      <span className="capitalize">{selectedOrder.orderData.design.painting}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Measurements */}
              <div>
                <h3 className="font-medium mb-2">Measurements ({selectedOrder.orderData.unit})</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {Object.entries(selectedOrder.orderData.measurements).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
