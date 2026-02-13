import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Chikankari
                </div>
              </Link>

              <nav className="hidden md:flex space-x-6">
                <Link to="/category/men" className="text-gray-700 hover:text-amber-600 font-medium transition">
                  Men
                </Link>
                <Link to="/category/women" className="text-gray-700 hover:text-amber-600 font-medium transition">
                  Women
                </Link>
                <Link to="/category/kids" className="text-gray-700 hover:text-amber-600 font-medium transition">
                  Kids
                </Link>
              </nav>
            </div>

            <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Chikankari products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </form>

            <div className="flex items-center space-x-4">
              <Link to="/cart" className="text-gray-700 hover:text-amber-600 relative">
                <ShoppingCart className="w-6 h-6" />
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-amber-600"
                  >
                    <User className="w-6 h-6" />
                    <span className="hidden md:block text-sm font-medium">
                      {profile?.full_name || 'Account'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      {profile?.is_admin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-amber-600 font-medium"
                        >
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-red-600 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:block px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-gray-700"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {showMobileMenu && (
            <div className="md:hidden py-4 border-t">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </form>
              <nav className="space-y-2">
                <Link
                  to="/category/men"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-2 text-gray-700 hover:text-amber-600 font-medium"
                >
                  Men
                </Link>
                <Link
                  to="/category/women"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-2 text-gray-700 hover:text-amber-600 font-medium"
                >
                  Women
                </Link>
                <Link
                  to="/category/kids"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-2 text-gray-700 hover:text-amber-600 font-medium"
                >
                  Kids
                </Link>
                {!user && (
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowAuthModal(true);
                    }}
                    className="block w-full text-left py-2 text-amber-600 font-medium"
                  >
                    Sign In
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
