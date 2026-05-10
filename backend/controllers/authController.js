const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Generate Project ID
const generateProjectId = (projectName) => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  return (
    projectName.substring(0, 3).toUpperCase() + randomNum
  );
};

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password, role, project_name } = req.body;

    // Validation
    if (!name || !email || !password || !role || !project_name) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check Email Exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkQuery, [email], async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length > 0) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate Project ID
      const projectId = generateProjectId(project_name);

      // Insert into project_names table
      const projectQuery =
        "INSERT INTO project_names (project_id, project_name) VALUES (?, ?)";

      db.query(
        projectQuery,
        [projectId, project_name],
        (projectErr, projectResult) => {
          if (projectErr) {
            return res.status(500).json(projectErr);
          }

          // Insert user with project_id
          const userQuery =
            "INSERT INTO users (name, email, password, role, project_id) VALUES (?, ?, ?, ?, ?)";

          db.query(
            userQuery,
            [name, email, hashedPassword, role, projectId],
            (userErr, userResult) => {
              if (userErr) {
                return res.status(500).json(userErr);
              }

              res.status(201).json({
                message: "Signup Successful",
                project_id: projectId,
                userId: userResult.insertId,
              });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// LOGIN
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid Password",
        });
      }

      res.status(200).json({
        message: "Login Successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          project_id: user.project_id,
        },
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { signup, login };