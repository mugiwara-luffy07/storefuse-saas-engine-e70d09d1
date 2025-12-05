import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import { getProductsByTenant, Product } from '@/data/mockProducts';
import { toast } from 'sonner';

interface ProductFormData {
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  category: string;
  sizes: string[];
  stock: string;
  images: string[];
}

const defaultFormData: ProductFormData = {
  name: '',
  price: '',
  originalPrice: '',
  description: '',
  category: '',
  sizes: [],
  stock: '',
  images: [''],
};

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];

export default function AdminProducts() {
  const { tenant } = useParams<{ tenant: string }>();
  const [products, setProducts] = useState<Product[]>(
    tenant ? getProductsByTenant(tenant) : []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  if (!tenant) return null;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      description: product.description,
      category: product.category,
      sizes: product.sizes,
      stock: product.stock.toString(),
      images: product.images,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      description: formData.description,
      category: formData.category,
      sizes: formData.sizes,
      stock: parseInt(formData.stock),
      images: formData.images.filter((img) => img.trim()),
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? productData : p)));
      toast.success('Product updated');
    } else {
      setProducts([...products, productData]);
      toast.success('Product added');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Product deleted');
    }
  };

  const toggleSize = (size: string) => {
    if (formData.sizes.includes(size)) {
      setFormData({ ...formData, sizes: formData.sizes.filter((s) => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index: number) => {
    if (formData.images.length > 1) {
      setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <button onClick={openAddModal} className="btn-tenant">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="input-styled pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4 hidden md:table-cell">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4 hidden sm:table-cell">Stock</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {product.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm">{product.category}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="font-medium">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span
                      className={`text-sm ${
                        product.stock === 0
                          ? 'text-destructive'
                          : product.stock < 5
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 hover:bg-muted rounded-md transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50">
          <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-styled"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="input-styled"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Original Price (optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: e.target.value })
                    }
                    className="input-styled"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="input-styled resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="input-styled"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="input-styled"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                        formData.sizes.includes(size)
                          ? 'bg-tenant-primary text-tenant-secondary border-tenant-primary'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Images</label>
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="Image URL"
                        className="input-styled flex-1"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-sm text-tenant-primary hover:underline"
                  >
                    + Add another image
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-tenant-outline flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-tenant flex-1">
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
