const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    industry: { type: String },
    location: { type: String },
    website: { type: String },
    jobsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("Employer", EmployerSchema);
  