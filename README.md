# Chikankari eCommerce Platform

A full-stack eCommerce website for selling authentic Chikankari products from Lucknow, India. Built with React, TypeScript, Supabase, and Tailwind CSS.

## Features

### Customer Features
- Browse products by category (Men, Women, Kids)
- Search and filter products by price, size, and availability
- View detailed product information with multiple images
- Select size before adding to cart
- Shopping cart with quantity management
- Secure checkout with shipping address collection
- Cash on Delivery (COD) payment option
- Order tracking with status updates (Placed, Packed, Shipped, Delivered)
- User authentication via mobile OTP
- User profile management
- Order history

### Admin Features
- Secure admin panel access
- Dashboard with business statistics
- Product management (Add, Edit, Delete)
- Upload product images
- Manage sizes and stock levels
- Order management
- Update order status for tracking
- View customer details and shipping addresses

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Phone OTP
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Database Schema

The application uses the following main tables:

- **categories**: Product categories (Men, Women, Kids)
- **products**: Product information including pricing, images, sizes, and stock
- **user_profiles**: User information and preferences
- **cart_items**: Shopping cart items for each user
- **orders**: Order information including status and payment details
- **order_items**: Individual items in each order

## Authentication

Users authenticate using their mobile phone number:
1. Enter 10-digit mobile number
2. Receive OTP via SMS
3. Enter OTP to verify
4. Complete profile setup (first-time users)

**Note**: In development, Supabase may not send actual SMS. You can check the Supabase dashboard for the OTP code.

## Admin Access

To create an admin user:

1. Sign up normally using phone OTP
2. Get your user ID from the browser console or Supabase dashboard
3. Run this SQL in Supabase SQL Editor:

```sql
UPDATE user_profiles
SET is_admin = true
WHERE phone_number = '+91XXXXXXXXXX';
```

4. Access admin panel at `/admin`

## Sample Products

The database includes 12 sample products:
- 4 Men's products (Kurtas, Pathani suits, Sherwanis)
- 4 Women's products (Kurtis, Suits, Anarkalis, Dresses)
- 4 Kids products (Kurtas, Frocks, Pathani suits, Ethnic sets)

## Payment Integration

Currently supports:
- **Cash on Delivery (COD)**: Fully functional
- **Paytm Payment Gateway**: UI ready (requires Paytm merchant account setup)

## Order Flow

1. Customer adds products to cart
2. Proceeds to checkout
3. Enters shipping address
4. Selects payment method (COD/Paytm)
5. Places order
6. Order appears in admin panel
7. Admin updates order status
8. Customer can track order progress

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   └── layout/        # Header and Footer
├── contexts/          # React contexts (Auth)
├── lib/              # Supabase client
├── pages/            # Page components
│   ├── admin/        # Admin panel pages
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Home.tsx
│   ├── Orders.tsx
│   ├── ProductDetail.tsx
│   ├── Products.tsx
│   └── Profile.tsx
└── App.tsx           # Main app with routing
```

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access their own cart and orders
- Admin-only access for product and order management
- Secure authentication with OTP verification
- Protected routes for authenticated users

## Future Enhancements

- Paytm payment gateway integration
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Advanced filtering options
- Multiple shipping addresses
- Order cancellation
- Return and refund management

## Support

For any issues or questions, please contact support@chikankari.com

## License

This project is private and proprietary.
# website
