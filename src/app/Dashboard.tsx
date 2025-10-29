import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ShoppingCart, Users, AlertCircle, ArrowRight } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Button from '../components/ui/Button';

interface Summary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockProducts: number;
}

interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, ordersRes] = await Promise.all([
          fetch('/api/summary'),
          fetch('/api/orders?limit=5'),
        ]);

        const summaryData = await summaryRes.json();
        const ordersData = await ordersRes.json();

        if (summaryData.success) setSummary(summaryData.data);
        if (ordersData.success) setRecentOrders(ordersData.data);
      } catch (error) {
        console.error('Dashboard verisi yüklenemedi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-1 md:space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-300">
          Mücevherat B2B yönetim paneline hoş geldiniz
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="glass-card rounded-xl md:rounded-2xl p-3 md:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-green-200/30 dark:border-green-500/20 bg-gradient-to-br from-green-50/30 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/20">
          <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:gap-0 md:mb-4">
            <div className="flex-1 w-full">
              <p className="text-[10px] md:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1 md:mb-3">
                Toplam Gelir
              </p>
              <p className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                ₺{summary?.totalRevenue.toLocaleString('tr-TR')}
              </p>
            </div>
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/40 transition-all duration-300 ring-2 ring-green-200/50 dark:ring-green-500/30 flex-shrink-0">
              <DollarSign className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl md:rounded-2xl p-3 md:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-blue-200/30 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/20">
          <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:gap-0 md:mb-4">
            <div className="flex-1 w-full">
              <p className="text-[10px] md:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1 md:mb-3">
                Toplam Sipariş
              </p>
              <p className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                {summary?.totalOrders}
              </p>
            </div>
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300 ring-2 ring-blue-200/50 dark:ring-blue-500/30 flex-shrink-0">
              <ShoppingCart className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl md:rounded-2xl p-3 md:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-purple-200/30 dark:border-purple-500/20 bg-gradient-to-br from-purple-50/30 to-fuchsia-50/30 dark:from-purple-950/20 dark:to-fuchsia-950/20">
          <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:gap-0 md:mb-4">
            <div className="flex-1 w-full">
              <p className="text-[10px] md:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1 md:mb-3">
                Aktif Müşteri
              </p>
              <p className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                {summary?.totalProducts}
              </p>
            </div>
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-300 ring-2 ring-purple-200/50 dark:ring-purple-500/30 flex-shrink-0">
              <Users className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl md:rounded-2xl p-3 md:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-orange-200/30 dark:border-orange-500/20 bg-gradient-to-br from-orange-50/30 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/20">
          <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:gap-0 md:mb-4">
            <div className="flex-1 w-full">
              <p className="text-[10px] md:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1 md:mb-3">
                Düşük Stok
              </p>
              <p className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                {summary?.lowStockProducts}
              </p>
            </div>
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-xl group-hover:shadow-orange-500/40 transition-all duration-300 ring-2 ring-orange-200/50 dark:ring-orange-500/30 flex-shrink-0">
              <AlertCircle className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card rounded-xl md:rounded-2xl overflow-hidden border border-gray-200/30 dark:border-gray-700/30">
        <div className="px-4 md:px-6 py-4 md:py-5 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
              Son Siparişler
            </h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-0.5 md:mt-1">
              En son gelen siparişler
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders')}
            className="gap-1 md:gap-2 hover:gap-2 md:hover:gap-3 transition-all text-xs md:text-sm"
          >
            <span className="hidden md:inline">Tümünü Gör</span>
            <span className="md:hidden">Tümü</span>
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="glass-card rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sipariş No</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-1">{order.id}</p>
                </div>
                <span
                  className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Müşteri</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.customerName}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Tarih</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Tutar</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-transparent hover:bg-transparent">
                <TableHead>SİPARİŞ NO</TableHead>
                <TableHead>MÜŞTERİ</TableHead>
                <TableHead>TARİH</TableHead>
                <TableHead>DURUM</TableHead>
                <TableHead>TUTAR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <TableCell>
                    <span className="font-bold text-gray-900 dark:text-white">{order.id}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{order.customerName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatDate(order.orderDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-gray-900 dark:text-white text-base">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
