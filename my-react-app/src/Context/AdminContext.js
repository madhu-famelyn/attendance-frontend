import React, { createContext, useState, useEffect } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedAdmin = localStorage.getItem("admin");

    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const loginAdmin = (data) => {

    const token = data.access_token;
    const admin = data.admin;

    setToken(token);
    setAdmin(admin);

    localStorage.setItem("token", token);
    localStorage.setItem("admin", JSON.stringify(admin));
  };

  const logoutAdmin = () => {
    setToken(null);
    setAdmin(null);

    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        token,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};