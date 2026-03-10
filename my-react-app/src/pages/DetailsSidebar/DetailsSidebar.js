import React from "react";
import "./DetailsSidebar.css";
import { useNavigate } from "react-router-dom";

const DetailsSidebar = ({ employee, onClose }) => {

  const navigate = useNavigate();

  if (!employee) return null;

  const formatTime = (time) => {
    if (!time) return "-";
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const calculateHours = () => {
    const checkIn = new Date(employee.check_in_time);
    const checkOut = employee.check_out_time
      ? new Date(employee.check_out_time)
      : new Date();

    const diff = checkOut - checkIn;
    const hours = diff / (1000 * 60 * 60);

    return hours.toFixed(1);
  };

  const handleViewReport = () => {
    navigate(`/attendance-report/${employee.employee_id}`);
  };

  return (
    <div className="details-overlay">

      <div className="details-sidebar">

        <button onClick={onClose} className="close-btn">✕</button>

        <div className="details-header">

          <div className="employee-info">
            <img src={employee.user_image} alt="" />

            <div>
              <h2>{employee.user_name}</h2>
              <p>{employee.user_role}</p>
            </div>
          </div>

        </div>

        {/* CHECK IN / CHECK OUT */}

        <div className="time-cards">

          <div className="time-card">
            <p>Check In</p>
            <h3>{formatTime(employee.check_in_time)}</h3>
          </div>

          <div className="time-card">
            <p>Check Out</p>
            <h3>{formatTime(employee.check_out_time)}</h3>
          </div>

        </div>

        {/* TOTAL HOURS */}

        <div className="hours-card">
          <p>Total Working Hours</p>
          <h1>{calculateHours()}h</h1>
        </div>

        {/* PHOTOS */}

        <div className="photo-section">

          <h3>Attendance Photos</h3>

          <div className="photo-grid">

            <div className="photo-box">
              <img src={employee.check_in_photo} alt="" />
              <p>Check-in Photo</p>
            </div>

            <div className="photo-box">
              {employee.check_out_photo ? (
                <img src={employee.check_out_photo} alt="" />
              ) : (
                <div className="empty-photo">📷</div>
              )}
              <p>Check-out Photo</p>
            </div>

          </div>

        </div>

        {/* GPS */}

        <div className="gps-section">

          <h3>GPS Locations</h3>

          <div className="gps-card">
            📍 Check-in: {employee.check_in_gps || "-"}
          </div>

          <div className="gps-card">
            📍 Check-out: {employee.check_out_gps || "-"}
          </div>

        </div>

        <button
          className="report-btn"
          onClick={handleViewReport}
        >
          View Full Attendance Report
        </button>

      </div>

    </div>
  );
};

export default DetailsSidebar;