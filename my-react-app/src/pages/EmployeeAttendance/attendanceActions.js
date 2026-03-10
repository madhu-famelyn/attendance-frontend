// ===============================
// Convert UTC → IST
// ===============================

export const formatIST = (timeString) => {

  if (!timeString) return "";

  const utcDate = new Date(timeString + "Z");

  return utcDate.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

};


// ===============================
// Button State Logic
// ===============================

export const getAttendanceStatus = (attendanceToday) => {

  const alreadyCheckedIn = attendanceToday?.check_in_time;
  const alreadyCheckedOut = attendanceToday?.check_out_time;

  return {
    alreadyCheckedIn,
    alreadyCheckedOut
  };

};


// ===============================
// SAFE Base64 → File Conversion
// ===============================

const base64ToFile = (base64, filename) => {

  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];

  const bstr = atob(arr[1]);
  const n = bstr.length;

  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });

};


// ===============================
// CHECK IN API
// ===============================

export const handleCheckIn = async (
  webcamRef,
  employee,
  locationName,
  token,
  setAttendanceToday
) => {

  try {

    if (!webcamRef.current) {
      alert("Camera not ready");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Camera capture failed");
      return;
    }

    const imageFile = base64ToFile(imageSrc, "checkin.jpg");

    const formData = new FormData();

    formData.append("employee_id", employee.id);
    formData.append("check_in_gps", locationName);
    formData.append("check_in_photo", imageFile);

    const response = await fetch(
      "https://attendance-backend-long-meadow-1623.fly.dev/attendance/check-in",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    if (!response.ok) {

      const err = await response.json();

      console.error("Check-in error:", err);

      alert(err.detail || "Check-in failed");

      return;

    }

    const data = await response.json();

    setAttendanceToday(data);

  } catch (error) {

    console.error("Check-in error:", error);

    alert("Check-in error");

  }

};


// ===============================
// CHECK OUT API
// ===============================

export const handleCheckOut = async (
  webcamRef,
  employee,
  locationName,
  token,
  setAttendanceToday
) => {

  try {

    if (!webcamRef.current) {
      alert("Camera not ready");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Camera capture failed");
      return;
    }

    const imageFile = base64ToFile(imageSrc, "checkout.jpg");

    const formData = new FormData();

    formData.append("employee_id", employee.id);
    formData.append("check_out_gps", locationName);
    formData.append("check_out_photo", imageFile);

    const response = await fetch(
      "https://attendance-backend-long-meadow-1623.fly.dev/attendance/check-out",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    if (!response.ok) {

      const err = await response.json();

      console.error("Check-out error:", err);

      alert(err.detail || "Check-out failed");

      return;

    }

    const data = await response.json();

    setAttendanceToday(data);

  } catch (error) {

    console.error("Check-out error:", error);

    alert("Check-out error");

  }

};


// ===============================
// REPORT NAVIGATION
// ===============================

export const viewReports = () => {

  alert("Navigate to Reports");

};