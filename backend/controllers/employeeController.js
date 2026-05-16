const db = require("../config/db")

// Get all employees
const getEmployees = (req, res) => {
  const query = "SELECT * FROM employee ORDER BY id ASC"

  db.query(query, (err, results) => {
    if (err) {
      console.error("Employee fetch error:", err)
      return res.status(500).json({ message: "Failed to fetch employees", error: err })
    }

    res.status(200).json({
      message: "Employees fetched successfully",
      employees: results,
    })
  })
}

// Add a new employee (only essentials exposed via API)
const addEmployee = (req, res) => {
  const { employeeName, email, phoneNumber } = req.body

  if (!employeeName || !email || !phoneNumber) {
    return res.status(400).json({ message: "All employee fields are required" })
  }

  const query =
    "INSERT INTO employee (employee_name, email, phone_number) VALUES (?, ?, ?)"

  db.query(
    query,
    [employeeName, email, phoneNumber],
    (err, result) => {
      if (err) {
        console.error("Employee insert error:", err)
        return res.status(500).json({ message: "Failed to save employee", error: err })
      }

      res.status(201).json({
        message: "Employee saved successfully",
        employee: {
          id: result.insertId,
          employeeName,
          email,
          phoneNumber,
        },
      })
    },
  )
}

// Update an employee
const updateEmployee = (req, res) => {
  const { email } = req.params
  const { employeeName, phoneNumber, projectId } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  // projectId is optional for assignment; other fields may be optional too
  const fields = []
  const values = []

  if (employeeName) {
    fields.push("employee_name = ?")
    values.push(employeeName)
  }
  if (phoneNumber) {
    fields.push("phone_number = ?")
    values.push(phoneNumber)
  }
  if (projectId) {
    fields.push("project_id = ?")
    values.push(projectId)
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "At least one field is required to update" })
  }

  values.push(email)
  const query = `UPDATE employee SET ${fields.join(", ")} WHERE email = ?`

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Employee update error:", err)
      return res.status(500).json({ message: "Failed to update employee", error: err })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" })
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee: {
        email,
        employeeName,
        phoneNumber,
        projectId,
      },
    })
  })
}

// Delete an employee
const deleteEmployee = (req, res) => {
  const { email } = req.params

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  const query = "DELETE FROM employee WHERE email = ?"

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Employee delete error:", err)
      return res.status(500).json({ message: "Failed to delete employee", error: err })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" })
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    })
  })
}

// Get a single employee by email
const getEmployeeByEmail = (req, res) => {
  const { email } = req.params

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  const query = "SELECT * FROM employee WHERE email = ?"

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Employee fetch error:", err)
      return res.status(500).json({ message: "Failed to fetch employee", error: err })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Employee not found" })
    }

    res.status(200).json({
      message: "Employee fetched successfully",
      employee: results[0],
    })
  })
}

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeByEmail,
}
