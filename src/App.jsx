import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

const UserApp = lazy(() => import('./pages/UserApp'));
const DriverApp = lazy(() => import('./pages/DriverApp'));

function Loader() {
  return (
    <div className="grid h-full place-items-center bg-slate-100">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-slate-300 border-t-accent" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserApp />} />
        <Route path="/driver" element={<DriverApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
