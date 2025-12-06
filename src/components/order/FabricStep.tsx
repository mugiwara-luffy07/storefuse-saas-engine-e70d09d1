import { useParams } from 'react-router-dom';
import { useTenantStore } from '@/store/tenantStore';
import { useOrderStore } from '@/store/orderStore';
import { Check } from 'lucide-react';

export function FabricStep() {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();
  const { currentOrder, setOrderData } = useOrderStore();

  if (!config || !tenant) return null;

  const selectedFabric = currentOrder.fabric;

  const handleFabricSelect = (fabricId: string) => {
    const fabric = config.fabricOptions.find(f => f.id === fabricId);
    if (fabric) {
      setOrderData({
        fabric: {
          type: fabricId,
          color: selectedFabric?.type === fabricId ? selectedFabric.color : '',
        },
      });
    }
  };

  const handleColorSelect = (color: string) => {
    if (selectedFabric?.type) {
      setOrderData({
        fabric: {
          ...selectedFabric,
          color,
        },
      });
    }
  };

  const currentFabric = config.fabricOptions.find(f => f.id === selectedFabric?.type);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Select Your Fabric</h2>
        <p className="text-muted-foreground text-sm">
          Choose from our premium fabric collection
        </p>
      </div>

      {/* Fabric Types */}
      <div>
        <h3 className="text-sm font-medium mb-3">Fabric Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {config.fabricOptions.map((fabric) => (
            <button
              key={fabric.id}
              onClick={() => handleFabricSelect(fabric.id)}
              className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                selectedFabric?.type === fabric.id
                  ? 'border-tenant-primary bg-tenant-primary/5'
                  : 'border-border hover:border-tenant-primary/50'
              }`}
            >
              {selectedFabric?.type === fabric.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-tenant-primary text-tenant-secondary flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <h4 className="font-medium text-sm">{fabric.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {fabric.colors.length} colors
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      {currentFabric && (
        <div className="animate-fade-in">
          <h3 className="text-sm font-medium mb-3">Select Color for {currentFabric.name}</h3>
          <div className="flex flex-wrap gap-3">
            {currentFabric.colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  selectedFabric?.color === color
                    ? 'border-tenant-primary bg-tenant-primary text-tenant-secondary'
                    : 'border-border hover:border-tenant-primary/50'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {selectedFabric?.type && selectedFabric?.color && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-fade-in">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Check className="w-5 h-5" />
            <span className="font-medium">
              Selected: {currentFabric?.name} - {selectedFabric.color}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
