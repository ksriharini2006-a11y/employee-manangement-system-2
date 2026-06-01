import axios from "axios";
import { useState } from "react";

export default function ForgotPassword({ setPage }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const reset = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return alert("Invalid email");

    try {
      await axios.post("http://localhost:5000/api/forgot-password", { email, newPassword });
      setPage("login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
      <button onClick={reset}>Reset</button>
      <p onClick={() => setPage("login")}>Back to Login</p>
    </div>
  );
}