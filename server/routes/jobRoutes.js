const router = require("express").Router();
const controller = require("../controllers/jobController");
const { protect, allowRoles } = require("../middleware/auth");

router.get("/", controller.listJobs);
router.get("/:id", controller.getJob);
router.post("/", protect, allowRoles("recruiter", "admin"), controller.createJob);
router.patch("/:id", protect, allowRoles("recruiter", "admin"), controller.updateJob);
router.delete("/:id", protect, allowRoles("recruiter", "admin"), controller.deleteJob);
module.exports = router;
