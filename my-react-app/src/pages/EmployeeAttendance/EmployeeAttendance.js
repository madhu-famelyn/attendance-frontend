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

  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  // =====================================
  // Fetch Today's Attendance
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
  // Get Exact Location (Latitude + Longitude)
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

    console.log("Latitude:", lat);
    console.log("Longitude:", lon);
    console.log("Accuracy:", position.coords.accuracy);

    try {

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: {
            "User-Agent": "employee-attendance-app"
          }
        }
      );

      const data = await response.json();

      const shortLocation = data.display_name
        ?.split(",")
        .slice(0,4)
        .join(",");

      setLocationName(shortLocation || "Exact location not found");

    } catch {

      setLocationName("Unable to fetch location");

    }

  },
  () => {
    setLocationName("Location permission denied");
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }
);

  }, []);

  // =====================================
  // Attendance Button State
  // =====================================

  const { alreadyCheckedIn, alreadyCheckedOut } =
    getAttendanceStatus(attendanceToday);

  // =====================================
  // Check In
  // =====================================

  const onCheckIn = async () => {

    if (checkingIn) return;

    setCheckingIn(true);

    try {

      await handleCheckIn(
        webcamRef,
        employee,
        locationName,
        token,
        setAttendanceToday
      );

    } finally {

      setCheckingIn(false);

    }

  };

  // =====================================
  // Check Out
  // =====================================

  const onCheckOut = async () => {

    if (checkingOut) return;

    setCheckingOut(true);

    try {

      await handleCheckOut(
        webcamRef,
        employee,
        locationName,
        token,
        setAttendanceToday
      );

    } finally {

      setCheckingOut(false);

    }

  };

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
          disabled={alreadyCheckedIn || checkingIn}
          onClick={onCheckIn}
        >

          <LogIn size={18}/>

          {checkingIn
            ? "Checking In..."
            : alreadyCheckedIn
            ? `Checked In at ${formatIST(attendanceToday?.check_in_time)}`
            : "Login / Check In"}

        </button>

        {/* Check Out */}

        <button
          className="checkout-btn"
          disabled={!alreadyCheckedIn || alreadyCheckedOut || checkingOut}
          onClick={onCheckOut}
        >

          <LogOut size={18}/>

          {checkingOut
            ? "Checking Out..."
            : alreadyCheckedOut
            ? `Checked Out at ${formatIST(attendanceToday?.check_out_time)}`
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