const router = require("express").Router();
const { protect, allowRoles } = require("../middleware/auth");
const controller = require("../controllers/adminController");

router.use(protect, allowRoles("admin"));
router.get("/users", controller.users);
router.get("/jobs", controller.jobs);
module.exports = router;
