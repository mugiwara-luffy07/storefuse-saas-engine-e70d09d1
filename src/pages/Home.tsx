import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTenantStore } from '@/store/tenantStore';
import { ProductCard } from '@/components/ProductCard';
import { getProductsByTenant } from '@/data/mockProducts';

export default function Home() {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();

  if (!config || !tenant) return null;

  const products = getProductsByTenant(tenant);
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-slide-up">
            {config.tagline}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 animate-slide-up stagger-1">
            {config.brandName}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up stagger-2">
            {config.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
            <Link to={`/${tenant}/products`} className="btn-tenant">
              Shop Collection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link to={`/${tenant}/products?category=new-arrivals`} className="btn-tenant-outline">
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {config.categories.map((category, index) => (
              <Link
                key={category}
                to={`/${tenant}/products?category=${category.toLowerCase().replace(' ', '-')}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute inset-0 flex items-end p-4 md:p-6">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-background font-medium text-sm md:text-base">
                      {category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-background opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Featured Products
            </h2>
            <Link
              to={`/${tenant}/products`}
              className="text-sm font-medium flex items-center gap-2 hover:gap-3 transition-all"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              About {config.brandName}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {config.description} We believe in creating timeless pieces that transcend
              seasonal trends. Our commitment to quality craftsmanship and sustainable
              practices sets us apart in the fashion industry.
            </p>
            <Link
              to={`/${tenant}/products`}
              className="btn-tenant-outline"
            >
              Discover More
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-tenant-primary text-tenant-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Join Our Community
          </h2>
          <p className="opacity-80 mb-8 max-w-md mx-auto">
            Subscribe for exclusive access to new arrivals, special offers, and style inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md bg-tenant-secondary text-tenant-primary placeholder:text-tenant-primary/50 focus:outline-none focus:ring-2 focus:ring-tenant-secondary/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-tenant-secondary text-tenant-primary rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
