import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface TenantFormData {
  tenantId: string;
  brandName: string;
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  banner: string;
}

const defaultFormData: TenantFormData = {
  tenantId: '',
  brandName: '',
  tagline: '',
  description: '',
  primaryColor: '#1a1a1a',
  secondaryColor: '#fafafa',
  accentColor: '#2d2d2d',
  logo: '',
  banner: '',
};

export default function CreateTenant() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TenantFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate tenant ID (slug format)
    if (!/^[a-z0-9-]+$/.test(formData.tenantId)) {
      toast.error('Tenant ID must be lowercase letters, numbers, and hyphens only');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Tenant created successfully!');
    navigate('/superadmin/tenants');
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-card rounded-xl border border-border p-8">
        <h1 className="text-2xl font-semibold mb-2">Create New Tenant</h1>
        <p className="text-muted-foreground mb-8">
          Set up a new brand tenant for the StoreFuse platform
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
              Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Tenant ID (slug)
                </label>
                <input
                  type="text"
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleChange}
                  required
                  placeholder="my-brand"
                  className="input-styled"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used in URLs: /my-brand
                </p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                  placeholder="My Brand"
                  className="input-styled"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Your brand's tagline"
                className="input-styled"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of the brand"
                className="input-styled resize-none"
              />
            </div>
          </div>

          {/* Branding */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
              Branding
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="w-12 h-10 rounded-md border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData({ ...formData, primaryColor: e.target.value })
                    }
                    className="input-styled flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="w-12 h-10 rounded-md border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) =>
                      setFormData({ ...formData, secondaryColor: e.target.value })
                    }
                    className="input-styled flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Accent Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    className="w-12 h-10 rounded-md border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) =>
                      setFormData({ ...formData, accentColor: e.target.value })
                    }
                    className="input-styled flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assets */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
              Assets
            </h2>
            <div>
              <label className="text-sm font-medium block mb-2">Logo URL</label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.svg"
                className="input-styled"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Banner Image URL</label>
              <input
                type="url"
                name="banner"
                value={formData.banner}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="input-styled"
              />
            </div>
          </div>

          {/* Preview */}
          {formData.brandName && (
            <div className="pt-4 border-t border-border">
              <h2 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Preview
              </h2>
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    {formData.brandName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{formData.brandName}</h3>
                    <p className="text-sm text-muted-foreground">
                      /{formData.tenantId || 'tenant-id'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div
                    className="w-16 h-8 rounded"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <div
                    className="w-16 h-8 rounded border border-border"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                  <div
                    className="w-16 h-8 rounded"
                    style={{ backgroundColor: formData.accentColor }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 rounded-md border border-border font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mx-auto" />
              ) : (
                'Create Tenant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
