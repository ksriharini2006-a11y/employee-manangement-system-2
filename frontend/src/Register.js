import axios from "axios";
import { useState } from "react";

export default function Register({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const register = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) return alert("Invalid Email");

    try {
      await axios.post("http://localhost:5000/api/register", form);
      setPage("login");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={register}>Register</button>
      <p onClick={() => setPage("login")}>Back</p>
    </div>
  );
}