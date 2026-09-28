import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Dashboard';
import ProtectedRoute from './protectedRutes';
import Login from '../pages/login';
import { SkeletonTheme } from 'react-loading-skeleton';


const appRoutes = () => (
  <SkeletonTheme baseColor="#d5d4d3" highlightColor="#f2f0ef">
  <BrowserRouter>
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />
          {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
      <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </SkeletonTheme>
);

export default appRoutes;
