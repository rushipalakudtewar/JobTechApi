const Job = require("../models/job");
const Employer = require("../models/employer");

// Post a new Job
const createJob = async (req, res) => {
  try {
    
    const { title, description, skillsRequired, location, salary,employmentType,experienceRequired } = req.body;
    const newJob = new Job({ title, description, skillsRequired, location, salary, employer: req.user.id, experienceRequired, employmentType });
    await newJob.save();

    // Link job to employer
    await Employer.findByIdAndUpdate(req.user.id, { $push: { jobsPosted: newJob._id } });

    res.status(201).json({status:true,data:newJob,message:"Created post successfully"});
  } catch (error) {
    
    res.status(500).json({ message: "Error posting job" });
  }
};

// Get All Jobs (For Employees)
// const getJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find().populate("employer", "companyName");
//     res.json(jobs);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching jobs" });
//   }
// };
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      location,
      employmentType,
      experience,
      salary,
      skills,
    } = req.query;

    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // case-insensitive
    }
    
    if (employmentType) {
      filter.employmentType = { $regex: employmentType, $options: 'i' };
    }
    
    if (experience) {
      filter.experienceRequired = { $gte: experience };
    }
    
    if (salary) {
      filter.salary = { $gte: salary };
    }
    
    if (skills) {
      const skillArray = skills.split(",").map(skill => skill.trim());
      filter.skillsRequired = {
        $in: skillArray.map(skill => new RegExp(skill, 'i')) // regex array for partial match
      };
    }
    const jobs = await Job.find(filter)
      .populate("employer", "companyName")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      data: jobs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};


// Get Employer's Posted Jobs
const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort({postedAt:-1});
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employer jobs" });
  }
};

module.exports = { createJob, getJobs, getEmployerJobs };
