import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Dashboard';
import ProtectedRoute from './protectedRutes';
import Login from '../pages/login';
import Signup from '../pages/Signup';
import { SkeletonTheme } from 'react-loading-skeleton';

const appRoutes = () => (
  <SkeletonTheme baseColor="#d5d4d3" highlightColor="#f2f0ef">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </SkeletonTheme>
);

export default appRoutes;
