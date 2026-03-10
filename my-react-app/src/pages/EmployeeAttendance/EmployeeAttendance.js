import React, { useEffect, useRef, useState, useContext } from "react";
import "./EmployeeAttendance.css";
import Webcam from "react-webcam";
import { MapPin, LogIn, LogOut, BarChart3 } from "lucide-react";
import { EmployeeContext } from "../../Context/EmployeeContext";
import { fetchTodayAttendance } from "./attendanceService";
import { useNavigate } from "react-router-dom";

import {
  formatIST,
  getAttendanceStatus,
  handleCheckIn,
  handleCheckOut
} from "./attendanceActions";

export default function EmployeeAttendance() {

  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const { employee, token } = useContext(EmployeeContext);

  const [locationName, setLocationName] = useState("Fetching location...");
  const [cameraActive, setCameraActive] = useState(true);
  const [attendanceToday, setAttendanceToday] = useState(null);

  // =====================================
  // Fetch Attendance
  // =====================================

  useEffect(() => {

    const loadAttendance = async () => {

      if (!employee) return;

      const data = await fetchTodayAttendance(employee.id, token);

      setAttendanceToday(data);

    };

    loadAttendance();

  }, [employee, token]);

  // =====================================
  // Camera Control
  // =====================================

  const stopCamera = () => {

    if (webcamRef.current) {

      const stream = webcamRef.current.video?.srcObject;

      if (stream) {

        stream.getTracks().forEach(track => track.stop());

      }

    }

  };

  useEffect(() => {

    setCameraActive(true);

    return () => stopCamera();

  }, []);

  // Stop camera when tab hidden

  useEffect(() => {

    const handleVisibilityChange = () => {

      if (document.hidden) {

        stopCamera();
        setCameraActive(false);

      } else {

        setCameraActive(true);

      }

    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);

  }, []);

  // =====================================
  // Get Location
  // =====================================

  useEffect(() => {

    if (!navigator.geolocation) {

      setLocationName("Location not supported");
      return;

    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );

          const data = await response.json();

          let place =
            data.name ||
            data.address?.building ||
            data.address?.amenity ||
            data.display_name;

          if (place && place.includes(",")) {
            place = place.split(",")[0];
          }

          setLocationName(place || "Exact location not found");

        } catch {

          setLocationName("Unable to fetch location");

        }

      },

      () => {
        setLocationName("Location permission denied");
      }

    );

  }, []);

  // =====================================
  // Attendance Button States
  // =====================================

  const { alreadyCheckedIn, alreadyCheckedOut } =
    getAttendanceStatus(attendanceToday);

  // =====================================
  // Reports Navigation
  // =====================================

  const handleViewReports = () => {

    if (!employee) return;

    navigate(`/attendance-report/${employee.id}`);

  };

  return (

    <div className="attendance-page">

      <div className="attendance-card">

        <h1 className="title">Employee Attendance</h1>

        {/* Location */}

        <div className="location-box">

          <div className="location-title">
            <MapPin size={20}/> Your Location
          </div>

          <p><strong>{locationName}</strong></p>

        </div>

        {/* Camera */}

        <div className="camera-preview">

          {cameraActive ? (

            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "12px",
                objectFit: "cover"
              }}
            />

          ) : (

            <p>Camera paused</p>

          )}

        </div>

        {/* Check In */}

        <button
          className="checkin-btn"
          disabled={alreadyCheckedIn}
          onClick={() =>
            handleCheckIn(
              webcamRef,
              employee,
              locationName,
              token,
              setAttendanceToday
            )
          }
        >

          <LogIn size={18}/>

          {alreadyCheckedIn
            ? `Checked In at ${formatIST(attendanceToday.check_in_time)}`
            : "Login / Check In"}

        </button>

        {/* Check Out */}

        <button
          className="checkout-btn"
          disabled={!alreadyCheckedIn || alreadyCheckedOut}
          onClick={() =>
            handleCheckOut(
              webcamRef,
              employee,
              locationName,
              token,
              setAttendanceToday
            )
          }
        >

          <LogOut size={18}/>

          {alreadyCheckedOut
            ? `Checked Out at ${formatIST(attendanceToday.check_out_time)}`
            : "Logout / Check Out"}

        </button>

        {/* Reports */}

        <button
          className="reports-btn"
          onClick={handleViewReports}
        >

          <BarChart3 size={18}/>
          View Reports

        </button>

      </div>

    </div>

  );

}