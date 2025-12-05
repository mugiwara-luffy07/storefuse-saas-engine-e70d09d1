import { create } from 'zustand';
import { TenantConfig, loadTenantConfig, applyTenantTheme } from '@/config/loadTenant';

interface TenantState {
  config: TenantConfig | null;
  isLoading: boolean;
  error: string | null;
  loadTenant: (tenantId: string) => Promise<void>;
}

export const useTenantStore = create<TenantState>((set) => ({
  config: null,
  isLoading: false,
  error: null,

  loadTenant: async (tenantId: string) => {
    set({ isLoading: true, error: null });
    try {
      const config = await loadTenantConfig(tenantId);
      applyTenantTheme(config);
      set({ config, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load tenant configuration', isLoading: false });
    }
  },
}));
