import React, { useEffect, useState } from "react";
import "./DetailsSidebar.css";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaSignInAlt,
  FaSignOutAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCamera,
  FaFileAlt
} from "react-icons/fa";

const DetailsSidebar = ({ employee, onClose }) => {

  const navigate = useNavigate();
  const [hours, setHours] = useState("0.0");

  // ================================
  // UTC → IST
  // ================================

  const toIST = (time) => {
    if (!time) return null;
    return new Date(time + "Z");
  };

  // ================================
  // FORMAT IST TIME
  // ================================

  const formatTime = (time) => {

    if (!time) return "-";

    const date = toIST(time);

    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // ================================
  // CALCULATE HOURS
  // ================================

  const calculateHours = () => {

    if (!employee?.check_in_time) return "0.0";

    const checkIn = toIST(employee.check_in_time);

    const checkOut = employee.check_out_time
      ? toIST(employee.check_out_time)
      : new Date();

    const diff = checkOut - checkIn;

    const hours = diff / (1000 * 60 * 60);

    return hours.toFixed(1);
  };

  // ================================
  // LIVE HOURS UPDATE
  // ================================

  useEffect(() => {

    if (!employee) return;

    const updateHours = () => {
      setHours(calculateHours());
    };

    updateHours();

    const interval = setInterval(updateHours, 60000);

    return () => clearInterval(interval);

  }, [employee]);

  // ================================
  // VIEW REPORT
  // ================================

  const handleViewReport = () => {
    navigate(`/attendance-report/${employee.employee_id}`);
  };

  // AFTER HOOKS
  if (!employee) return null;

  return (
    <div className="details-overlay">

      <div className="details-sidebar">

        <button onClick={onClose} className="close-btn">
          <FaTimes />
        </button>

        <div className="details-header">

          <div className="employee-info">
            <img src={employee.user_image} alt="employee" />

            <div>
              <h2>{employee.user_name}</h2>
              <p>{employee.user_role}</p>
            </div>
          </div>

        </div>

        {/* CHECK IN / CHECK OUT */}

        <div className="time-cards">

          <div className="time-card">
            <p><FaSignInAlt /> Check In</p>
            <h3>{formatTime(employee.check_in_time)}</h3>
          </div>

          <div className="time-card">
            <p><FaSignOutAlt /> Check Out</p>
            <h3>{formatTime(employee.check_out_time)}</h3>
          </div>

        </div>

        {/* TOTAL HOURS */}

        <div className="hours-card">
          <p><FaClock /> Total Working Hours</p>
          <h1>{hours}h</h1>
        </div>

        {/* PHOTOS */}

        <div className="photo-section">

          <h3><FaCamera /> Attendance Photos</h3>

          <div className="photo-grid">

            <div className="photo-box">
              <img src={employee.check_in_photo} alt="Check in" />
              <p>Check-in Photo</p>
            </div>

            <div className="photo-box">

              {employee.check_out_photo ? (
                <img src={employee.check_out_photo} alt="Check out" />
              ) : (
                <div className="empty-photo">
                  <FaCamera />
                </div>
              )}

              <p>Check-out Photo</p>

            </div>

          </div>

        </div>

        {/* GPS */}

        <div className="gps-section">

          <h3><FaMapMarkerAlt /> GPS Locations</h3>

          <div className="gps-card">
            <FaMapMarkerAlt /> Check-in: {employee.check_in_gps || "-"}
          </div>

          <div className="gps-card">
            <FaMapMarkerAlt /> Check-out: {employee.check_out_gps || "-"}
          </div>

        </div>

        {/* REPORT BUTTON */}

        <button
          className="report-btn"
          onClick={handleViewReport}
        >
          <FaFileAlt /> View Full Attendance Report
        </button>

      </div>

    </div>
  );
};

export default DetailsSidebar;