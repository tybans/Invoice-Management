const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUserRole,
  deleteUser,
  getUsers,
} = require("../controllers/userController");

const { protect, restrictTo } = require("../middlewares/authMiddleware");

router.use(protect);

router.post("/", restrictTo("ADMIN", "UNIT_MANAGER"), createUser);
router.patch("/:userId", restrictTo("ADMIN"), updateUserRole);
router.delete("/:userId", restrictTo("ADMIN"), deleteUser);
router.get("/", restrictTo("ADMIN", "UNIT_MANAGER"), getUsers);

module.exports = router;
