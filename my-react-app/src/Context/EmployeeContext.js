import React, { createContext, useState } from "react";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {

  const [employee, setEmployee] = useState(
    JSON.parse(localStorage.getItem("employee"))
  );

  const [token, setToken] = useState(
    localStorage.getItem("employeeToken")
  );

  const loginEmployee = (data) => {

    setEmployee(data.employee);
    setToken(data.access_token);

    localStorage.setItem("employee", JSON.stringify(data.employee));
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
        loginEmployee,
        logoutEmployee
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};