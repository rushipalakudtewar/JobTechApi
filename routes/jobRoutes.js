const express = require("express");
const authMiddleware = require("../middleware/auth");
const { createJob, getJobs, getEmployerJobs } = require("../controllers/jobController");

const router = express.Router();

router.post("/", authMiddleware("Employer"), createJob);
router.get("/", authMiddleware("Employee"), getJobs);
router.get("/my-jobs", authMiddleware("Employer"), getEmployerJobs);

module.exports = router;
