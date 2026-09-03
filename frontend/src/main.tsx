import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

import { AdminRoute } from "./components/layout/AdminRoute";
import { AdminLayout } from "./components/layout/AdminLayout";

import { AuthProvider } from "./context/AuthContext";

import { Dashboard } from "./pages/Dashboard";
import { Eligibility } from "./pages/Eligibility";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Recommendations } from "./pages/Recommendations";
import { MyApplications } from "./pages/MyApplications";
import { SchemeDetails } from "./pages/SchemeDetails";
import { Schemes } from "./pages/Schemes";
import { ChangePassword } from "./pages/ChangePassword";

/* Admin pages */
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCitizens } from "./pages/admin/AdminCitizens";
import { AdminEmployees } from "./pages/admin/AdminEmployees";
import { AdminSchemes } from "./pages/admin/AdminSchemes";
import { AdminEligibilityRules } from "./pages/admin/AdminEligibilityRules";
import { AdminAIRecommendations } from "./pages/admin/AdminAIRecommendations";
import { AdminReports } from "./pages/admin/AdminReports";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { RoleRedirect } from "./components/layout/RoleRedirect";

import { EmployeeRoute } from "./components/layout/EmployeeRoute";
import { EmployeeLayout } from "./components/layout/EmployeeLayout";

import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import { EmployeeCustomers } from "./pages/employee/EmployeeCustomers";
import { CreateCustomer } from "./pages/employee/CreateCustomer";
import { CustomerDetails } from "./pages/employee/CustomerDetails";

import "./styles.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* =========================
              LOGIN
          ========================== */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/change-password"
            element={<ChangePassword />}
          />


          {/* =========================
              CITIZEN / NORMAL USER
          ========================== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/schemes"
                element={<Schemes />}
              />

              <Route
                path="/schemes/:id"
                element={<SchemeDetails />}
              />

              <Route
                path="/eligibility"
                element={<Eligibility />}
              />

              <Route
                path="/recommendations"
                element={<Recommendations />}
              />

              <Route
                path="/applications"
                element={<MyApplications />}
              />

            </Route>
          </Route>

          {/* =========================
              EMPLOYEE
          ========================== */}

          <Route element={<EmployeeRoute />}>
            <Route element={<EmployeeLayout />}>
              <Route
                path="/employee"
                element={<EmployeeDashboard />}
              />

              <Route
                path="/employee/customers"
                element={<EmployeeCustomers />}
              />

              <Route
                path="/employee/customers/new"
                element={<CreateCustomer />}
              />

              <Route
                path="/employee/customers/:customerId"
                element={<CustomerDetails />}
              />
            </Route>
          </Route>


          {/* =========================
              ADMIN
          ========================== */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>

              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/citizens"
                element={<AdminCitizens />}
              />

              <Route
                path="/admin/employees"
                element={<AdminEmployees />}
              />

              <Route
                path="/admin/schemes"
                element={<AdminSchemes />}
              />

              <Route
                path="/admin/rules"
                element={<AdminEligibilityRules />}
              />

              <Route
                path="/admin/recommendations"
                element={<AdminAIRecommendations />}
              />

              <Route
                path="/admin/reports"
                element={<AdminReports />}
              />

              <Route
                path="/admin/settings"
                element={<AdminSettings />}
              />

            </Route>
          </Route>


          {/* =========================
              DEFAULT ROUTES
          ========================== */}

          <Route
            path="/"
            element={<RoleRedirect />}
          />

          <Route
            path="*"
            element={<RoleRedirect />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
