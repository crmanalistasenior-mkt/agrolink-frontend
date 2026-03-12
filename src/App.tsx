import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import Market from './pages/Market';
import Loads from './pages/Loads';
import MyProducts from './pages/MyProducts';
import MyOrders from './pages/MyOrders';
import MyIncomingOrders from './pages/MyIncomingOrders';
import MyActiveLoads from './pages/MyActiveLoads';
import OrderDetail from './pages/OrderDetail';
import ProducerDashboard from './pages/ProducerDashboard';
import PublicationDetail from './pages/PublicationDetail';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/market" replace />} />
          <Route path="dashboard" element={<ProducerDashboard />} />
          <Route path="market" element={<Market />} />
          <Route path="loads" element={<Loads />} />
          <Route path="my-products" element={<MyProducts />} />
          <Route path="my-products/:id" element={<PublicationDetail />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="my-orders/:id" element={<OrderDetail />} />
          <Route path="incoming-orders" element={<MyIncomingOrders />} />
          <Route path="my-loads" element={<MyActiveLoads />} />
        </Route>

        <Route path="*" element={<Navigate to="/market" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
