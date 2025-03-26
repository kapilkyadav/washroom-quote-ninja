
import { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

// Modified to always allow access without authentication check
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  return <>{children}</>;
};

export default ProtectedRoute;
