import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { 
  Gem, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  ChevronDown,
  Search,
  Bell,
  Menu as MenuIcon
} from 'lucide-react';
import Button from '../ui/Button';
import { useSidebar } from '../../lib/sidebar-context';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search logic here - for now just navigate to orders if it's an order ID
      if (searchQuery.startsWith('ORD-')) {
        navigate(`/orders/${searchQuery}`);
      }
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  const notifications = [
    { id: 1, text: 'Yeni sipariş: ORD-2024-001', time: '5 dk önce', unread: true },
    { id: 2, text: 'Düşük stok uyarısı: Altın Kolye', time: '1 saat önce', unread: true },
    { id: 3, text: 'Sipariş teslim edildi: ORD-2024-002', time: '2 saat önce', unread: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-gray-200/20 dark:border-gray-700/30">
      <div className="px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Button
              onClick={toggle}
              variant="ghost"
              size="sm"
              className="lg:hidden rounded-lg w-10 h-10 p-0"
            >
              <MenuIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg ring-2 ring-gray-200/50 dark:ring-blue-500/20">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex flex-col justify-center">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Mücevherat B2B
              </h1>
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-tight">
                Yönetim Paneli
              </p>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Ara... (ORD-2024-001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-card border border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-blue-600 transition-all"
              />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              variant="ghost"
              size="sm"
              className="md:hidden rounded-full w-10 h-10 p-0"
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>

            {/* Notifications */}
            <Menu as="div" className="relative">
              <MenuButton className="relative rounded-full w-10 h-10 p-0 glass-card hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                )}
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 sm:right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] origin-top-right glass-strong rounded-xl shadow-xl py-2 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Bildirimler</p>
                  </div>
                  {notifications.map((notification) => (
                    <MenuItem key={notification.id}>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } w-full px-4 py-3 text-left transition-colors ${
                            notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {notification.text}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Transition>
            </Menu>

            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-blue-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </Button>

            {/* User Menu */}
            {user && (
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass-card hover:shadow-md hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-md ring-2 ring-gray-200/30 dark:ring-blue-500/20">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden md:flex flex-col justify-center">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                      {user.name}
                    </p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-tight mt-0.5">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ui-open:rotate-180" />
                </MenuButton>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right glass-strong rounded-xl shadow-xl py-1 focus:outline-none">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/settings')}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          <Settings className="w-4 h-4" />
                          Ayarlar
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-red-50 dark:bg-red-900/30' : ''
                          } group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400`}
                        >
                          <LogOut className="w-4 h-4" />
                          Çıkış Yap
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 glass-strong border-b border-gray-200/20 dark:border-gray-700/30 p-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Sipariş ara (örn: ORD-2024-001)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2 rounded-lg glass-card border border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-blue-600 transition-all"
            />
          </form>
        </div>
      )}
    </nav>
  );
}
