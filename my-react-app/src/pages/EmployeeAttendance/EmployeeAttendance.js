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

  const officeLatitude = Number(employee?.office_latitude);
  const officeLongitude = Number(employee?.office_longitude);

  const [locationName, setLocationName] = useState("Fetching location...");
  const [cameraActive, setCameraActive] = useState(true);
  const [attendanceToday, setAttendanceToday] = useState(null);

  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [isInOffice, setIsInOffice] = useState(false);

  const OFFICE_RADIUS = 500;

  // ===============================
  // Distance Calculation
  // ===============================

  const getDistanceMeters = (lat1, lon1, lat2, lon2) => {

    const R = 6371e3;
    const toRad = (deg) => (deg * Math.PI) / 180;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);

    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) *
        Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;

  };

  // ===============================
  // Fetch Attendance
  // ===============================

  useEffect(() => {

    const loadAttendance = async () => {

      if (!employee) return;

      const data = await fetchTodayAttendance(employee.id, token);
      setAttendanceToday(data);

    };

    loadAttendance();

  }, [employee, token]);

  // ===============================
  // Camera Control
  // ===============================

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

  // ===============================
  // GPS Location
  // ===============================

  useEffect(() => {

    if (!navigator.geolocation) {

      setLocationName("Geolocation not supported");
      return;

    }

    const watchId = navigator.geolocation.watchPosition(

      (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const distance = getDistanceMeters(
          lat,
          lon,
          officeLatitude,
          officeLongitude
        );

        console.log("User:", lat, lon);
        console.log("Office:", officeLatitude, officeLongitude);
        console.log("Distance:", distance);

        if (distance <= OFFICE_RADIUS) {

          setLocationName("In Office");
          setIsInOffice(true);

        } else {

          setLocationName("Outside Office");
          setIsInOffice(false);

        }

        setIsLocationLoaded(true);

      },

      () => {

        setLocationName("Enable location access");

      },

      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }

    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, [officeLatitude, officeLongitude]);

  const { alreadyCheckedIn, alreadyCheckedOut } =
    getAttendanceStatus(attendanceToday);

  // ===============================
  // Check In
  // ===============================

  const onCheckIn = async () => {

    if (!isInOffice) {

      alert("You are not in the office premises. Kindly reach office.");
      return;

    }

    if (checkingIn) return;

    setCheckingIn(true);

    try {

      await handleCheckIn(
        webcamRef,
        employee,
        "In Office",
        token,
        setAttendanceToday
      );

    } finally {

      setCheckingIn(false);

    }

  };

  // ===============================
  // Check Out
  // ===============================

  const onCheckOut = async () => {

    if (!isInOffice) {

      alert("You are not in the office premises.");
      return;

    }

    if (checkingOut) return;

    setCheckingOut(true);

    try {

      await handleCheckOut(
        webcamRef,
        employee,
        "In Office",
        token,
        setAttendanceToday
      );

    } finally {

      setCheckingOut(false);

    }

  };

  const handleViewReports = () => {

    if (!employee) return;

    navigate(`/attendance-report/${employee.id}`);

  };

  return (

    <div className="attendance-page">

      <div className="attendance-card">

        <h1 className="title">Employee Attendance</h1>

        <div className="location-box">

          <div className="location-title">
            <MapPin size={20}/> Your Location
          </div>

          <p><strong>{locationName}</strong></p>

        </div>

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
          disabled={!isLocationLoaded || !isInOffice || alreadyCheckedIn || checkingIn}
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
          disabled={!isLocationLoaded || !isInOffice || !alreadyCheckedIn || alreadyCheckedOut || checkingOut}
          onClick={onCheckOut}
        >

          <LogOut size={18}/>

          {checkingOut
            ? "Checking Out..."
            : alreadyCheckedOut
            ? `Checked Out at ${formatIST(attendanceToday?.check_out_time)}`
            : "Logout / Check Out"}

        </button>

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