
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: Error }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authStateCallback = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN') {
          // Redirect to dashboard on sign in
          if (location.pathname.includes('/auth/')) {
            navigate('/dashboard', { replace: true });
          }
        } else if (event === 'SIGNED_OUT') {
          // Redirect to login on sign out
          navigate('/auth/login', { replace: true });
        }
      }
    );

    authStateCallback();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success("Login realizado com sucesso!");
      return {};
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast.error("Erro ao fazer login");
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success("Conta criada com sucesso!");
      return {};
    } catch (error: any) {
      console.error('Signup error:', error.message);
      toast.error("Erro ao criar conta");
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Erro ao sair");
        throw error;
      }
      toast.success("Sessão encerrada com sucesso");
    } catch (error: any) {
      console.error('Signout error:', error.message);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
