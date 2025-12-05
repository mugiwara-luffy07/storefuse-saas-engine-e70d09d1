import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { useTenantStore } from '@/store/tenantStore';
import { ProductCard } from '@/components/ProductCard';
import { getProductsByTenant } from '@/data/mockProducts';

export default function Products() {
  const { tenant } = useParams<{ tenant: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { config } = useTenantStore();
  const [showFilters, setShowFilters] = useState(false);

  const categoryParam = searchParams.get('category');
  
  const products = tenant ? getProductsByTenant(tenant) : [];
  
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!categoryParam || categoryParam === 'all') return products;
    return products.filter(
      (p) => p.category.toLowerCase().replace(' ', '-') === categoryParam
    );
  }, [products, categoryParam]);

  const setCategory = (category: string) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category.toLowerCase().replace(' ', '-'));
    }
    setSearchParams(searchParams);
    setShowFilters(false);
  };

  if (!config || !tenant) return null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
            {categoryParam
              ? categories.find(
                  (c) => c.toLowerCase().replace(' ', '-') === categoryParam
                ) || 'All Products'
              : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium md:hidden"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategory(category)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  (category === 'All' && !categoryParam) ||
                  category.toLowerCase().replace(' ', '-') === categoryParam
                    ? 'bg-tenant-primary text-tenant-secondary'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <select className="text-sm border border-border rounded-md px-3 py-2 bg-background">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="md:hidden fixed inset-0 z-50 bg-background animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    (category === 'All' && !categoryParam) ||
                    category.toLowerCase().replace(' ', '-') === categoryParam
                      ? 'bg-tenant-primary text-tenant-secondary'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
