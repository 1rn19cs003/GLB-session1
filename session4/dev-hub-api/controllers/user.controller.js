let users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
];

// const db = require('../data');


const getAllUsers = (req, res) => {
    res.json(users);
};

const getUserById = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
};

const createUser = (req, res) => {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const newUser = { id: Date.now(), name, email };
    users.push(newUser);
    res.status(201).json(newUser);
};

module.exports = { getAllUsers, getUserById, createUser };