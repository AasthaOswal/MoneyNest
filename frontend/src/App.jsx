import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Landing from './pages/home/Landing';

// Categories related pages
import CategoriesPage from './pages/categories/CategoriesPage';
import CreateCategory from './pages/categories/CreateCategory';
import CategoryDetails from './pages/categories/CategoryDetails';


//Label related pages
import LabelsPage from './pages/labels/LabelsPage';
import CreateLabel from './pages/labels/CreateLabel';
import LabelDetails from './pages/labels/LabelDetails';


// Transactions pages
import CreateTransaction from './pages/transactions/CreateTransaction';
import TransactionsList from './pages/transactions/TransactionsList';
import TransactionDetails from './pages/transactions/TransactionDetails';
import EditTransaction from './pages/transactions/EditTransaction';

// Goals pages
import GoalsPage from './pages/goals/GoalsPage';
import CreateGoal from './pages/goals/CreateGoal';
import GoalDetails from './pages/goals/GoalDetails';
import EditGoal from './pages/goals/EditGoal';

// Layouts and Contexts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./services/firebase.service.js"; // adjust path if needed

// Family pages
import FamilyOnboarding from "./pages/family/FamilyOnboarding";
import CreateFamily from "./pages/family/CreateFamily";
import JoinFamily from "./pages/family/JoinFamily";
import FamilyPage from './pages/family/FamilyPage';
import ManageFamily from './pages/family/ManageFamily';

// Dashboard pages
import FamilyDashboard from './pages/dashboard/FamilyDashboard.jsx';
import IndividualDashboard from './pages/dashboard/IndividualDashboard.jsx';

// Notifications pages
import NotificationsPage from './pages/notifications/NotificationsPage';
import NotificationDetailsPage from './pages/notifications/NotificationDetailsPage';
import PushNotificationSettings from './pages/notifications/PushNotificationSettings';

import AuthCallback from './pages/auth/AuthCallback.jsx';


function App() {

  // useEffect(() => {
  //   // This listener stays active for the lifetime of the component
  //   const unsubscribe = onMessage(messaging, (payload) => {
  //     console.log("Foreground message received:", payload);

  //     const { title, body } = payload.notification;

  //     // Use the Service Worker to show the notification (High mobile compatibility)
  //     navigator.serviceWorker.ready.then((registration) => {
  //       registration.showNotification(title, {
  //         body: body,
  //         icon: "/favicon.svg",
  //         badge: "/favicon.svg", // Optional: small icon for mobile status bars
  //       });
  //     });
  //   });

  //   return () => unsubscribe();
  // }, []);
  return (
    <ThemeProvider>
      <BrowserRouter>
      <AuthProvider>
          <Routes>
            {/* Public Routes - Landing, Login, Signup */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Route>

            {/* Protected Wrapper */}
            <Route element={<ProtectedRoute allowedRoles={['member', 'admin', 'familyAdmin']} />}>

              {/* Dashboard Layout Wrapper */}
              <Route element={<DashboardLayout />}>

                {/* Member + Family Admin */}
                <Route element={<ProtectedRoute allowedRoles={['member', 'familyAdmin']} />}>

                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/notifications/:id" element={<NotificationDetailsPage />} />
                  <Route path="/settings/push-notifications" element={<PushNotificationSettings />} />
      
                  <Route path="/dashboard/family" element={<FamilyDashboard />} />
                  <Route path="/dashboard/individual" element={<IndividualDashboard />} />
                  <Route path="/reminders" element={<div>Reminders</div>} />


                  {/* Family Related Pages */}
                  <Route path="/family" element={<FamilyPage />} />
                  <Route path="/family/onboarding" element={<FamilyOnboarding />} />
                  <Route path="/family/create" element={<CreateFamily />} />
                  <Route path="/family/join" element={<JoinFamily />} />

                  {/* Categories related pages */}
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/categories/create" element={<CreateCategory />} />
                  <Route path="/categories/:id" element={<CategoryDetails />} />

                  {/* Labels related pages */}
                  <Route path="/labels" element={<LabelsPage />} />
                  <Route path="/labels/create" element={<CreateLabel />} />
                  <Route path="/labels/:id" element={<LabelDetails />} />

                  {/* Goals related pages */}
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/goals/create" element={<CreateGoal />} />
                  <Route path="/goals/:id" element={<GoalDetails />} />
                  <Route path="/goals/edit/:id" element={<EditGoal />} />


                  <Route path="/transactions" element={<TransactionsList />} />
                  <Route path="/transactions/create" element={<CreateTransaction />} />
                  <Route path="/transactions/:id" element={<TransactionDetails />} />
                  <Route path="/transactions/edit/:id" element={<EditTransaction />} />
                  
                </Route>

                {/* Family Admin */}
                <Route element={<ProtectedRoute allowedRoles={['familyAdmin']} />}>
                  <Route path="/family/manage" element={<ManageFamily />}  />
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
      </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;