import React, { createContext, useState } from "react";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {

  const storedEmployee = localStorage.getItem("employee");
  const storedToken = localStorage.getItem("employeeToken");

  const [employee, setEmployee] = useState(
    storedEmployee ? JSON.parse(storedEmployee) : null
  );

  const [token, setToken] = useState(storedToken || null);

  const loginEmployee = (data) => {

    const employeeData = {
      id: data.employee.id,
      name: data.employee.name,
      email: data.employee.email,
      role: data.employee.role,
      expected_entry_time: data.employee.expected_entry_time,
      expected_exit_time: data.employee.expected_exit_time,
      office_latitude: data.employee.office_latitude,
      office_longitude: data.employee.office_longitude,
      image: data.employee.image
    };

    setEmployee(employeeData);
    setToken(data.access_token);

    localStorage.setItem("employee", JSON.stringify(employeeData));
    localStorage.setItem("employeeToken", data.access_token);
  };

  const logoutEmployee = () => {

    setEmployee(null);
    setToken(null);

    localStorage.removeItem("employee");
    localStorage.removeItem("employeeToken");
  };

  return (
    <EmployeeContext.Provider
      value={{
        employee,
        token,

        // Quick access helpers
        officeLatitude: employee?.office_latitude || null,
        officeLongitude: employee?.office_longitude || null,

        loginEmployee,
        logoutEmployee
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};