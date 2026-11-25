const router = require("express").Router();
const controller = require("../controllers/applicationController");
const { protect, allowRoles } = require("../middleware/auth");

router.post("/:jobId", protect, allowRoles("seeker"), controller.apply);
router.get("/my", protect, allowRoles("seeker"), controller.myApplications);
router.get("/received", protect, allowRoles("recruiter", "admin"), controller.receivedApplications);
router.patch("/:id/status", protect, allowRoles("recruiter", "admin"), controller.updateStatus);
module.exports = router;
