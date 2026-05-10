const express = require("express")
const router = express.Router()

const { addProject, getProjects, updateProject } = require("../controllers/projectController")

router.get("/", getProjects)
router.post("/", addProject)
router.put("/:id", updateProject)

module.exports = router
