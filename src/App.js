import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import SearchTours from "./Pages/SearchTours/SearchTours";
import TourDetails from "./Pages/TourDetails/TourDetails";

import BookingRequest from "./Pages/Admin/BookingRequest/BookingRequest";
import BookingDetails from "./Pages/BookingDetails/BookingDetails";
import MyBookings from "./Pages/MyBookings/MyBookings";
import DestinationDetails from "./Pages/DestinationDetails/DestinationDetails";
import Notifications from "./Pages/Notifications/Notifications";

import PaymentSuccess from "./Pages/PaymentSuccess/PaymentSuccess";
import PaymentCancel from "./Pages/PaymentCancel/PaymentCancel";

import ProtectedRoute from "./Routes/ProtectedRoute";
import AdminRoute from "./Routes/AdminRoute";

/* Admin */
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import ManageTours from "./Pages/Admin/ManageTours";
import ManageDestinations from "./Pages/Admin/ManageDestinations";
import ManageUsers from "./Pages/Admin/ManageUsers";

/* New Admin Pages */
import ManageReviews from "./Pages/Admin/ManageReviews/ManageReviews";

import "./App.css";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Navbar />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchTours />} />
          <Route path="/tour/:id" element={<TourDetails />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book-tour/:tourId"
            element={
              <ProtectedRoute>
                <BookingRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route path="tours" element={<ManageTours />} />
            <Route path="destinations" element={<ManageDestinations />} />
            <Route path="users" element={<ManageUsers />} />

            <Route path="reviews" element={<ManageReviews />} />
          </Route>

          <Route
            path="/destinations/:id"
            element={<DestinationDetails />}
          />

          <Route
            path="/payment-success/:bookingId"
            element={<PaymentSuccess />}
          />

          <Route
            path="/payment-cancel"
            element={<PaymentCancel />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <h1
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: "120px",
                }}
              >
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;