import React, { useEffect, useState, useCallback } from "react";
import "./Dashboard.css";
import DetailsSidebar from "../DetailsSidebar/DetailsSidebar";
import { FaUsers, FaClock } from "react-icons/fa";

const AttendanceDashboard = () => {

  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [totalWorkingHours, setTotalWorkingHours] = useState(0);
  const [employeesPresentCount, setEmployeesPresentCount] = useState(0);

  const convertUTCtoIST = (time) => {
    if (!time) return null;
    return new Date(time + "Z");
  };

  const calculateDashboardStats = useCallback((data) => {

    let present = 0;
    let total = 0;

    data.forEach((item) => {

      const checkIn = convertUTCtoIST(item.check_in_time);
      const checkOut = item.check_out_time
        ? convertUTCtoIST(item.check_out_time)
        : new Date();

      if (!checkIn) return;

      const diff = checkOut - checkIn;
      const hours = diff / (1000 * 60 * 60);

      total += hours;

      if (!item.check_out_time) {
        present++;
      }

    });

    setEmployeesPresentCount(present);
    setTotalWorkingHours(total.toFixed(1));

  }, []);

  const fetchAttendance = useCallback(async () => {
    try {
      const res = await fetch("https://attendance-backend-long-meadow-1623.fly.dev/attendance/today");
      const data = await res.json();

      setAttendanceData(data);
      calculateDashboardStats(data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    }
  }, [calculateDashboardStats]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const formatTimeIST = (time) => {

    if (!time) return "-";

    const date = convertUTCtoIST(time);

    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

  };

  const calculateRowHours = (item) => {

    const checkIn = convertUTCtoIST(item.check_in_time);

    if (!checkIn) return "-";

    const checkOut = item.check_out_time
      ? convertUTCtoIST(item.check_out_time)
      : new Date();

    const diff = checkOut - checkIn;
    const hours = diff / (1000 * 60 * 60);

    return hours.toFixed(1) + "h";
  };

  return (

    <div className="att-dashboard-container">

      <h1 className="att-dashboard-title">Dashboard</h1>
      <p className="att-dashboard-subtitle">Today's attendance overview</p>

      <div className="att-dashboard-cards">

        <div className="att-dashboard-card">
          <div className="att-dashboard-icon-green">
            <FaUsers />
          </div>
          <div>
            <h2>{employeesPresentCount}</h2>
            <p>Employees Present</p>
          </div>
        </div>

        <div className="att-dashboard-card">
          <div className="att-dashboard-icon-orange">
            <FaClock />
          </div>
          <div>
            <h2>{totalWorkingHours}h</h2>
            <p>Total Working Hours</p>
          </div>
        </div>

      </div>

      <h2 className="att-dashboard-table-title">Attendance</h2>

      <div className="att-dashboard-table-container">

        <table className="att-dashboard-table">

          <thead>
            <tr>
              <th>Staff</th>
              <th>Role</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Location</th>
            </tr>
          </thead>

          <tbody>

            {attendanceData.map((item) => (

              <tr
                key={item.id}
                onClick={() => setSelectedEmployee(item)}
                className="att-dashboard-row"
              >

                <td className="att-dashboard-staff">
                  <img src={item.user_image} alt="" />
                  {item.user_name}
                </td>

                <td>{item.user_role}</td>
                <td>{formatTimeIST(item.check_in_time)}</td>
                <td>{formatTimeIST(item.check_out_time)}</td>
                <td>{calculateRowHours(item)}</td>
                <td>{item.check_in_gps || "-"}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {selectedEmployee && (
        <DetailsSidebar
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

    </div>
  );

};

export default AttendanceDashboard;