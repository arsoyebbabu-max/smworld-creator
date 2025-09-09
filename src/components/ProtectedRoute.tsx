import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p>লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">অ্যাক্সেস নিষেধ</h2>
          <p className="text-muted-foreground mb-4">
            এই পেজটি দেখার জন্য অ্যাডমিন অনুমতি প্রয়োজন।
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            ড্যাশবোর্ডে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;