import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { Search, Plus, Edit, Trash2, X, Package, Grid3x3, List, SlidersHorizontal } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  material: string;
  weight: string;
  description: string;
  image: string;
}

interface ProductForm {
  name: string;
  category: string;
  price: number;
  stock: number;
  material: string;
  weight: string;
  description: string;
  image: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [weightRange, setWeightRange] = useState({ min: '', max: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'Tümü') params.append('category', selectedCategory);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      if (weightRange.min) params.append('minWeight', weightRange.min);
      if (weightRange.max) params.append('maxWeight', weightRange.max);

      console.log('[Products] Fetching with:', { searchQuery, selectedCategory, priceRange, weightRange, params: params.toString() });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      console.log('[Products] Received:', data.data?.length, 'products');

      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    reset({
      name: '',
      category: 'Kolye',
      price: 0,
      stock: 0,
      material: '',
      weight: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      material: product.material,
      weight: product.weight,
      description: product.description,
      image: product.image,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        closeModal();
        fetchProducts();
      }
    } catch (error) {
      console.error('Ürün kaydedilemedi:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Ürün silinemedi:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Ürünler</h1>
          <p className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-300">
            Mücevherat ürünlerinizi yönetin ve düzenleyin
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 glass-card rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-gray-800 dark:bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-gray-800 dark:bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button
            onClick={openAddModal}
            variant="primary"
            size="md"
            className="w-full md:w-auto"
          >
            <Plus className="w-5 h-5" />
            Yeni Ürün Ekle
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl md:rounded-2xl p-3 md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                console.log('[Products] Category changed to:', e.target.value);
                setSelectedCategory(e.target.value);
              }}
              className="md:w-48"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>

            {/* Advanced Filters Toggle */}
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="md:w-auto"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Gelişmiş Filtreler
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="space-y-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Fiyat Aralığı (₺)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                    />
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ağırlık Aralığı (gr)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={weightRange.min}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setWeightRange({ ...weightRange, min: e.target.value })
                      }
                    />
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={weightRange.max}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setWeightRange({ ...weightRange, max: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setPriceRange({ min: '', max: '' });
                    setWeightRange({ min: '', max: '' });
                  }}
                >
                  Temizle
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => fetchProducts()}
                >
                  Filtrele
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total Count */}
      {!isLoading && products.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Toplam <span className="text-lg font-bold text-gray-900 dark:text-white">{products.length}</span> ürün listeleniyor
          </p>
        </div>
      )}

      {/* Products View */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-gray-800 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Ürün bulunamadı
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="glass-card rounded-2xl overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {product.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.material}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">
                      {product.weight}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Stok</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {product.stock} adet
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Fiyat</p>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => openEditModal(product)}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4" />
                      Düzenle
                    </Button>
                    <Button
                      onClick={() => deleteProduct(product.id)}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl md:rounded-2xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[800px] w-full">
            <TableHeader>
              <TableRow className="bg-transparent hover:bg-transparent">
                <TableHead>ÜRÜN</TableHead>
                <TableHead>KATEGORİ</TableHead>
                <TableHead>MALZEME</TableHead>
                <TableHead>AĞIRLIK</TableHead>
                <TableHead>STOK</TableHead>
                <TableHead>FİYAT</TableHead>
                <TableHead>İŞLEMLER</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 md:w-12 md:h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-[10px] sm:text-xs md:text-sm">{product.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900 dark:text-white font-medium">{product.category}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-400">{product.material}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">{product.weight}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900 dark:text-white font-medium">{product.stock} adet</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base">
                      {formatCurrency(product.price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Button
                        onClick={() => openEditModal(product)}
                        variant="ghost"
                        size="sm"
                        className="p-1 md:p-2"
                      >
                        <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteProduct(product.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 md:p-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl glass-strong rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 glass-strong border-b border-gray-200/30 dark:border-gray-700/30 px-6 py-5 flex items-center justify-between backdrop-blur-xl">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
              </DialogTitle>
              <Button
                onClick={closeModal}
                variant="ghost"
                size="sm"
                className="rounded-full w-10 h-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register('name', { required: 'Ürün adı gereklidir' })}
                  label="Ürün Adı *"
                  error={errors.name?.message}
                />

                <Select
                  {...register('category', { required: 'Kategori gereklidir' })}
                  label="Kategori *"
                  error={errors.category?.message}
                >
                  <option value="Kolye">Kolye</option>
                  <option value="Yüzük">Yüzük</option>
                  <option value="Bileklik">Bileklik</option>
                  <option value="Küpe">Küpe</option>
                </Select>

                <Input
                  {...register('price', {
                    required: 'Fiyat gereklidir',
                    min: { value: 0, message: 'Fiyat 0\'dan büyük olmalıdır' },
                  })}
                  type="number"
                  label="Fiyat (₺) *"
                  error={errors.price?.message}
                />

                <Input
                  {...register('stock', {
                    required: 'Stok gereklidir',
                    min: { value: 0, message: 'Stok 0\'dan küçük olamaz' },
                  })}
                  type="number"
                  label="Stok *"
                  error={errors.stock?.message}
                />

                <Input
                  {...register('material', { required: 'Malzeme gereklidir' })}
                  label="Malzeme *"
                  placeholder="Örn: 14 Ayar Altın"
                  error={errors.material?.message}
                />

                <Input
                  {...register('weight', { required: 'Ağırlık gereklidir' })}
                  label="Ağırlık *"
                  placeholder="Örn: 5.2g"
                  error={errors.weight?.message}
                />
              </div>

              <Input
                {...register('description', { required: 'Açıklama gereklidir' })}
                label="Açıklama *"
                as="textarea"
                rows={3}
                error={errors.description?.message}
              />

              <Input
                {...register('image', { required: 'Resim URL gereklidir' })}
                label="Resim URL *"
                placeholder="https://..."
                error={errors.image?.message}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={closeModal}
                  variant="secondary"
                  size="md"
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="flex-1"
                >
                  {editingProduct ? 'Güncelle' : 'Ekle'}
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
