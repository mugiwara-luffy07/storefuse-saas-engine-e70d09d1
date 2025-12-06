import { useParams } from 'react-router-dom';
import { useTenantStore } from '@/store/tenantStore';
import { useOrderStore } from '@/store/orderStore';
import { Check } from 'lucide-react';

export function DesignStep() {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();
  const { currentOrder, setOrderData } = useOrderStore();

  if (!config || !tenant) return null;

  const design = currentOrder.design || {
    neckDesign: '',
    embroidery: 'none',
    painting: 'none',
  };

  const updateDesign = (field: string, value: string) => {
    setOrderData({
      design: {
        ...design,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Design Details</h2>
        <p className="text-muted-foreground text-sm">
          Customize your garment with these design options
        </p>
      </div>

      {/* Neck Design */}
      <div>
        <h3 className="text-sm font-medium mb-3">
          Neck Design <span className="text-destructive">*</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {config.designOptions.neckDesigns.map((option) => (
            <button
              key={option.id}
              onClick={() => updateDesign('neckDesign', option.id)}
              className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                design.neckDesign === option.id
                  ? 'border-tenant-primary bg-tenant-primary/5'
                  : 'border-border hover:border-tenant-primary/50'
              }`}
            >
              {design.neckDesign === option.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-tenant-primary text-tenant-secondary flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <span className="font-medium text-sm">{option.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Embroidery Style */}
      <div>
        <h3 className="text-sm font-medium mb-3">Embroidery Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {config.designOptions.embroideryStyles.map((option) => (
            <button
              key={option.id}
              onClick={() => updateDesign('embroidery', option.id)}
              className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                design.embroidery === option.id
                  ? 'border-tenant-primary bg-tenant-primary/5'
                  : 'border-border hover:border-tenant-primary/50'
              }`}
            >
              {design.embroidery === option.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-tenant-primary text-tenant-secondary flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <span className="font-medium text-sm">{option.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Painting Style */}
      <div>
        <h3 className="text-sm font-medium mb-3">Painting Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {config.designOptions.paintingStyles.map((option) => (
            <button
              key={option.id}
              onClick={() => updateDesign('painting', option.id)}
              className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                design.painting === option.id
                  ? 'border-tenant-primary bg-tenant-primary/5'
                  : 'border-border hover:border-tenant-primary/50'
              }`}
            >
              {design.painting === option.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-tenant-primary text-tenant-secondary flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <span className="font-medium text-sm">{option.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selection Summary */}
      {design.neckDesign && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-fade-in">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Check className="w-5 h-5" />
            <div className="flex flex-wrap gap-2">
              <span className="font-medium">
                Neck: {config.designOptions.neckDesigns.find(n => n.id === design.neckDesign)?.name}
              </span>
              {design.embroidery !== 'none' && (
                <span className="font-medium">
                  | Embroidery: {config.designOptions.embroideryStyles.find(e => e.id === design.embroidery)?.name}
                </span>
              )}
              {design.painting !== 'none' && (
                <span className="font-medium">
                  | Painting: {config.designOptions.paintingStyles.find(p => p.id === design.painting)?.name}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
