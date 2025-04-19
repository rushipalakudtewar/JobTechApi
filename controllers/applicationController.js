const Application = require("../models/job_application");
const Job = require("../models/job");
const Employee = require("../models/employee");
const mongoose = require('mongoose');
// Apply for a Job
const applyForJob = async (req, res) => {
  try {
    
    const { jobId } = req.body;

    // Fetch job details to get employerId
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the user has already applied
    const existingApplication = await Application.findOne({ jobId, employeeId: req.user.id });
    if (existingApplication) {
      return res.status(200).json({ message: "You have already applied for this job" });
    }

    // Create a new application
    const newApplication = new Application({
      jobId,
      employeeId: req.user.id,
      employerId: job.employer // Extracting employerId from job details
    });

    await newApplication.save();

    // Link application to job & employee
    await Job.findByIdAndUpdate(jobId, { $push: { applicants: newApplication._id } });
    await Employee.findByIdAndUpdate(req.user.id, { $push: { appliedJobs: newApplication._id } });

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Error applying for job" });
  }
};

// Get Applications for Employer
// const getJobApplications = async (req, res) => {
//   try {
//     const jobApplications = await Application.find().populate("employeeId", "name email skills experience");

//     res.status(200).json({status:true,data:jobApplications,message:"getting data succesfully"});
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching applications" });
//   }
// };

const getJobApplications = async (req, res) => {
  try {
    
    const employerId = new mongoose.Types.ObjectId(req.user.id);
    
    const jobApplications = await Application.aggregate([
  {
    '$lookup': {
      'from': 'jobs', 
      'localField': 'jobId', 
      'foreignField': '_id', 
      'as': 'job'
    }
  }, {
    '$unwind': '$job'
  }, {
    '$match': {
      'job.employer':employerId
    }
  }, {
    '$lookup': {
      'from': 'employees', 
      'localField': 'employeeId', 
      'foreignField': '_id', 
      'as': 'employee'
    }
  }, {
    '$unwind': '$employee'
  }, {
    '$group': {
      '_id': '$job._id', 
      'jobTitle': {
        '$first': '$job.title'
      }, 
      'jobId': {
        '$first': '$job._id'
      }, 
      'applications': {
        '$push': {
          'status': '$status', 
          'appliedAt': '$appliedAt', 
          'employee': {
            '_id': '$employee._id', 
            'name': '$employee.name', 
            'email': '$employee.email', 
            'skills': '$employee.skills', 
            'experience': '$employee.experience'
          }
        }
      }
    }
  }, {
    '$project': {
      '_id': 0, 
      'jobId': 1, 
      'jobTitle': 1, 
      'applications': 1
    }
  }
]);

    res.status(200).json({
      status: true,
      data: jobApplications,
      message: 'Applications fetched successfully for employer.',
    });
  } catch (error) {
    console.error('Error in aggregation:', error);
    res.status(500).json({ status: false, message: 'Server Error' });
  }
};


module.exports = { applyForJob, getJobApplications };
