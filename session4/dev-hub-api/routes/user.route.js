const express = require("express");
const router = express.Router();
const userControllers = require('../controllers/user.controller');



// Dummy data
let users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
];

// Routes
router.get("/", userControllers.getAllUsers);

router.get("/:id", userControllers.getUserById);

router.post("/", userControllers.createUser);

// router.get("/:id", (req, res) => {
//     const user = users.find((u) => u.id === parseInt(req.params.id));
//     if (!user) return res.status(404).json({ error: "Not found" });
//     res.json(user);
// });

// TODO: query params


// router.put("/:id", (req, res) => {
//     const user = users.find((u) => u.id === parseInt(req.params.id));
//     if (!user) return res.status(404).json({ error: "Not found" });
//     Object.assign(user, req.body);
//     res.json(user);
// });

// router.delete("/:id", (req, res) => {
//     users = users.filter((u) => u.id !== parseInt(req.params.id));
//     res.json({ message: "Deleted" });
// });

module.exports = router;