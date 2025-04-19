const express = require("express");
const authMiddleware = require("../middleware/auth");
const { updateEmployeeProfile, updateEmployerProfile, getEmployeeProfile } = require("../controllers/profileController");
const upload = require("../middleware/upload");

const router = express.Router();

router.put("/employee", authMiddleware("Employee"),upload.single('resume'), updateEmployeeProfile);
router.put("/employer", authMiddleware("Employer"), updateEmployerProfile);
router.get("/employee", authMiddleware("Employee"), getEmployeeProfile);


module.exports = router;
