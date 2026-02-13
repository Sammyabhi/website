import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Chikankari</h3>
            <p className="text-sm mb-4">
              Authentic handcrafted Chikankari embroidery from Lucknow. Traditional elegance meets modern fashion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-500 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-amber-500 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-amber-500 transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/men" className="hover:text-amber-500 transition">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/category/women" className="hover:text-amber-500 transition">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/category/kids" className="hover:text-amber-500 transition">
                  Kids Collection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/orders" className="hover:text-amber-500 transition">
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Lucknow, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>support@chikankari.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2024 Chikankari. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
