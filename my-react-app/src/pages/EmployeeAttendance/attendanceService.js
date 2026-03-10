export const fetchTodayAttendance = async (employeeId, token) => {

  try {

    const today = new Date().toISOString().split("T")[0];

    const res = await fetch(
      `https://attendance-backend-long-meadow-1623.fly.dev/attendance/user/${employeeId}?start_date=${today}&end_date=${today}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    return data.length > 0 ? data[0] : null;

  } catch (error) {

    console.error("Attendance fetch error", error);
    return null;

  }

};