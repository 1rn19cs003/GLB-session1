const express = require("express");
const router = express.Router();
const middelware  = require("../middelware/index");
const {authorizeRole} = require("../middelware/rbac");

const adminRoutes = require("./user.route");

router.use("/users", middelware.checkAcess, authorizeRole('admin'), adminRoutes);

module.exports = router;
