const express = require("express");
const router = express.Router();

const { runPlayground } = require("../controllers/playground.controller");

// Public on purpose: this is the landing-page "try it live" demo. It never
// touches the DB and only ever runs against a fixed, hardcoded test set —
// see playground.controller.js for the rate limit and size caps that keep
// it safe to leave unauthenticated.
router.post("/run", runPlayground);

module.exports = router;
