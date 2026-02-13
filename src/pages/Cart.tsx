import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { mockStorage, isDemoUser } from '../lib/mockData';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  selected_size: string;
  product: {
    name: string;
    price: number;
    discount_price: number | null;
    images: string[];
    stock_quantity: number;
  };
}

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    try {
      if (isDemoUser(user.id)) {
        // Use mock storage for demo user
        const mockCart = mockStorage.getCart();
        setCartItems(mockCart);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            name,
            price,
            discount_price,
            images,
            stock_quantity
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      if (data) {
        setCartItems(data as any);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(itemId);
    try {
      if (isDemoUser(user?.id)) {
        const cart = mockStorage.getCart();
        const index = cart.findIndex((item: any) => item.id === itemId);
        if (index !== -1) {
          cart[index].quantity = newQuantity;
          mockStorage.setCart(cart);
          setCartItems([...cart]);
        }
        setUpdating(null);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', itemId);

      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      if (isDemoUser(user?.id)) {
        const cart = mockStorage.getCart().filter((item: any) => item.id !== itemId);
        mockStorage.setCart(cart);
        setCartItems(cart);
        setUpdating(null);
        return;
      }

      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);

      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getItemPrice = (item: CartItem) => {
    return item.product.discount_price || item.product.price;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + getItemPrice(item) * item.quantity;
    }, 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-600 mb-6">Sign in to view your cart</p>
          <Link
            to="/"
            className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some beautiful Chikankari products to get started</p>
          <Link
            to="/products"
            className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4"
              >
                <Link
                  to={`/product/${item.product_id}`}
                  className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden"
                >
                  <img
                    src={item.product.images[0] || 'https://images.pexels.com/photos/1895943/pexels-photo-1895943.jpeg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product_id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-amber-600 block truncate"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-600">Size: {item.selected_size}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ₹{getItemPrice(item).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={updating === item.id || item.quantity <= 1}
                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={updating === item.id}
                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  disabled={updating === item.id}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">
                    {calculateTotal() >= 999 ? 'FREE' : '₹50'}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>
                    ₹{(calculateTotal() + (calculateTotal() >= 999 ? 0 : 50)).toLocaleString()}
                  </span>
                </div>
              </div>

              {calculateTotal() < 999 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-amber-800">
                  Add items worth ₹{(999 - calculateTotal()).toLocaleString()} more to get free shipping!
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/products"
                className="block text-center text-amber-600 hover:text-amber-700 font-medium mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
