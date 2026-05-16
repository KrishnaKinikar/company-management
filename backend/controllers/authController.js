const db = require("../config/db");
const bcrypt = require("bcryptjs");


// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
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

      // Generate Project ID from name


      // Insert user with project_id
      const userQuery =
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

      db.query(
        userQuery,
        [name, email, hashedPassword, role],
        (userErr, userResult) => {
          if (userErr) {
            return res.status(500).json(userErr);
          }

          res.status(201).json({
            message: "Signup Successful",
            userId: userResult.insertId,
          });
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

      // After successful login, lookup employee assignment by email
      const empQuery = "SELECT project_id FROM employee WHERE email = ? LIMIT 1";
      db.query(empQuery, [user.email], (empErr, empRows) => {
        if (empErr) {
          console.error('Employee lookup error:', empErr);
          // return login success without assigned project
          return res.status(200).json({
            message: "Login Successful",
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              project_id: user.project_id,
            },
            assignedProject: null,
          });
        }

        const assignedProjectId = empRows && empRows[0] ? empRows[0].project_id : null;

        if (!assignedProjectId) {
          return res.status(200).json({
            message: "Login Successful",
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              project_id: user.project_id,
            },
            assignedProject: null,
          });
        }

        // Fetch project details
        const projQuery = "SELECT * FROM project_names WHERE project_id = ? LIMIT 1";
        db.query(projQuery, [assignedProjectId], (projErr, projRows) => {
          if (projErr) {
            console.error('Project lookup error:', projErr);
            return res.status(200).json({
              message: "Login Successful",
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                project_id: user.project_id,
              },
              assignedProject: null,
            });
          }

          const assignedProject = projRows && projRows[0] ? projRows[0] : null;

          return res.status(200).json({
            message: "Login Successful",
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              project_id: user.project_id,
            },
            assignedProject,
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { signup, login };