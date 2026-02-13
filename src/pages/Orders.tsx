import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, Box, Truck, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { mockStorage, isDemoUser } from '../lib/mockData';

interface Order {
  id: string;
  order_number: string;
  status: 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  order_items: Array<{
    product_name: string;
    product_image: string;
    quantity: number;
    size: string;
    price: number;
  }>;
}

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      navigate('/');
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      if (isDemoUser(user.id)) {
        const mockOrders = mockStorage.getOrders();
        setOrders(mockOrders);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_name,
            product_image,
            quantity,
            size,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data as any);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'packed':
        return <Box className="w-5 h-5 text-amber-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-orange-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-700';
      case 'packed':
        return 'bg-amber-100 text-amber-700';
      case 'shipped':
        return 'bg-orange-100 text-orange-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <Link
            to="/products"
            className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{order.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.product_image || 'https://images.pexels.com/photos/1895943/pexels-photo-1895943.jpeg'}
                        alt={item.product_name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.product_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Qty: {item.quantity} | ₹
                          {item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Payment: <span className="font-medium text-gray-900">
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paytm'}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      {order.status === 'delivered' && (
                        <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                          Rate & Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-between">
                      {['placed', 'packed', 'shipped', 'delivered'].map((step, index) => (
                        <div key={step} className="text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                              ['placed', 'packed', 'shipped', 'delivered'].indexOf(order.status) >=
                              index
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {getStatusIcon(step)}
                          </div>
                          <p className="mt-2 text-xs text-gray-600 capitalize">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
