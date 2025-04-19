const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  resume: { type: String }, // Resume file URL
  skills: [{ type: String }],
  experience: [
    {
      company: String,
      role: String,
      from: Date,
      to: Date,
      description: String,
    }
  ],
  education: [
    {
      institution: String,
      degree: String,
      fieldOfStudy: String,
      startYear: Number,
      endYear: Number,
    }
  ],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Employee", EmployeeSchema);
