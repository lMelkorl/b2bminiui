import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Breadcrumb from '../ui/Breadcrumb';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full overflow-x-hidden">
            <Breadcrumb />
            <Outlet />
          </div>
          
          {/* Footer inside main to avoid sidebar overlap */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
