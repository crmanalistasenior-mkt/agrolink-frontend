import { useUser } from '../hooks/useUser';
import ProducerDashboard from './ProducerDashboard';
import BuyerDashboard from './BuyerDashboard';
import TransporterDashboard from './TransporterDashboard';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { role } = useUser();

  if (role === 'producer') {
    return <ProducerDashboard />;
  }

  if (role === 'buyer') {
    return <BuyerDashboard />;
  }

  if (role === 'transporter') {
    return <TransporterDashboard />;
  }

  // Fallback for transporters or admin if they don't have a specific dashboard yet
  return <Navigate to="/market" replace />;
}
