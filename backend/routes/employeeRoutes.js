const express = require("express")
const router = express.Router()

const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeByEmail,
} = require("../controllers/employeeController")

router.get("/", getEmployees)
router.post("/", addEmployee)
router.get("/:email", getEmployeeByEmail)
router.put("/:email", updateEmployee)
router.delete("/:email", deleteEmployee)

module.exports = router
