import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Phone, Mail, FileText } from 'lucide-react';
import Button from '../components/ui/Button';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: string;
  notes: string;
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/orders/${id}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Sipariş bulunamadı');
      }
    } catch (err) {
      setError('Sipariş yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Teslim Edildi':
        return 'bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30';
      case 'Kargoda':
        return 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/30';
      case 'Hazırlanıyor':
        return 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/30';
      case 'Beklemede':
        return 'bg-orange-500/20 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-500/30';
      case 'İptal Edildi':
        return 'bg-red-500/20 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-gray-800 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Button
          onClick={() => navigate('/orders')}
          variant="ghost"
          size="sm"
          className="text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Siparişlere Dön
        </Button>
        <div className="glass-card rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            onClick={() => navigate('/orders')}
            variant="ghost"
            size="sm"
            className="text-gray-700 dark:text-gray-300 mb-4 gap-2 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Siparişlere Dön
          </Button>
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Sipariş Detayı
            </h1>
            <p className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-300">
              Sipariş No: <span className="font-bold text-gray-900 dark:text-white">{order.id}</span>
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="glass-card rounded-2xl">
            <div className="px-6 py-4 border-b border-burgundy-200/20 dark:border-burgundy-800/20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-burgundy-500 to-wine-600 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                Sipariş Ürünleri
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-4 border-b border-burgundy-200/20 dark:border-burgundy-800/20 last:border-0"
                  >
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Adet: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(item.price)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Birim Fiyat
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-burgundy-200/20 dark:border-burgundy-800/20">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-gray-900 dark:text-white">Toplam Tutar</span>
                  <span className="bg-gradient-to-r from-burgundy-600 to-wine-600 bg-clip-text text-transparent">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="glass-card rounded-2xl">
            <div className="px-6 py-4 border-b border-burgundy-200/20 dark:border-burgundy-800/20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Teslimat Adresi
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="glass-card rounded-2xl">
              <div className="px-6 py-4 border-b border-burgundy-200/20 dark:border-burgundy-800/20">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Notlar
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="glass-card rounded-2xl">
            <div className="px-6 py-4 border-b border-burgundy-200/20 dark:border-burgundy-800/20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Müşteri Bilgileri
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Ad Soyad
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.customerName}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </p>
                  <p className="text-gray-900 dark:text-white break-all">
                    {order.customerEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Telefon
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {order.customerPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="glass-card rounded-2xl">
            <div className="px-6 py-4 border-b border-burgundy-200/20 dark:border-burgundy-800/20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Sipariş Bilgileri
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Sipariş Tarihi
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Sipariş Durumu
                </p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
