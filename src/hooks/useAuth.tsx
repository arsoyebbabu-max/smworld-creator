import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Check admin status when user changes
        if (session?.user) {
          setTimeout(async () => {
            const adminStatus = await checkAdminStatus(session.user.id);
            console.log('Admin check:', { adminStatus, event, pathname: window.location.pathname, userId: session.user.id });
            
            // Redirect admin users to admin dashboard on login or initial load
            if (adminStatus && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && 
                (window.location.pathname === '/auth' || window.location.pathname === '/' || window.location.pathname === '/dashboard')) {
              console.log('Redirecting to admin dashboard');
              window.location.href = '/admin';
            }
          }, 100);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(async () => {
          const adminStatus = await checkAdminStatus(session.user.id);
          console.log('Initial admin check:', { adminStatus, pathname: window.location.pathname, userId: session.user.id });
          
          // Redirect admin users if they're on user dashboard or home page
          if (adminStatus && (window.location.pathname === '/dashboard' || window.location.pathname === '/')) {
            console.log('Initial redirect to admin dashboard');
            window.location.href = '/admin';
          }
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        setIsAdmin(true);
        return true;
      } else {
        setIsAdmin(false);
        return false;
      }
    } catch (error) {
      setIsAdmin(false);
      return false;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || email
        }
      }
    });

    if (error) {
      toast({
        title: "সাইন আপ ত্রুটি",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "সাইন আপ সফল",
        description: "আপনার ইমেইল চেক করুন এবং অ্যাকাউন্ট নিশ্চিত করুন।",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "লগইন ত্রুটি",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "লগইন সফল",
        description: "স্বাগতম!",
      });
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "লগআউট ত্রুটি",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "লগআউট সফল",
        description: "আপনি সফলভাবে লগআউট হয়েছেন।",
      });
    }

    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};