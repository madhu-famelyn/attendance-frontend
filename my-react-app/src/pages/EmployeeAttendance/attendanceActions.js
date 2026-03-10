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
// Convert Base64 → File
// ===============================

const base64ToFile = async (base64, filename) => {

  const res = await fetch(base64);
  const blob = await res.blob();

  return new File([blob], filename, { type: "image/jpeg" });

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

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Camera capture failed");
      return;
    }

    const imageFile = await base64ToFile(imageSrc, "checkin.jpg");

    const formData = new FormData();

    formData.append("employee_id", employee.id);
    formData.append("check_in_gps", locationName);
    formData.append("check_in_photo", imageFile);

    const response = await fetch(
      "http://127.0.0.1:8000/attendance/check-in",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert("Check-in failed");
      return;
    }

    setAttendanceToday(data);

  } catch (error) {

    console.error(error);
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

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Camera capture failed");
      return;
    }

    const imageFile = await base64ToFile(imageSrc, "checkout.jpg");

    const formData = new FormData();

    formData.append("employee_id", employee.id);
    formData.append("check_out_gps", locationName);
    formData.append("check_out_photo", imageFile);

    const response = await fetch(
      "http://127.0.0.1:8000/attendance/check-out",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert("Check-out failed");
      return;
    }

    setAttendanceToday(data);

  } catch (error) {

    console.error(error);
    alert("Check-out error");

  }

};


// ===============================
// REPORT NAVIGATION
// ===============================

export const viewReports = () => {

  alert("Navigate to Reports");

};