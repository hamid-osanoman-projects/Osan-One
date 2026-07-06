import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import {
  Login,
  EmployeeDashboard,
  CeoDashboard,
  AccountantDashboard,
  HrOverview,
  HrExceptions,
  HrCompanies,
  HrDirectory,
  HrEmployeeProfile,
  HrLeaves,
  HrOffice,
  HrReports,
  NotFound
} from './pages';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AlertCircle, Users, CalendarX, MapPin, Building2, LayoutDashboard, FileSpreadsheet } from 'lucide-react';

const hrLinks = [
  { label: 'Overview', path: '/hr/overview', icon: LayoutDashboard },
  { label: 'Exceptions', path: '/hr/exceptions', icon: AlertCircle },
  { label: 'Companies', path: '/hr/companies', icon: Building2 },
  { label: 'Directory', path: '/hr/directory', icon: Users },
  { label: 'Leaves', path: '/hr/leaves', icon: CalendarX },
  { label: 'Reports', path: '/hr/reports', icon: FileSpreadsheet },
  { label: 'Office Setup', path: '/hr/office', icon: MapPin },
];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Employee Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
              <Route path="/dashboard" element={<EmployeeDashboard />} />
            </Route>

            {/* HR Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Super_HR']} />}>
              <Route path="/hr" element={<DashboardLayout title="HR Portal" links={hrLinks} />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<HrOverview />} />
                <Route path="exceptions" element={<HrExceptions />} />
                <Route path="companies" element={<HrCompanies />} />
                <Route path="directory" element={<HrDirectory />} />
                <Route path="employee/:id" element={<HrEmployeeProfile />} />
                <Route path="leaves" element={<HrLeaves />} />
                <Route path="reports" element={<HrReports />} />
                <Route path="office" element={<HrOffice />} />
              </Route>
            </Route>

            {/* CEO Routes */}
            <Route element={<ProtectedRoute allowedRoles={['CEO']} />}>
              <Route path="/ceo" element={<CeoDashboard />} />
            </Route>

            {/* Accountant Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Accountant']} />}>
              <Route path="/accountant" element={<AccountantDashboard />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <InstallPrompt />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
