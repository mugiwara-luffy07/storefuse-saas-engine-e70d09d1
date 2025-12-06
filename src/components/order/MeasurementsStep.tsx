import { useParams } from 'react-router-dom';
import { useTenantStore } from '@/store/tenantStore';
import { useOrderStore } from '@/store/orderStore';
import { Ruler } from 'lucide-react';

export function MeasurementsStep() {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();
  const { currentOrder, setOrderData } = useOrderStore();

  if (!config || !tenant) return null;

  const measurements = currentOrder.measurements || {};
  const unit = currentOrder.unit || 'inches';

  const updateMeasurement = (fieldId: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setOrderData({
      measurements: {
        ...measurements,
        [fieldId]: numValue,
      },
    });
  };

  const toggleUnit = () => {
    setOrderData({ unit: unit === 'inches' ? 'cm' : 'inches' });
  };

  const requiredFields = config.measurementFields.filter(f => f.required);
  const optionalFields = config.measurementFields.filter(f => !f.required);
  const filledRequired = requiredFields.filter(f => measurements[f.id]).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Measurements</h2>
          <p className="text-muted-foreground text-sm">
            Enter your measurements for a perfect fit
          </p>
        </div>
        
        {/* Unit Toggle */}
        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => unit !== 'inches' && toggleUnit()}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              unit === 'inches' ? 'bg-background shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Inches
          </button>
          <button
            onClick={() => unit !== 'cm' && toggleUnit()}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              unit === 'cm' ? 'bg-background shadow-sm' : 'text-muted-foreground'
            }`}
          >
            CM
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {filledRequired}/{requiredFields.length} required fields
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-tenant-primary transition-all duration-300"
            style={{ width: `${(filledRequired / requiredFields.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Required Measurements */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Ruler className="w-4 h-4" />
          Required Measurements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {requiredFields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium mb-1.5">
                {field.name} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={measurements[field.id] || ''}
                  onChange={(e) => updateMeasurement(field.id, e.target.value)}
                  placeholder="0"
                  className="input-styled pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Measurements */}
      {optionalFields.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Optional Measurements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {optionalFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-1.5">
                  {field.name}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={measurements[field.id] || ''}
                    onChange={(e) => updateMeasurement(field.id, e.target.value)}
                    placeholder="0"
                    className="input-styled pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Measurement Guide */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">
          Measurement Tips
        </h4>
        <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
          <li>• Use a soft measuring tape for accurate measurements</li>
          <li>• Measure over undergarments for best results</li>
          <li>• Keep the tape snug but not tight</li>
          <li>• When in doubt, measure twice!</li>
        </ul>
      </div>
    </div>
  );
}
