import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  phone_number: string;
  full_name: string;
  email: string | null;
  default_address: any;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  mockSignIn: (profile: UserProfile) => void;
}

// Mock user ID for demo
const MOCK_USER_ID = 'demo-user-7268991581';

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  mockSignIn: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    // Check for mock user first
    if (userId === MOCK_USER_ID) {
      const savedProfile = localStorage.getItem('mockUserProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data && !error) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  const mockSignIn = useCallback((mockProfile: UserProfile) => {
    // Create a mock user object
    const mockUser = {
      id: MOCK_USER_ID,
      email: mockProfile.email,
      phone: mockProfile.phone_number,
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
    } as User;

    // Save to localStorage for persistence
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('mockUserProfile', JSON.stringify(mockProfile));

    setUser(mockUser);
    setProfile(mockProfile);
  }, []);

  const signOut = useCallback(async () => {
    // Clear mock user data
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockUserProfile');
    
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  useEffect(() => {
    // Check for mock user in localStorage first
    const savedMockUser = localStorage.getItem('mockUser');
    const savedMockProfile = localStorage.getItem('mockUserProfile');

    if (savedMockUser && savedMockProfile) {
      setUser(JSON.parse(savedMockUser));
      setProfile(JSON.parse(savedMockProfile));
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        setLoading(false);
      })();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        // Don't override mock user
        const savedMockUser = localStorage.getItem('mockUser');
        if (savedMockUser) return;

        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
    mockSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
