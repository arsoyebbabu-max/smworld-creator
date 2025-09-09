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
        console.log('Auth state changed:', { event, session: session?.user?.id });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Check admin status when user changes
        if (session?.user) {
          setTimeout(async () => {
            const adminStatus = await checkAdminStatus(session.user.id);
            console.log('Admin check:', { adminStatus, event, pathname: window.location.pathname, userId: session.user.id });
            
            // Force redirect admin users to admin dashboard on any login event
            if (adminStatus && event === 'SIGNED_IN') {
              console.log('Admin user signed in, redirecting to admin dashboard');
              window.location.href = '/admin';
            } else if (!adminStatus && event === 'SIGNED_IN' && window.location.pathname === '/auth') {
              console.log('Regular user signed in, redirecting to user dashboard');
              window.location.href = '/dashboard';
            }
          }, 200);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Getting existing session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(async () => {
          const adminStatus = await checkAdminStatus(session.user.id);
          console.log('Initial admin check:', { adminStatus, pathname: window.location.pathname, userId: session.user.id });
          
          // Redirect admin users if they're on wrong pages
          if (adminStatus && (window.location.pathname === '/dashboard' || window.location.pathname === '/' || window.location.pathname === '/auth')) {
            console.log('Initial redirect to admin dashboard');
            window.location.href = '/admin';
          } else if (!adminStatus && window.location.pathname === '/admin') {
            console.log('Non-admin user on admin page, redirecting to dashboard');
            window.location.href = '/dashboard';
          }
        }, 200);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      console.log('Admin check result:', { data, error });
      
      if (!error && data) {
        console.log('User is admin, setting isAdmin to true');
        setIsAdmin(true);
        return true;
      } else {
        console.log('User is not admin, setting isAdmin to false');
        setIsAdmin(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
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