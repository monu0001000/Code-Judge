const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { updateAvatar } = require("../controllers/user.controller");

router.put("/avatar", authMiddleware, updateAvatar);

module.exports = router;