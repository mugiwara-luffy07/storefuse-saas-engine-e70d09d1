import { useParams } from 'react-router-dom';
import { useTenantStore } from '@/store/tenantStore';
import { useOrderStore } from '@/store/orderStore';
import { Check } from 'lucide-react';

export function GarmentStep() {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();
  const { currentOrder, setOrderData } = useOrderStore();

  if (!config || !tenant) return null;

  const selectedGarment = currentOrder.garment;

  const handleGarmentSelect = (garmentId: string) => {
    setOrderData({ garment: garmentId });
  };

  const currentGarmentDetails = config.garmentOptions.find(g => g.id === selectedGarment);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Select Garment Type</h2>
        <p className="text-muted-foreground text-sm">
          Choose the type of garment you want tailored
        </p>
      </div>

      {/* Garment Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.garmentOptions.map((garment) => (
          <button
            key={garment.id}
            onClick={() => handleGarmentSelect(garment.id)}
            className={`relative p-6 rounded-xl border-2 text-left transition-all ${
              selectedGarment === garment.id
                ? 'border-tenant-primary bg-tenant-primary/5'
                : 'border-border hover:border-tenant-primary/50 hover:bg-muted/50'
            }`}
          >
            {selectedGarment === garment.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-tenant-primary text-tenant-secondary flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="text-2xl">👗</span>
            </div>
            <h3 className="font-semibold mb-1">{garment.name}</h3>
            <p className="text-sm text-muted-foreground">{garment.description}</p>
          </button>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedGarment && currentGarmentDetails && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-fade-in">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Check className="w-5 h-5" />
            <span className="font-medium">
              Selected: {currentGarmentDetails.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
