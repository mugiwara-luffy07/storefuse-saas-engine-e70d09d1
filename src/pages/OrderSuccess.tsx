import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Phone, Mail, Package } from 'lucide-react';
import { useTenantStore } from '@/store/tenantStore';

interface OrderState {
  orderId: string;
  total: number;
  items: any[];
}

export default function OrderSuccess() {
  const { tenant } = useParams<{ tenant: string }>();
  const location = useLocation();
  const { config } = useTenantStore();
  const state = location.state as OrderState | null;

  if (!state || !tenant) {
    return <Navigate to={`/${tenant}/products`} replace />;
  }

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground mb-8">
          Thank you for shopping with {config?.brandName}
        </p>

        <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-semibold">{state.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-semibold">${state.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-3">
            {state.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-14 rounded-md overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-5 h-5 text-tenant-primary" />
            <div className="text-left">
              <p className="font-medium">You will receive a call shortly</p>
              <p className="text-sm text-muted-foreground">
                Our team will contact you to confirm your order and delivery details.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-tenant-primary" />
            <div className="text-left">
              <p className="font-medium">Order confirmation sent</p>
              <p className="text-sm text-muted-foreground">
                Check your email for the order details and tracking information.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-tenant-primary" />
            <div className="text-left">
              <p className="font-medium">Estimated delivery: 3-5 business days</p>
              <p className="text-sm text-muted-foreground">
                Cash on delivery - pay when you receive your order.
              </p>
            </div>
          </div>
        </div>

        <Link to={`/${tenant}/products`} className="btn-tenant">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
