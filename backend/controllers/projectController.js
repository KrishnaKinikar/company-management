const db = require("../config/db")

const addProject = (req, res) => {
  const { projectName, clientName, startDate, endDate, projectId } = req.body

  if (
    !projectName ||
    !clientName ||
    !startDate ||
    !endDate ||
    !projectId
  ) {
    return res.status(400).json({ message: "All project fields are required" })
  }

  const query =
    "INSERT INTO project_names (project_name, client_name, start_date, end_date, project_id) VALUES (?, ?, ?, ?, ?)"

  db.query(
    query,
    [projectName, clientName, startDate, endDate, projectId],
    (err, result) => {
      if (err) {
        console.error("Project insert error:", err)
        return res.status(500).json({ message: "Failed to save project", error: err })
      }

      res.status(201).json({
        message: "Project saved successfully",
        project: {
          id: result.insertId,
          projectName,
          clientName,
          startDate,
          endDate,
          projectId,
        },
      })
    },
  )
}

const getProjects = (req, res) => {
  const query = "SELECT * FROM project_names ORDER BY id ASC"

  db.query(query, (err, results) => {
    if (err) {
      console.error("Project fetch error:", err)
      return res.status(500).json({ message: "Failed to fetch projects", error: err })
    }

    const transformedResults = results.map((row) => ({
      id: row.id,
      projectId: row.project_id,
      projectName: row.project_name,
      clientName: row.client_name,
      startDate: row.start_date,
      endDate: row.end_date,
      createdAt: row.created_at,
    }))

    res.status(200).json(transformedResults)
  })
}

const updateProject = (req, res) => {
  const { id } = req.params
  const { projectName, clientName, startDate, endDate, projectId } = req.body

  if (
    !projectName ||
    !clientName ||
    !startDate ||
    !endDate ||
    !projectId
  ) {
    return res.status(400).json({ message: "All project fields are required" })
  }

  const query =
    "UPDATE project_names SET project_name = ?, client_name = ?, start_date = ?, end_date = ?, project_id = ? WHERE id = ?"

  db.query(
    query,
    [projectName, clientName, startDate, endDate, projectId, id],
    (err, result) => {
      if (err) {
        console.error("Project update error:", err)
        return res.status(500).json({ message: "Failed to update project", error: err })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Project not found" })
      }

      res.status(200).json({
        message: "Project updated successfully",
        project: {
          id: parseInt(id),
          projectName,
          clientName,
          startDate,
          endDate,
          projectId,
        },
      })
    },
  )
}

module.exports = { addProject, getProjects, updateProject }
