import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AdminProvider } from "./Context/AdminContext";
import { EmployeeProvider } from "./Context/EmployeeContext";

import LoginPage from "./pages/AdminSignIn/AdminSignIn";
import EmployeeLogin from "./pages/Employee/Employee";
import MainDashboard from "./pages/Dashboard/AttendanceDashboard";
import AttendanceReport from "./pages/Reports/Reports";
import EmployeeAttendance from "./pages/EmployeeAttendance/EmployeeAttendance";

function App() {
  return (
    <AdminProvider>

      <EmployeeProvider>

        <BrowserRouter>

          <Routes>

            {/* ADMIN ROUTES */}
            <Route path="/admin" element={<LoginPage />} />
            <Route path="/dashboard" element={<MainDashboard />} />

            {/* EMPLOYEE ROUTES */}
            <Route path="/" element={<EmployeeLogin />} />

            <Route path="/scan" element={<EmployeeAttendance />} />
            <Route
          path="/attendance-report/:employee_id"
          element={<AttendanceReport />}
        />

          </Routes>

        </BrowserRouter>

      </EmployeeProvider>

    </AdminProvider>
  );
}

export default App;