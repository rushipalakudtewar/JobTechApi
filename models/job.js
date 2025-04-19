const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    location: { type: String },
    salary: { type: String },
    experienceRequired: { type: String },
    employmentType: { type: String, enum: ["Full-Time", "Part-Time", "Contract", "Internship"], required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" }],
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
    postedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("Job", JobSchema);
  