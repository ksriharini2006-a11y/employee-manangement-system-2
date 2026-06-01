import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [emps, setEmps] = useState([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [form, setForm] = useState({
    name: "",
    empId: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees", {
          params: { search, department, startDate, endDate }
        });
        setEmps(res.data);
      } catch (err) {
        console.error("Fetch error:", err.response?.data?.message || err.message);
      }
    };
    fetchData();
  }, [search, department, startDate, endDate]);

  const validate = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const numberRegex = /^[0-9]+$/;
    if (!emailRegex.test(form.email)) { alert("Invalid email"); return false; }
    if (!numberRegex.test(form.phone)) { alert("Phone must be numeric"); return false; }
    if (isNaN(form.salary) || form.salary === "") { alert("Salary must be numeric"); return false; }
    return true;
  };

  const saveEmp = async () => {
    if (!validate()) return;
    try {
      await axios.post("http://localhost:5000/api/employees", form);
      setForm({
        name: "", empId: "", email: "", phone: "",
        department: "", designation: "", salary: "", joiningDate: ""
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add employee");
    }
  };

  const deleteEmp = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmps(prev => prev.filter(e => e._id !== id)); // ← instant remove, no refetch needed
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="dashboard">

      {/* ── Filters ── */}
      <div className="form-box">
        <input
          placeholder="Search by name / ID / email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          placeholder="Filter by department"
          value={department}
          onChange={e => setDepartment(e.target.value)}
        />
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      {/* ── Add Employee Form ── */}
      <div className="form-box">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="EmpId" value={form.empId} onChange={e => setForm({ ...form, empId: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
        <input placeholder="Designation" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
        <input placeholder="Salary" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
        <input type="date" value={form.joiningDate} onChange={e => setForm({ ...form, joiningDate: e.target.value })} />
        <button onClick={saveEmp}>Add Employee</button>
      </div>

      {/* ── Table ── */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Joining Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {emps.length === 0 ? (
              <tr><td colSpan="5">No employees found</td></tr>
            ) : (
              emps.map(e => (
                <tr key={e._id}>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.department}</td>
                  <td>{e.joiningDate ? new Date(e.joiningDate).toLocaleDateString() : "-"}</td>
                  <td><button className="action-btn" onClick={() => deleteEmp(e._id)}>Delete</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}