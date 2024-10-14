require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import CORS
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const db = new sqlite3.Database("./database.db"); // Correctly open SQLite DB

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // Use environment variable or default key
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Create a Router for your routes
const router = express.Router();

// Create JWT function
function createJWT(payload, secretKey) {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const encodedHeader = Buffer.from(header)
    .toString("base64")
    .replace(/=/g, "");
  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString("base64")
    .replace(/=/g, "");

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Middleware to verify JWT and extract user info
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const [header, payload, signature] = token.split(".");
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(`${header}.${payload}`)
      .digest("base64")
      .replace(/=/g, "");

    if (expectedSignature !== signature) {
      throw new Error("Invalid signature");
    }

    const userData = JSON.parse(
      Buffer.from(payload, "base64").toString("utf8")
    );
    req.user = userData; // Attach user data to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// Middleware to check for admin role
function checkAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}

// Register route (store user in SQLite DB with a hashed password and role)
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Insert user into SQLite database with a role (defaults to 'user')
  const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  db.run(sql, [username, hashedPassword, role || "user"], function (err) {
    if (err) {
      console.error("Database error:", err); // Log the error for debugging
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ message: "Username already exists" });
      }
      return res.status(500).json({ message: "Error registering user" });
    }

    res.status(201).json({ message: "User registered successfully" });
  });
});

// Login route (validate user using SQLite DB and compare hashed passwords)
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Retrieve user from SQLite database
  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the hashed password with the provided password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT with role
    const token = createJWT(
      { username: user.username, role: user.role },
      SECRET_KEY
    );
    res.json({ token });
  });
});

// Protected route (accessible to all authenticated users)
router.get("/protected", verifyJWT, (req, res) => {
  res.json({ message: "Protected content", username: req.user.username });
});

// Admin-only route (accessible only to admin users)
router.get("/admin", verifyJWT, checkAdmin, (req, res) => {
  res.json({ message: "Welcome Admin!", username: req.user.username });
});

// Mount the router under the /app4 base path
app.use("/app4", router);

// Start the server
app.listen(process.env.PORT || 3003, () =>
  console.log(`Server running on http://localhost:${process.env.PORT || 3003}`)
);
