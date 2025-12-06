import { useParams } from 'react-router-dom';
import { useTenantStore } from '@/store/tenantStore';
import { useOrderStore } from '@/store/orderStore';
import { Scissors, Palette, Ruler, User } from 'lucide-react';

interface SummaryStepProps {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  setCustomerInfo: (info: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => void;
}

export function SummaryStep({ customerInfo, setCustomerInfo }: SummaryStepProps) {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();
  const { currentOrder } = useOrderStore();

  if (!config || !tenant) return null;

  const fabricDetails = config.fabricOptions.find(f => f.id === currentOrder.fabric?.type);
  const garmentDetails = config.garmentOptions.find(g => g.id === currentOrder.garment);
  const neckDesign = config.designOptions.neckDesigns.find(n => n.id === currentOrder.design?.neckDesign);
  const embroidery = config.designOptions.embroideryStyles.find(e => e.id === currentOrder.design?.embroidery);
  const painting = config.designOptions.paintingStyles.find(p => p.id === currentOrder.design?.painting);

  const updateField = (field: string, value: string) => {
    setCustomerInfo({ ...customerInfo, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <p className="text-muted-foreground text-sm">
          Review your order details and provide your contact information
        </p>
      </div>

      {/* Order Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Order Summary */}
        <div className="space-y-4">
          {/* Fabric */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="w-4 h-4 text-tenant-primary" />
              <h3 className="font-medium text-sm">Fabric</h3>
            </div>
            <p className="text-sm">
              {fabricDetails?.name} - {currentOrder.fabric?.color}
            </p>
          </div>

          {/* Garment */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">👗</span>
              <h3 className="font-medium text-sm">Garment</h3>
            </div>
            <p className="text-sm">{garmentDetails?.name}</p>
            <p className="text-xs text-muted-foreground">{garmentDetails?.description}</p>
          </div>

          {/* Design */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-tenant-primary" />
              <h3 className="font-medium text-sm">Design</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p>Neck: {neckDesign?.name}</p>
              {embroidery && embroidery.id !== 'none' && (
                <p>Embroidery: {embroidery.name}</p>
              )}
              {painting && painting.id !== 'none' && (
                <p>Painting: {painting.name}</p>
              )}
            </div>
          </div>

          {/* Measurements */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="w-4 h-4 text-tenant-primary" />
              <h3 className="font-medium text-sm">Measurements ({currentOrder.unit})</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {config.measurementFields
                .filter(f => currentOrder.measurements?.[f.id])
                .map(field => (
                  <div key={field.id} className="flex justify-between">
                    <span className="text-muted-foreground">{field.name}:</span>
                    <span>{currentOrder.measurements?.[field.id]}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-tenant-primary" />
              <h3 className="font-medium text-sm">Your Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Enter your name"
                  className="input-styled"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Enter your email"
                  className="input-styled"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="input-styled"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Address <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Enter your full address"
                  rows={3}
                  className="input-styled resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing Note */}
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-2">
              Pricing Information
            </h4>
            <p className="text-sm text-amber-600 dark:text-amber-300">
              After reviewing your order, we will send you a price quote via email/phone. 
              You can confirm and proceed with payment once you receive the quote.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
