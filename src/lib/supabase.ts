import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          image_url: string;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          category_id: string;
          price: number;
          discount_price: number | null;
          images: string[];
          sizes: Array<{ size: string; stock: number }>;
          stock_quantity: number;
          is_available: boolean;
          sku: string;
          fabric_details: string;
          created_at: string;
          updated_at: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          selected_size: string;
          created_at: string;
          updated_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
          total_amount: number;
          payment_method: 'paytm' | 'cod';
          payment_status: 'pending' | 'completed' | 'failed';
          payment_id: string | null;
          shipping_address: {
            full_name: string;
            phone: string;
            address_line1: string;
            address_line2?: string;
            city: string;
            state: string;
            pincode: string;
          };
          phone_number: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_image: string;
          quantity: number;
          size: string;
          price: number;
          created_at: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          phone_number: string;
          full_name: string;
          email: string | null;
          default_address: object;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
