import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Landing from './pages/home/Landing';

// Layouts and Contexts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes - Landing, Login, Signup */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Protected Wrapper */}
            <Route element={<ProtectedRoute allowedRoles={['member', 'admin', 'familyAdmin']} />}>

              {/* Dashboard Layout Wrapper */}
              <Route element={<DashboardLayout />}>

                {/* Member + Family Admin */}
                <Route element={<ProtectedRoute allowedRoles={['member', 'familyAdmin']} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/individual-dashboard" element={<div>Individual Dashboard</div>} />
                  <Route path="/transactions" element={<div>Transactions</div>} />
                  <Route path="/categories" element={<div>Categories</div>} />
                  <Route path="/labels" element={<div>Labels</div>} />
                  <Route path="/goals" element={<div>Goals</div>} />
                  <Route path="/reminders" element={<div>Reminders</div>} />
                </Route>

                {/* Family Admin */}
                <Route element={<ProtectedRoute allowedRoles={['familyAdmin']} />}>
                  <Route path="/manage-members" element={<div>Manage Members</div>} />
                </Route>

                {/* Admin */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin-dashboard" element={<div>Admin Dashboard</div>} />
                </Route>

              </Route>
            </Route>

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;