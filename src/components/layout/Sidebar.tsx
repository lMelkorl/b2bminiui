import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, X } from 'lucide-react';
import clsx from 'clsx';
import { useSidebar } from '../../lib/sidebar-context';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Ürünler', href: '/products', icon: Package },
  { name: 'Siparişler', href: '/orders', icon: ShoppingCart },
  { name: 'Ayarlar', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-16 left-0 z-40 w-64 flex flex-col bottom-0 transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full glass-strong border-r border-gray-200/30 dark:border-gray-700/30 overflow-y-auto">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200/30 dark:border-gray-700/30">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menü</h2>
            <button
              onClick={close}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1.5">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              onClick={() => close()}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-gray-800 to-gray-900 dark:from-blue-600/90 dark:to-blue-700/90 text-white shadow-md shadow-gray-900/20 dark:shadow-blue-600/20 border-l-4 border-l-gray-900 dark:border-l-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:translate-x-0.5 border-l-4 border-l-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    size={19} 
                    className={clsx(
                      'transition-all duration-200 flex-shrink-0',
                      isActive ? 'drop-shadow scale-105' : 'group-hover:scale-110'
                    )} 
                  />
                  <span className="transition-all duration-200">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
    </>
  );
}
