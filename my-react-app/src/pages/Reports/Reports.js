import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./Reports.css";
import * as XLSX from "xlsx";

const AttendanceReport = () => {

  const { employee_id } = useParams();

  const [attendance, setAttendance] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rangeType, setRangeType] = useState("month");

  // ===============================
  // TIME FORMAT
  // ===============================

  const formatIST = (time) => {
    if (!time) return "-";

    const date = new Date(time + "Z");

    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatDateIST = (time) => {
    if (!time) return "-";

    const date = new Date(time + "Z");

    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata"
    });
  };

  // ===============================
  // WORKING HOURS
  // ===============================

  const calculateHours = (checkIn, checkOut) => {

    if (!checkIn || !checkOut) return "-";

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diff = end - start;

    const hours = diff / (1000 * 60 * 60);

    return hours.toFixed(2) + " hrs";

  };

  // ===============================
  // FETCH ATTENDANCE
  // ===============================

  const fetchAttendance = useCallback(async () => {

    try {

      let url = `https://attendance-backend-long-meadow-1623.fly.dev/attendance/user/${employee_id}`;

      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setAttendance(data);

    } catch (error) {

      console.error("Attendance fetch failed:", error);

    }

  }, [employee_id, startDate, endDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // ===============================
  // DATE PRESET
  // ===============================

  const applyPreset = (type) => {

    setRangeType(type);

    const today = new Date();

    let start;
    let end = new Date();

    if (type === "day") {

      start = today;

    } else if (type === "week") {

      const first = today.getDate() - today.getDay();
      start = new Date(today.setDate(first));

    } else if (type === "month") {

      start = new Date(today.getFullYear(), today.getMonth(), 1);

    } else if (type === "custom") {

      return;

    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);

  };

  // Initialize default range
  useEffect(() => {
    applyPreset("month");
  }, [employee_id]);

  // ===============================
  // EXPORT EXCEL
  // ===============================

  const exportToExcel = () => {

    const exportData = attendance.map((item) => ({
      Date: formatDateIST(item.check_in_time),
      "Check In Time": formatIST(item.check_in_time),
      "Check In Location": item.check_in_gps || "-",
      "Check Out Time": formatIST(item.check_out_time),
      "Check Out Location": item.check_out_gps || "-",
      "Working Hours": calculateHours(
        item.check_in_time,
        item.check_out_time
      )
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(workbook, "Attendance_Report.xlsx");

  };

  return (

    <div className="report-container">

      {/* HEADER */}

      <div className="report-header">

        <div>
          <h1>Attendance Reports</h1>
          <p>Employee attendance history</p>
        </div>

        <button
          className="download-btn"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>

      </div>

      {/* EMPLOYEE */}

      <div className="employee-select">

        {attendance.length > 0 && (
          <div className="employee-pill">
            {attendance[0].user_name}
          </div>
        )}

      </div>

      {/* DATE FILTERS */}

      <div className="date-filters">

        <button
          className={rangeType === "day" ? "active" : ""}
          onClick={() => applyPreset("day")}
        >
          Today
        </button>

        <button
          className={rangeType === "week" ? "active" : ""}
          onClick={() => applyPreset("week")}
        >
          This Week
        </button>

        <button
          className={rangeType === "month" ? "active" : ""}
          onClick={() => applyPreset("month")}
        >
          This Month
        </button>

        <button
          className={rangeType === "custom" ? "active" : ""}
          onClick={() => setRangeType("custom")}
        >
          Custom
        </button>

      </div>

      {/* CUSTOM DATE RANGE */}

      {rangeType === "custom" && (

        <div className="custom-range">

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

        </div>

      )}

      {/* TABLE */}

      <div className="table-container">

        <table className="attendance-table">

          <thead>

            <tr>
              <th>Date</th>
              <th>Check In Time</th>
              <th>Check In Location</th>
              <th>Check Out Time</th>
              <th>Check Out Location</th>
              <th>Working Hours</th>
            </tr>

          </thead>

          <tbody>

            {attendance.length === 0 ? (

              <tr>
                <td colSpan="6">No Attendance Found</td>
              </tr>

            ) : (

              attendance.map((item) => (

                <tr key={item.id}>

                  <td>{formatDateIST(item.check_in_time)}</td>
                  <td>{formatIST(item.check_in_time)}</td>
                  <td>{item.check_in_gps || "-"}</td>
                  <td>{formatIST(item.check_out_time)}</td>
                  <td>{item.check_out_gps || "-"}</td>

                  <td>
                    {calculateHours(
                      item.check_in_time,
                      item.check_out_time
                    )}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default AttendanceReport;