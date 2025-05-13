
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    const username = localStorage.getItem('admin_username');
    
    if (!isAdminLoggedIn) {
      navigate('/admin');
      return;
    }
    
    setAdminUsername(username);
  }, [navigate]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const navItems = [
    { 
      icon: <LayoutDashboard size={isMobile ? 18 : 20} />, 
      label: 'Dashboard', 
      path: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard'
    },
    { 
      icon: <Clock size={isMobile ? 18 : 20} />, 
      label: 'Pending', 
      path: '/admin/pending',
      active: location.pathname === '/admin/pending'
    },
    { 
      icon: <CheckCircle size={isMobile ? 18 : 20} />, 
      label: 'Approved', 
      path: '/admin/approved',
      active: location.pathname === '/admin/approved'
    },
    { 
      icon: <XCircle size={isMobile ? 18 : 20} />, 
      label: 'Rejected', 
      path: '/admin/rejected',
      active: location.pathname === '/admin/rejected'
    },
  ];

  const isDetailPage = location.pathname.includes('/admin/applications/');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden bg-zinc-900 p-3 flex items-center justify-between fixed top-0 left-0 w-full z-10">
        <div className="flex items-center">
          {isDetailPage ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin/pending')} 
              className="mr-2 text-zinc-300 hover:text-white"
            >
              <ChevronLeft size={20} />
            </Button>
          ) : null}
          <span className="font-bold text-lg">KYC Admin</span>
        </div>
        {!isDetailPage && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        )}
      </div>

      {/* Sidebar (mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 p-4 fixed top-14 left-0 w-full z-10 shadow-lg">
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  item.active 
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
            <Separator className="my-2 bg-zinc-800" />
            <div className="px-3 py-2 text-xs text-zinc-500">
              Logged in as {adminUsername || 'Admin'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center justify-start gap-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </Button>
          </div>
        </div>
      )}

      {/* Sidebar (desktop) */}
      <div className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen fixed left-0">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-1">KYC Admin Panel</h1>
          <p className="text-sm text-zinc-400">
            Logged in as {adminUsername || 'Admin'}
          </p>
        </div>
        <Separator className="bg-zinc-800" />
        
        <div className="flex-1 p-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                  item.active 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-zinc-800">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-zinc-950 md:ml-64 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
