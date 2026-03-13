import React, { useEffect, useState } from "react";
import "./EmployeeManager.css";

const API_BASE = "http://127.0.0.1:8000";

export default function EmployeeManager() {

  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    expected_entry_time: "",
    expected_exit_time: "",
    office_latitude: "",
    office_longitude: "",
    image: null
  });

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/employee/all`);
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await fetch(`${API_BASE}/employee/register`, {
        method: "POST",
        body: data
      });

      if (res.ok) {
        alert("Employee created successfully");
        setShowForm(false);
        fetchEmployees();
      } else {
        alert("Failed to create employee");
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="employee-container">

      <div className="header">
        <h2>Employee Management</h2>

        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Employee"}
        </button>
      </div>

      {/* FORM */}

      {showForm && (
        <form className="employee-form" onSubmit={handleSubmit}>

          <input name="name" placeholder="Name" onChange={handleChange} required />

          <input name="email" placeholder="Email" onChange={handleChange} required />

          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

          <input name="role" placeholder="Role" onChange={handleChange} required />

          <input name="expected_entry_time" type="time" onChange={handleChange} required />

          <input name="expected_exit_time" type="time" onChange={handleChange} />

          <input name="office_latitude" type="number" step="any" placeholder="Office Latitude" onChange={handleChange} required />

          <input name="office_longitude" type="number" step="any" placeholder="Office Longitude" onChange={handleChange} required />

          <input name="image" type="file" onChange={handleChange} />

          <button type="submit" className="submit-btn">
            Register Employee
          </button>

        </form>
      )}

      {/* TABLE */}

      <table className="employee-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Entry Time</th>
            <th>Exit Time</th>
          </tr>
        </thead>

        <tbody>

          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>

              <td>
                {emp.image && (
                  <img
                    src={emp.image}
                    alt="employee"
                    className="employee-img"
                  />
                )}
              </td>

              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>{emp.expected_entry_time}</td>
              <td>{emp.expected_exit_time}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}