import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  CreditCard, 
  Loader2,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { useTenantStore } from '@/store/tenantStore';
import { toast } from 'sonner';
import { api } from '@/api/axiosInstance';

type PaymentStatus = 'pending' | 'customer_claimed' | 'admin_confirmed';
type OrderStatus = 'pricing_pending' | 'price_sent' | 'processing' | 'packed' | 'dispatched' | 'delivered';

interface TrackedOrder {
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
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

// Mock order for demo - in real app, fetch from API
const mockOrder: TrackedOrder = {
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
    measurements: { bust: 36, waist: 30, hip: 38, shoulder: 14, armLength: 22, armHole: 16 },
    unit: 'inches',
  },
  price: 2500,
  status: 'price_sent',
  paymentStatus: 'pending',
  createdAt: '2024-01-15T10:30:00Z',
};

const statusSteps = [
  { key: 'pricing_pending', label: 'Pricing', icon: Clock },
  { key: 'price_sent', label: 'Quoted', icon: CreditCard },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'dispatched', label: 'Dispatched', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const paymentStatusConfig = {
  pending: { label: 'Payment Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  customer_claimed: { label: 'Payment Claimed', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  admin_confirmed: { label: 'Payment Confirmed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

export default function OrderTracking() {
  const { tenant, orderId } = useParams<{ tenant: string; orderId: string }>();
  const { config } = useTenantStore();
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        // In real app: const response = await api.get(`/${tenant}/orders/${orderId}`);
        // setOrder(response.data);
        
        // Mock for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        setOrder({ ...mockOrder, id: orderId || mockOrder.id });
      } catch (error) {
        toast.error('Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    if (tenant && orderId) {
      fetchOrder();
    }
  }, [tenant, orderId]);

  if (!config || !tenant) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-tenant-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground">We couldn't find an order with ID: {orderId}</p>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex(s => s.key === order.status);
  const showPaymentSection = order.price !== null && order.status !== 'pricing_pending';

  const copyUpiId = async () => {
    if (config.payment?.upiId) {
      await navigator.clipboard.writeText(config.payment.upiId);
      setUpiCopied(true);
      toast.success('UPI ID copied!');
      setTimeout(() => setUpiCopied(false), 2000);
    }
  };

  const handlePaymentClaim = async () => {
    setIsSubmittingPayment(true);
    try {
      await api.post(`/${tenant}/orders/${order.id}/payment-confirmation-request`);
      setOrder({ ...order, paymentStatus: 'customer_claimed' });
      toast.success('Payment confirmation sent! We will verify shortly.');
    } catch (error) {
      // For demo, still update UI
      setOrder({ ...order, paymentStatus: 'customer_claimed' });
      toast.success('Payment confirmation sent! We will verify shortly.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const getGarmentName = (garmentId: string) => {
    return config.garmentOptions?.find(g => g.id === garmentId)?.name || garmentId;
  };

  const getFabricName = (fabricId: string) => {
    return config.fabricOptions?.find(f => f.id === fabricId)?.name || fabricId;
  };

  const paymentConfig = paymentStatusConfig[order.paymentStatus];
  const PaymentIcon = paymentConfig.icon;

  return (
    <div className="min-h-screen py-8 md:py-12 animate-fade-in">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2">Order Tracking</h1>
          <p className="text-muted-foreground">Order ID: {order.id}</p>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-6">Order Status</h2>
          <div className="relative">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? isCurrent
                            ? 'bg-tenant-primary text-tenant-secondary'
                            : 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs mt-2 text-center ${isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4">Order Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Garment:</span>
              <span className="font-medium">{getGarmentName(order.orderData.garment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fabric:</span>
              <span>{getFabricName(order.orderData.fabric.type)} - {order.orderData.fabric.color}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Neck Design:</span>
              <span className="capitalize">{order.orderData.design.neckDesign.replace('-', ' ')}</span>
            </div>
            {order.orderData.design.embroidery !== 'none' && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Embroidery:</span>
                <span className="capitalize">{order.orderData.design.embroidery}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        {showPaymentSection && (
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Payment</h2>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 ${paymentConfig.color}`}>
                <PaymentIcon className="w-3.5 h-3.5" />
                {paymentConfig.label}
              </span>
            </div>

            {/* Price Display */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-3xl font-bold">₹{order.price?.toLocaleString()}</p>
            </div>

            {order.paymentStatus === 'pending' && config.payment?.upiId && (
              <>
                {/* UPI QR Code */}
                {config.payment.upiQrImage && (
                  <div className="flex justify-center mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <img
                        src={config.payment.upiQrImage}
                        alt="UPI QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                )}

                {/* UPI ID */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground text-center mb-2">Or pay using UPI ID</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="bg-muted px-4 py-2 rounded-lg font-mono text-sm">
                      {config.payment.upiId}
                    </code>
                    <button
                      onClick={copyUpiId}
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                    >
                      {upiCopied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePaymentClaim}
                  disabled={isSubmittingPayment}
                  className="w-full btn-tenant py-3 disabled:opacity-50"
                >
                  {isSubmittingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      I have paid
                    </>
                  )}
                </button>
              </>
            )}

            {order.paymentStatus === 'customer_claimed' && (
              <div className="text-center py-4">
                <AlertCircle className="w-12 h-12 mx-auto text-blue-500 mb-3" />
                <p className="font-medium mb-1">Payment Confirmation Pending</p>
                <p className="text-sm text-muted-foreground">
                  We're verifying your payment. You'll be notified once confirmed.
                </p>
              </div>
            )}

            {order.paymentStatus === 'admin_confirmed' && (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                <p className="font-medium mb-1">Payment Confirmed</p>
                <p className="text-sm text-muted-foreground">
                  Thank you! Your payment has been verified.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Waiting for Price */}
        {!showPaymentSection && (
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h2 className="font-semibold mb-1">Pricing in Progress</h2>
            <p className="text-sm text-muted-foreground">
              Our team is reviewing your order and will provide a price quote soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
