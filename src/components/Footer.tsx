import { Link, useParams } from 'react-router-dom';
import { Instagram, Twitter } from 'lucide-react';
import { useTenantStore } from '@/store/tenantStore';

export function Footer() {
  const { tenant } = useParams<{ tenant: string }>();
  const { config } = useTenantStore();

  if (!config || !tenant) return null;

  return (
    <footer className="footer-tenant mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold mb-4">{config.brandName}</h3>
            <p className="text-sm opacity-80 max-w-md leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-80">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to={`/${tenant}/order`}
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Custom Order
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Fabric Collection
                </a>
              </li>
              <li>
                <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Design Gallery
                </a>
              </li>
              <li>
                <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Measurement Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-80">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Pricing Info
                </a>
              </li>
              <li>
                <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-current/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} {config.brandName}. Powered by StoreFuse.
          </p>
          <div className="flex items-center gap-4">
            {config.social.instagram && (
              <a
                href={config.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:opacity-80 transition-opacity"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {config.social.twitter && (
              <a
                href={config.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:opacity-80 transition-opacity"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
