# Node.js Day 4 - Complete Session Plan

---

## 🎯 End Goal

**Students will have built:**

- ✅ Complete Express.js server
- ✅ JWT authentication system
- ✅ Role-based authorization (RBAC)
- ✅ 4 resource controllers (Users, Projects, Comments, Auth)
- ✅ Protected routes with middleware
- ✅ Error handling
- ✅ Working API they can call

---

## 📋 Session Schedule

**Activities:**

1. **Setup Check**

   ```bash
   node --version  # Should be v14+
   npm --version   # Should be v6+

   # Create project
   mkdir my-api
   cd my-api
   npm init -y
   npm install express cors jsonwebtoken bcrypt dotenv
   npm install --save-dev nodemon
   ```

   ```
   ┌─────────────────────────────────────────┐
   │ While (thereIsWork) {                   │
   │   if (callStack.isEmpty()) {            │
   │     - Check timers                      │
   │     - Process I/O callbacks             │
   │     - Run microtasks (promises)         │
   │   }                                     │
   │ }                                       │
   └─────────────────────────────────────────┘
   ```


---

### **Node.js & Express Basics**

**Goal:** Understand what Node.js is, run first server

- What is Node.js? (runtime, non-blocking, event-driven)
- Why Express? (routing, middleware, simplicity)
- HTTP basics (GET, POST, PUT, DELETE)


```javascript
// Step 1: Create server.js
const express = require("express");
const app = express();

app.use(express.json());

// First route
app.get("/", (req, res) => {
  res.json({ message: "Hello, API!" });
});

app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});

// Run: node server.js
// Test: Open browser to http://localhost:3000
```

```
┌─────────────────────────────────────────┐
│ While (thereIsWork) {                   │
│   if (callStack.isEmpty()) {            │
│     - Check timers                      │
│     - Process I/O callbacks             │
│     - Run microtasks (promises)         │
│   }                                     │
│ }                                       │
└─────────────────────────────────────────┘
```

### **Routing & Controllers**

**Goal:** Build clean route structure, separate logic into controllers

- Route parameters vs query strings
- Why controllers (separation of concerns)

**Part 1: Routing**

```javascript
// routes/userRoutes.js
const express = require("express");
const router = express.Router();

// Dummy data
let users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

// Routes
router.get("/", (req, res) => res.json(users));
router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

router.post("/", (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

router.put("/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "Not found" });
  Object.assign(user, req.body);
  res.json(user);
});

router.delete("/:id", (req, res) => {
  users = users.filter((u) => u.id !== parseInt(req.params.id));
  res.json({ message: "Deleted" });
});

module.exports = router;

// server.js
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);
```

**Part 2: Controllers**

```javascript
// controllers/userController.js
let users = [];

const getAllUsers = (req, res) => {
  res.json(users);
};

const getUserById = (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
};

const createUser = (req, res) => {
  const { name, email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const newUser = { id: Date.now(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
};

// ... others

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

// routes/userRoutes.js (updated)
const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();

router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;
```
---

### **Middleware Explained**

**Goal:** Understand middleware flow, create custom middleware

- What is middleware?
- Middleware flow/pipeline
- req, res, next parameters
- Order matters


```
Incoming Request ──> [ Middleware 1 ] ──(next())──> [ Middleware 2 ] ──> Controller Route Handler ──> Outgoing Response

```

```javascript
// Middleware: Logger
const logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// Middleware: Auth placeholder
const authCheck = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token" });
  }
  next();
};

// Add to server
app.use(logger);
app.use("/protected", authCheck);
```


- Add logging middleware
- Test to see logs
- See how middleware stops request if no next()

**Deliverable:** Custom middleware working


### **Authentication with JWT**

**Goal:** Build register/login with JWT tokens

- JWT concept (what, why, how)
- Token structure (header.payload.signature)
- bcrypt for password hashing
- Signing and verifying tokens

**Part 1: Basic JWT**

```javascript
// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET = "super-secret-key-change-in-prod";
let users = [];

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Check duplicate
    if (users.find((u) => u.email === email)) {
      return res.status(409).json({ error: "User exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      role: "user",
    };

    users.push(newUser);

    res.status(201).json({
      message: "Registered",
      user: { id: newUser.id, email, name, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
```

- Register user in Postman
- Login and get token
- Show token decoded at jwt.io
- Explain what's inside

**Part 2: Auth Middleware**

```javascript
// middleware/auth.js
const jwt = require("jsonwebtoken");
const SECRET = "super-secret-key-change-in-prod";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };

// routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;

// server.js
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);
```

- Students test register/login
- Get token from login
- Prepare to use token in next section

