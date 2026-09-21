import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/dashboard.tsx';
// import Login from '../pages/login.jsx';
// import ProtectedRoute from './protectedRutes.jsx';


const appRoutes = () => (
  <Router>
    <Routes>
      {/* Public route */}
      <Route path="/home" element={<Home />} />
          {/* Protected routes */}
      {/* <Route element={<ProtectedRoute />}>
      <Route path="/home" element={<Home />} /> */}
      {/* <Route path="/about" element={<page1 />} />
      <Route path="/contact" element={<page2 />} /> */}
      {/* </Route> */}
    </Routes>
  </Router>
);

export default appRoutes;
