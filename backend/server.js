const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1:27017/ems")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const emailRegex = /\S+@\S+\.\S+/;
const numberRegex = /^[0-9]+$/;

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
});

const Employee = mongoose.model("Employee", {
  name: String,
  empId: String,
  email: String,
  phone: String,
  department: String,
  designation: String,
  salary: Number,
  joiningDate: Date
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email" });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User exists" });
    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });
    res.json({ message: "Registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Wrong password" });
    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/employees", async (req, res) => {
  try {
    const { search, department, startDate, endDate } = req.query;
    let filter = {};
    if (search && search.trim() !== "") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { empId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    if (department && department.trim() !== "") {
      filter.department = department;
    }
    if (startDate && endDate && startDate !== "" && endDate !== "") {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        filter.joiningDate = { $gte: start, $lte: end };
      }
    }
    const data = await Employee.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/employees", async (req, res) => {
  try {
    const { email, phone, salary, joiningDate } = req.body;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email" });
    if (!numberRegex.test(phone))
      return res.status(400).json({ message: "Phone must be numeric" });
    if (isNaN(salary))
      return res.status(400).json({ message: "Salary must be numeric" });
    const emp = await Employee.create({
      ...req.body,
      joiningDate: joiningDate && joiningDate !== "" ? new Date(joiningDate) : null
    });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/employees/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(5000, () => console.log("Server running on 5000"));