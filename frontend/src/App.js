import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(null);

  if (!token) {
    if (page === "login") return <Login setToken={setToken} setPage={setPage} />;
    if (page === "register") return <Register setPage={setPage} />;
    if (page === "forgot") return <ForgotPassword setPage={setPage} />;
  }

  return <Dashboard />;
}