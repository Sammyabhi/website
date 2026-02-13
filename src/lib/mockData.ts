// Mock data storage for demo mode
const STORAGE_PREFIX = 'chikankari_demo_';

export const mockStorage = {
  // Cart items
  getCart: (): any[] => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}cart`);
    return data ? JSON.parse(data) : [];
  },
  
  setCart: (items: any[]) => {
    localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(items));
  },
  
  clearCart: () => {
    localStorage.removeItem(`${STORAGE_PREFIX}cart`);
  },

  // Orders
  getOrders: (): any[] => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}orders`);
    return data ? JSON.parse(data) : [];
  },
  
  addOrder: (order: any) => {
    const orders = mockStorage.getOrders();
    orders.unshift(order);
    localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
  },

  updateOrderStatus: (orderId: string, status: string) => {
    const orders = mockStorage.getOrders();
    const index = orders.findIndex((o: any) => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      orders[index].updated_at = new Date().toISOString();
      localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
    }
  },
};

export const isDemoUser = (userId: string | undefined): boolean => {
  return userId === 'demo-user-7268991581';
};
