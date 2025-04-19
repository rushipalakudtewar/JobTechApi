const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
    status: { type: String, enum: ["Applied", "Shortlisted", "Rejected", "Hired"], default: "Applied" },
    appliedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("JobApplication", JobApplicationSchema);
  