import React, { JSX, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authentication/auth';

// A wrapper component that loads its child component lazily
const LazyWrapper: React.FC<{ component: React.LazyExoticComponent<() => JSX.Element> }> = ({ component: Component }) => {
  return (
    // <Suspense fallback={<div>Loading...</div>}>
    <Suspense>
      <Component />
    </Suspense>
  );
};

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render the lazy-loaded component inside Suspense
  return <LazyWrapper component={React.lazy(() => Promise.resolve({ default: () => children }))} />;
};

export default ProtectedRoute;
