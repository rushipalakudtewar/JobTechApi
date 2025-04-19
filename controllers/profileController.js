const Employee = require("../models/employee");
const Employer = require("../models/employer");

// Employee Profile Update

const updateEmployeeProfile = async (req, res) => {
  try {
    const { name, skills, experience,education } = req.body;
    const resumePath = req.file ? req.file.filename : null;

    const updateData = {
      name,
      skills: skills ? skills.split(",") : [],
    };

    if (resumePath) {
      updateData.resume = resumePath;
    }
    if (experience) {
      updateData.experience = JSON.parse(experience);
    }
    if (education) {
      updateData.education = JSON.parse(education);
    }

    // console.log("update", updateData);

    const updatedProfile = await Employee.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    res
      .status(200)
      .json({ data: updatedProfile, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

const getEmployeeProfile = async (req, res) => {
  try {
    
    const updatedProfile = await Employee.findOne({ _id: req.user.id });

    res
      .status(200)
      .json({
        status: true,
        data: updatedProfile,
        message: "getting employee details",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// Employer Profile Update
const updateEmployerProfile = async (req, res) => {
  try {
    const { companyName } = req.body;
    const updatedProfile = await Employer.findByIdAndUpdate(
      req.user.id,
      { companyName },
      { new: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

module.exports = {
  updateEmployeeProfile,
  updateEmployerProfile,
  getEmployeeProfile,
};
