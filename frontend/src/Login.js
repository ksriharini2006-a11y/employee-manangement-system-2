import axios from "axios";
import { useState } from "react";

export default function Login({ setToken, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return alert("Invalid Email");

    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      <p onClick={() => setPage("register")}>Register</p>
      <p onClick={() => setPage("forgot")}>Forgot Password</p>
    </div>
  );
}