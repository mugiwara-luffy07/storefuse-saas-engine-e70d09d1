import { Link, useParams } from 'react-router-dom';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  description: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { tenant } = useParams<{ tenant: string }>();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <Link
      to={`/${tenant}/products/${product.id}`}
      className="card-product group block"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded">
            -{discountPercent}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">Sold Out</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-medium text-sm mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice!.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
