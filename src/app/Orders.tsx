import { useEffect, useState } from 'react';
import { Eye, ShoppingCart, SlidersHorizontal, Copy, Check, X, Package, Mail, FileText, User } from 'lucide-react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'orderDate' | 'totalAmount' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const statusOptions = [
    'Tümü',
    'Beklemede',
    'Hazırlanıyor',
    'Kargoda',
    'Teslim Edildi',
  ];

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'Tümü') {
        params.append('status', statusFilter);
      }

      console.log('[Orders] Fetching with:', { statusFilter, params: params.toString() });

      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();

      console.log('[Orders] Received:', data.data?.length, 'orders');

      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Siparişler yüklenemedi:', error);
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

  const copyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleSort = (field: 'orderDate' | 'totalAmount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = sortField === 'orderDate' ? new Date(a.orderDate).getTime() : a.totalAmount;
    const bValue = sortField === 'orderDate' ? new Date(b.orderDate).getTime() : b.totalAmount;
    
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Teslim Edildi':
        return <Check className="w-4 h-4" />;
      case 'Kargoda':
        return <Package className="w-4 h-4" />;
      case 'Hazırlanıyor':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
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

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="space-y-1 md:space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Siparişler</h1>
        <p className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-300">
          Müşteri siparişlerini görüntüleyin ve yönetin
        </p>
      </div>

      {/* Filter */}
      <div className="glass-card rounded-xl md:rounded-2xl p-3 md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((status) => (
              <Button
                key={status}
                onClick={() => {
                  console.log('[Orders] Status filter changed to:', status);
                  setStatusFilter(status);
                }}
                variant={statusFilter === status ? 'primary' : 'secondary'}
                size="sm"
              >
                {status}
              </Button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Gelişmiş
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="space-y-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  placeholder="Müşteri ara..."
                  value={customerSearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerSearch(e.target.value)}
                  label="Müşteri"
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tarih Aralığı
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDateRange({ ...dateRange, start: e.target.value })
                      }
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDateRange({ ...dateRange, end: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tutar Aralığı (₺)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={amountRange.min}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAmountRange({ ...amountRange, min: e.target.value })
                      }
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={amountRange.max}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAmountRange({ ...amountRange, max: e.target.value })
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
                    setCustomerSearch('');
                    setDateRange({ start: '', end: '' });
                    setAmountRange({ min: '', max: '' });
                  }}
                >
                  Temizle
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => fetchOrders()}
                >
                  Filtrele
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total Count */}
      {!isLoading && sortedOrders.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Toplam <span className="text-lg font-bold text-gray-900 dark:text-white">{sortedOrders.length}</span> sipariş listeleniyor
          </p>
        </div>
      )}

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-gray-800 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Sipariş bulunamadı
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-xl md:rounded-2xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[900px] w-full">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent">
                  <TableHead>SİPARİŞ NO</TableHead>
                  <TableHead>MÜŞTERİ</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('orderDate')}
                      className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      TARİH
                      {sortField === 'orderDate' && (
                        <span className="text-blue-600 dark:text-blue-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </TableHead>
                  <TableHead>ÜRÜN SAYISI</TableHead>
                  <TableHead>DURUM</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('totalAmount')}
                      className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      TUTAR
                      {sortField === 'totalAmount' && (
                        <span className="text-blue-600 dark:text-blue-400">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </TableHead>
                  <TableHead>İŞLEM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow 
                    key={order.id}
                    className={`relative border-l-4 ${
                      order.status === 'Teslim Edildi' ? 'border-l-emerald-500' :
                      order.status === 'Kargoda' ? 'border-l-blue-500' :
                      order.status === 'Hazırlanıyor' ? 'border-l-amber-500' : 'border-l-orange-500'
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-1 md:gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-[10px] sm:text-xs md:text-sm">{order.id}</span>
                        <button
                          onClick={() => copyOrderId(order.id)}
                          className="p-0.5 md:p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        >
                          {copiedOrderId === order.id ? (
                            <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-[10px] sm:text-xs md:text-sm">{order.customerName}</div>
                        <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                          {order.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 dark:text-gray-400 text-[9px] sm:text-[10px] md:text-xs">
                        {formatDate(order.orderDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white font-medium text-[9px] sm:text-[10px] md:text-xs">{order.items.length} ürün</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-md sm:rounded-lg md:rounded-xl text-[8px] sm:text-[9px] md:text-xs font-bold whitespace-nowrap ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-gray-900 dark:text-white text-[9px] sm:text-[10px] md:text-xs lg:text-sm">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="p-1 md:p-2"
                      >
                        <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="hidden md:inline ml-1">Detay</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-4xl glass-strong rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 glass-strong border-b border-gray-200/30 dark:border-gray-700/30 px-6 py-5 flex items-center justify-between backdrop-blur-xl">
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sipariş Detayı
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sipariş No: <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.id}</span>
                    </p>
                    <button
                      onClick={() => copyOrderId(selectedOrder.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    >
                      {copiedOrderId === selectedOrder.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                  <Button
                    onClick={() => setSelectedOrder(null)}
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-10 h-10 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Müşteri Bilgileri
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ad Soyad</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        E-posta
                      </p>
                      <p className="text-base text-gray-900 dark:text-white mt-1">{selectedOrder.customerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sipariş Bilgileri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sipariş Tarihi</p>
                      <p className="text-base text-gray-900 dark:text-white mt-1">{formatDate(selectedOrder.orderDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ürün Sayısı</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">{selectedOrder.items.length} ürün</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Toplam Tutar</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(selectedOrder.totalAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Sipariş Ürünleri
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.productName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Adet: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
