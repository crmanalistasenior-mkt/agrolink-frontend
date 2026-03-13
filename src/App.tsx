import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import Market from './pages/Market';
import Loads from './pages/Loads';
import MyProducts from './pages/MyProducts';
import MyOrders from './pages/MyOrders';
import MyIncomingOrders from './pages/MyIncomingOrders';
import MyActiveLoads from './pages/MyActiveLoads';
import OrderDetail from './pages/OrderDetail';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import PublicationDetail from './pages/PublicationDetail';
import ProducerProfile from './pages/ProducerProfile';
import IncomingOrderDetail from './pages/IncomingOrderDetail';
import LoadDetail from './pages/LoadDetail';
import UserSettings from './pages/UserSettings';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/market" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="market" element={<Market />} />
          <Route path="market/:id" element={<ProductDetail />} />
          <Route path="producer/:id" element={<ProducerProfile />} />
          <Route path="loads" element={<Loads />} />
          <Route path="loads/:id" element={<LoadDetail />} />
          <Route path="my-products" element={<MyProducts />} />
          <Route path="my-products/:id" element={<PublicationDetail />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="my-orders/:id" element={<OrderDetail />} />
          <Route path="incoming-orders" element={<MyIncomingOrders />} />
          <Route path="incoming-orders/:id" element={<IncomingOrderDetail />} />
          <Route path="my-loads" element={<MyActiveLoads />} />
          <Route path="my-loads/:id" element={<LoadDetail />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/market" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
