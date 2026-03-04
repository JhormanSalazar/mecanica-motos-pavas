import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pilots from './pages/Pilots';
import ChecklistItems from './pages/ChecklistItems';
import NewService from './pages/NewService';
import WorkLogs from './pages/WorkLogs';
import AdminUsers from './pages/Users';

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
            <Route path="/users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
