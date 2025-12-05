import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Palette, Shield, Zap, Store, Users } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Multi-Tenant Architecture',
    description: 'One codebase, infinite brands. Each tenant gets their own storefront with isolated data.',
  },
  {
    icon: Palette,
    title: 'Dynamic Theming',
    description: 'Brands customize colors, logos, and content. Theme changes apply instantly.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with React and modern tooling for optimal performance and UX.',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description: 'Tenant isolation ensures data security. Role-based access for admins.',
  },
];

const demoTenants = [
  {
    id: 'mizuki',
    name: 'Mizuki',
    tagline: 'Minimalist Elegance',
    color: '#1a1a1a',
  },
  {
    id: 'pinkthreads',
    name: 'Pink Threads',
    tagline: 'Bold & Beautiful',
    color: '#db2777',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">StoreFuse</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/superadmin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Super Admin
            </Link>
            <Link
              to="/mizuki"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              View Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Zap className="w-4 h-4" />
              Multi-Tenant E-Commerce Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight animate-slide-up">
              One Platform,
              <br />
              <span className="text-muted-foreground">Infinite Brands</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-slide-up stagger-1">
              StoreFuse is a production-ready multi-tenant SaaS e-commerce template.
              Launch multiple clothing brands from a single, powerful codebase.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
              <Link
                to="/mizuki"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Explore Demo Store
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/superadmin"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md border border-border font-medium hover:bg-muted transition-colors"
              >
                <Shield className="w-4 h-4" />
                Super Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Tenants */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Demo Brands</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our sample tenants to see how each brand gets its own unique storefront
              with dynamic theming.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {demoTenants.map((tenant, index) => (
              <Link
                key={tenant.id}
                to={`/${tenant.id}`}
                className="group bg-card rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: tenant.color }}
                  >
                    {tenant.name.charAt(0)}
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{tenant.name}</h3>
                <p className="text-muted-foreground mb-4">{tenant.tagline}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 rounded bg-muted text-muted-foreground">
                    /{tenant.id}
                  </span>
                  <span className="text-muted-foreground">→ Store</span>
                  <span className="px-2 py-1 rounded bg-muted text-muted-foreground">
                    /{tenant.id}/admin
                  </span>
                  <span className="text-muted-foreground">→ Admin</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Built for Scale</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run a multi-brand e-commerce business.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to Launch Your Brands?
          </h2>
          <p className="opacity-80 mb-8 max-w-2xl mx-auto">
            StoreFuse provides everything you need: customer storefronts, admin dashboards,
            and super admin controls. All in one package.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/mizuki"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-primary-foreground text-primary font-medium hover:opacity-90 transition-opacity"
            >
              Try the Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/superadmin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md border border-primary-foreground/30 font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Access Super Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Store className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-medium">StoreFuse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Multi-tenant E-Commerce SaaS Template
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="/superadmin" className="hover:text-foreground transition-colors">
                Super Admin
              </Link>
              <span>•</span>
              <Link to="/mizuki" className="hover:text-foreground transition-colors">
                Demo: Mizuki
              </Link>
              <span>•</span>
              <Link to="/pinkthreads" className="hover:text-foreground transition-colors">
                Demo: Pink Threads
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
