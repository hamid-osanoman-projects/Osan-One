import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PayrollLedger } from '../components/hr/PayrollLedger';

export function AccountantDashboard() {
  return (
    <DashboardLayout title="Payroll Assistant Ledger">
      <PayrollLedger />
    </DashboardLayout>
  );
}
