import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/dashboard';


const appRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
          {/* Protected routes */}
      {/* <Route element={<ProtectedRoute />}>
      <Route path="/home" element={<Home />} /> */}
      {/* <Route path="/about" element={<page1 />} />
      <Route path="/contact" element={<page2 />} /> */}
      {/* </Route> */}
    </Routes>
  </BrowserRouter>
);

export default appRoutes;
