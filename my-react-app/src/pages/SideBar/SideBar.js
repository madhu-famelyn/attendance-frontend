import React from "react";
import "./SideBar.css";
import { LayoutDashboard, CalendarCheck, BarChart3 } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <span className="logo-icon">🍽️</span>
        <span className="logo-text">Karmic</span>
      </div>

      <p className="nav-title">Navigation</p>

      <div className="nav-menu">
        <div className="nav-item active">
          <LayoutDashboard size={18} />
          Dashboard
        </div>

        <div className="nav-item active-light">
          <CalendarCheck size={18} />
          Daily Attendance
        </div>

        <div className="nav-item">
          <BarChart3 size={18} />
          Reports
        </div>
      </div>
    </div>
  );
};

export default Sidebar;