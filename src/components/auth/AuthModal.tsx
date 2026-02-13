import { useState } from 'react';
import { X, Phone, User, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Demo credentials
const DEMO_PHONE = '7268991581';
const DEMO_OTP = '123456';
const DEMO_USER_ID = 'demo-user-7268991581';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const auth = useAuth();
  const [mode, setMode] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  if (!isOpen) return null;

  const handleMockSignIn = (profile: any) => {
    if (auth && typeof auth.mockSignIn === 'function') {
      auth.mockSignIn(profile);
    } else {
      console.error('mockSignIn is not available');
      // Fallback: directly save to localStorage and reload
      const mockUser = {
        id: DEMO_USER_ID,
        email: profile.email,
        phone: profile.phone_number,
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
      };
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      localStorage.setItem('mockUserProfile', JSON.stringify(profile));
      window.location.reload();
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check for demo credentials
      if (phoneNumber === DEMO_PHONE) {
        setIsDemo(true);
        setMode('otp');
        setLoading(false);
        return;
      }

      // Format phone number to international format
      const formattedPhone = phoneNumber.startsWith('+91')
        ? phoneNumber
        : `+91${phoneNumber}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setIsDemo(false);
      setMode('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Handle demo login
      if (isDemo && phoneNumber === DEMO_PHONE && otp === DEMO_OTP) {
        // Check if demo profile exists in localStorage
        const savedProfile = localStorage.getItem('mockUserProfile');
        
        if (savedProfile) {
          // Profile exists, sign in directly
          const profile = JSON.parse(savedProfile);
          handleMockSignIn(profile);
          resetAndClose();
        } else {
          // Need to create profile
          setFullName('abhishek'); // Pre-fill with demo name
          setMode('profile');
        }
        setLoading(false);
        return;
      }

      // Handle demo with wrong OTP
      if (isDemo && otp !== DEMO_OTP) {
        throw new Error('Invalid OTP. For demo, use: 123456');
      }

      // Real Supabase verification
      const formattedPhone = phoneNumber.startsWith('+91')
        ? phoneNumber
        : `+91${phoneNumber}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      if (data.user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (!profile) {
          setMode('profile');
        } else {
          resetAndClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Handle demo profile creation
      if (isDemo) {
        const formattedPhone = `+91${phoneNumber}`;
        const demoProfile = {
          id: DEMO_USER_ID,
          phone_number: formattedPhone,
          full_name: fullName,
          email: email || null,
          default_address: null,
          is_admin: true, // Give admin access for demo
        };

        handleMockSignIn(demoProfile);
        resetAndClose();
        return;
      }

      // Real Supabase profile creation
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('No user found');

      const formattedPhone = phoneNumber.startsWith('+91')
        ? phoneNumber
        : `+91${phoneNumber}`;

      const { error } = await supabase.from('user_profiles').insert({
        id: user.id,
        phone_number: formattedPhone,
        full_name: fullName,
        email: email || null,
        is_admin: false,
      });

      if (error) throw error;

      resetAndClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setMode('phone');
    setPhoneNumber('');
    setOtp('');
    setFullName('');
    setEmail('');
    setError('');
    setIsDemo(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'phone' && 'Sign In / Sign Up'}
            {mode === 'otp' && 'Verify OTP'}
            {mode === 'profile' && 'Complete Your Profile'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'phone' && 'Enter your mobile number to continue'}
            {mode === 'otp' && `Enter the OTP sent to +91${phoneNumber}`}
            {mode === 'profile' && 'Tell us a bit about yourself'}
          </p>
          {isDemo && mode === 'otp' && (
            <p className="text-amber-600 mt-2 text-sm font-medium">
              Demo Mode: Use OTP 123456
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {mode === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  +91
                </span>
                <Phone className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full pl-20 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Demo: Use 7268991581 with OTP 123456
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || phoneNumber.length !== 10}
              className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {mode === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-2xl tracking-widest"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('phone');
                setOtp('');
                setError('');
              }}
              className="w-full text-amber-600 hover:text-amber-700 text-sm"
            >
              Change Number
            </button>
          </form>
        )}

        {mode === 'profile' && (
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !fullName}
              className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating Profile...' : 'Complete Sign Up'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
