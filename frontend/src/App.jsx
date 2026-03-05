import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './features/login';
import Dashboard from './features/dashboard';
import Pilots from './features/pilots';
import ChecklistItems from './features/checklist-items';
import NewService from './features/new-service';
import WorkLogs from './features/work-logs';
import WorkLogsInProgress from './features/work-logs-in-progress';
import AdminUsers from './features/users';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/pilots" element={<Pilots />} />
            <Route path="/checklist-items" element={<ChecklistItems />} />
            <Route path="/new-service" element={<NewService />} />
            <Route path="/worklogs" element={<WorkLogs />} />
            <Route path="/worklogs-in-progress" element={<WorkLogsInProgress />} />
            <Route path="/users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
