import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

export default function Checkout() {
  const { tenant } = useParams<{ tenant: string }>();
  const navigate = useNavigate();
  const { getTenantItems, getTenantTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: '',
  });

  if (!tenant) return null;

  const items = getTenantItems(tenant);
  const total = getTenantTotal(tenant);
  const shipping = total > 100 ? 0 : 9.99;
  const finalTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Link to={`/${tenant}/products`} className="btn-tenant">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate order ID
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // Clear cart and navigate to success
    clearCart();
    toast.success('Order placed successfully!');
    navigate(`/${tenant}/order-success`, {
      state: { orderId, total: finalTotal, items },
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <Link
          to={`/${tenant}/cart`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to cart
        </Link>

        <h1 className="text-2xl md:text-3xl font-semibold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="font-semibold mb-4">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="input-styled"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="input-styled"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-styled"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="input-styled"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="input-styled"
                      placeholder="Street address, apartment, etc."
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="input-styled"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        className="input-styled"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="input-styled resize-none"
                      placeholder="Special instructions for delivery"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="font-semibold mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-tenant-primary bg-tenant-primary/5">
                  <input
                    type="radio"
                    name="payment"
                    checked
                    readOnly
                    className="w-4 h-4 accent-tenant-primary"
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Pay when you receive your order
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-muted/50 rounded-lg p-6 sticky top-24">
                <h2 className="font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground">
                          {item.size} × {item.quantity}
                        </p>
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-tenant w-full mt-6 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-tenant-secondary/30 border-t-tenant-secondary rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Place Order
                    </>
                  )}
                </button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  By placing your order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