**Deliverable:** Working authentication system

### **Authorization with RBAC**

**Goal:** Implement role-based access control, protect endpoints

- What is authorization vs authentication?
- Role-based access control (RBAC)
- Permission matrix (admin, user, moderator)
- How to check permissions

```javascript
// middleware/rbac.js
const roles = {
  admin: ["create", "read", "update", "delete"],
  moderator: ["read", "update"],
  user: ["read"],
};

const hasPermission = (userRole, action) => {
  return roles[userRole]?.includes(action) || false;
};

const authorize = (requiredAction) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!hasPermission(req.user.role, requiredAction)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};

module.exports = { authorize };

// routes/userRoutes.js (updated with auth)
const express = require("express");
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorize("read"),
  userController.getAllUsers,
);
router.get(
  "/:id",
  authenticateToken,
  authorize("read"),
  userController.getUserById,
);
router.post(
  "/",
  authenticateToken,
  authorize("create"),
  userController.createUser,
);
router.put(
  "/:id",
  authenticateToken,
  authorize("update"),
  userController.updateUser,
);
router.delete(
  "/:id",
  authenticateToken,
  authorize("delete"),
  userController.deleteUser,
);

module.exports = router;
```

- Test without token → 401
- Test with user token on DELETE → 403
- Test with admin token → 200
- Create test users with different roles


- Students add RBAC to their routes
- Test different scenarios

**Deliverable:** Protected routes with role-based access control

---

### **Projects & Comments Controllers**

**Goal:** Add remaining controllers quickly

```javascript
// controllers/projectController.js
let projects = [];

const getAllProjects = (req, res) => {
  res.json(projects);
};

const createProject = (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });

    const newProject = {
      id: Date.now(),
      title,
      description,
      userId: req.user.id,
      createdAt: new Date(),
    };
    projects.push(newProject);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = (req, res) => {
  const project = projects.find((p) => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ error: "Not found" });

  // Only owner or admin
  if (project.userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized" });
  }

  Object.assign(project, req.body);
  res.json(project);
};

const deleteProject = (req, res) => {
  const project = projects.find((p) => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ error: "Not found" });

  if (project.userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized" });
  }

  projects = projects.filter((p) => p.id !== parseInt(req.params.id));
  res.json({ message: "Deleted" });
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
};

// routes/projectRoutes.js
const express = require("express");
const projectController = require("../controllers/projectController");
const { authenticateToken } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorize("read"),
  projectController.getAllProjects,
);
router.post(
  "/",
  authenticateToken,
  authorize("create"),
  projectController.createProject,
);
router.put(
  "/:id",
  authenticateToken,
  authorize("update"),
  projectController.updateProject,
);
router.delete(
  "/:id",
  authenticateToken,
  authorize("delete"),
  projectController.deleteProject,
);

module.exports = router;

// Similar for comments controller...

// server.js (add routes)
const projectRoutes = require("./routes/projectRoutes");
const commentRoutes = require("./routes/commentRoutes");
app.use("/projects", projectRoutes);
app.use("/comments", commentRoutes);
```

- Students add projects and comments
- Test all routes

**Deliverable:** All 4 controllers working

---

### **Error Handling & Polish**

**Goal:** Add proper error handling, make API production-ready

```javascript
// Error handler middleware (at end of server.js)
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server error";

  res.status(statusCode).json({
    error: message,
    statusCode,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Add server documentation
app.get("/", (req, res) => {
  res.json({
    message: "API Running",
    endpoints: {
      auth: {
        register: "POST /auth/register",
        login: "POST /auth/login",
      },
      users: {
        list: "GET /users",
        get: "GET /users/:id",
        create: "POST /users",
        update: "PUT /users/:id",
        delete: "DELETE /users/:id",
      },
      projects: {
        list: "GET /projects",
        create: "POST /projects",
        update: "PUT /projects/:id",
        delete: "DELETE /projects/:id",
      },
      comments: {
        list: "GET /comments",
        create: "POST /comments",
        delete: "DELETE /comments/:id",
      },
    },
  });
});
```
- Test error scenarios
- Verify all errors return proper status codes
- Test 404 handling

---

## 📞 Troubleshooting

**Port 3000 already in use?**

```bash
netstat -tuln | grep 3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows
# Change port in server.js
```

**Module not found?**

```bash
npm install express cors jsonwebtoken bcrypt
```

**Token errors?**

- Check Authorization header format: `Bearer {token}`
- Verify SECRET matches in auth.js
- Check token expiry

**CORS errors?**

```bash
npm install cors
app.use(cors());
```

---

