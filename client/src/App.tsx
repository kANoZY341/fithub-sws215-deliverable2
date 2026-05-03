import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import { AdminRoute, ProtectedRoute } from './components/RouteGuards';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PlansPage } from './pages/PlansPage';
import { TrainersPage } from './pages/TrainersPage';
import { MemberDashboardPage } from './pages/MemberDashboardPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AttendancePage } from './pages/AttendancePage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TrainerDetailPage } from './pages/TrainerDetailPage';
import { PlanDetailPage } from './pages/PlanDetailPage';
import { BookingReviewPage } from './pages/BookingReviewPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { SubscriptionCheckoutPage } from './pages/SubscriptionCheckoutPage';
import { SubscriptionConfirmationPage } from './pages/SubscriptionConfirmationPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPlansPage } from './pages/admin/AdminPlansPage';
import { AdminTrainersPage } from './pages/admin/AdminTrainersPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/plans/:id" element={<PlanDetailPage />} />
              <Route path="/trainers" element={<TrainersPage />} />
              <Route path="/trainers/:id" element={<TrainerDetailPage />} />
              <Route path="/booking/review" element={<BookingReviewPage />} />
              <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
              <Route path="/checkout" element={<SubscriptionCheckoutPage />} />
              <Route path="/checkout/success" element={<SubscriptionConfirmationPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<MemberDashboardPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/plans" element={<AdminPlansPage />} />
                <Route path="/admin/trainers" element={<AdminTrainersPage />} />
                <Route path="/admin/bookings" element={<AdminBookingsPage />} />
                <Route path="/admin/reports" element={<AdminReportsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/home" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
