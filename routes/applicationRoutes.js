const express = require("express");
const authMiddleware = require("../middleware/auth");
const { applyForJob, getJobApplications } = require("../controllers/applicationController");

const router = express.Router();

router.post("/", authMiddleware("Employee"), applyForJob);
router.get("/", authMiddleware("Employer"), getJobApplications);

module.exports = router;
