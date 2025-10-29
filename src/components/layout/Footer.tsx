import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto glass-strong border-t-2 border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Mücevherat B2B
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Modern ve güvenli mücevherat yönetim platformu
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Ürünler
                </a>
              </li>
              <li>
                <a
                  href="/orders"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Siparişler
                </a>
              </li>
              <li>
                <a
                  href="/settings"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Ayarlar
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Destek
            </h4>
            <ul className="space-y-2 mb-4">
              <li>
                <a
                  href="mailto:support@mucevheratb2b.com"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  support@mucevheratb2b.com
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  API Dokümantasyonu
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mb-3">
              <a
                href="https://github.com/lmelkorl"
                target="_blank"
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/lmelkorl"
                target="_blank"
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/lmelkorl"
                target="_blank"
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              v1.0.0 • React 19 + TypeScript
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200/30 dark:border-gray-700/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 opacity-70">
              © {currentYear} Mücevherat B2B. Made with{' '}
              <Heart className="w-4 h-4 text-red-500 fill-current opacity-80" />{' '}
              in Turkey
            </p>
            <div className="flex gap-6 text-xs text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Kullanım Koşulları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
