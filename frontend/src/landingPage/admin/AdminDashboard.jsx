import { Dashboard } from '@/pages/admin/Dashboard';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

/**
 * AdminDashboard - Main container for the admin dashboard
 * Wraps the Dashboard component with the AdminLayout
 */
export function AdminDashboard() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}

export default AdminDashboard;