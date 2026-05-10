import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:5000/api/projects'

function Manager() {
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formValue, setFormValue] = useState({
    projectName: '',
    clientName: '',
    startDate: '',
    endDate: '',
    projectId: '',
  })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(API_BASE)
        if (!response.ok) return
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Failed to load projects', error)
      }
    }

    fetchProjects()
  }, [])

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.id - b.id),
    [projects],
  )

  const openModal = () => setShowModal(true)
  const closeModal = () => {
    setShowModal(false)
    setEditingProject(null)
    setFormValue({
      projectName: '',
      clientName: '',
      startDate: '',
      endDate: '',
      projectId: '',
    })
  }

  const openEditModal = (project) => {
    setEditingProject(project)
    setFormValue({
      projectName: project.projectName,
      clientName: project.clientName,
      startDate: project.startDate,
      endDate: project.endDate,
      projectId: project.projectId,
    })
    setShowModal(true)
  }

  const handleAssign = (project) => {
    // Handle assign functionality here
    console.log('Assign project:', project)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValue((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (
      !formValue.projectName.trim() ||
      !formValue.clientName.trim() ||
      !formValue.startDate ||
      !formValue.endDate ||
      !formValue.projectId.trim()
    ) {
      return
    }

    try {
      const isEditing = !!editingProject
      const url = isEditing ? `${API_BASE}/${editingProject.id}` : API_BASE
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValue),
      })

      if (!response.ok) {
        console.error('Project save failed')
        return
      }

      const data = await response.json()

      if (isEditing) {
        setProjects((current) =>
          current.map((p) => (p.id === editingProject.id ? data.project : p))
        )
      } else {
        setProjects((current) => [...current, data.project])
      }

      closeModal()
    } catch (error) {
      console.error('Failed to save project', error)
    }
  }

  return (
    <div className="owner-dashboard">
      <header className="dashboard-header">
        <div className="logo-box">
          <span className="logo-text">KK</span>
          <span className="logo-caption">Manager</span>
        </div>

        <div className="title-group">
          <h1>Projects</h1>
        </div>

        <div className="header-actions">
          <button className="add-button" type="button" onClick={openModal}>
            Add project
          </button>
        </div>
      </header>

      <main className="project-page">
        <div className="project-summary">
          <p className="summary-text">
            Manage your projects from a simple manager dashboard. Add a new project
            to see it appear below in the order it was created.
          </p>
        </div>

        <section className="project-list">
          {sortedProjects.length > 0 ? (
            <div className="project-table">
              <div className="table-header">
                <div className="table-cell header-cell">ID</div>
                <div className="table-cell header-cell">Project Name</div>
                <div className="table-cell header-cell">Client Name</div>
                <div className="table-cell header-cell">Start Date</div>
                <div className="table-cell header-cell">End Date</div>
                <div className="table-cell header-cell">Project ID</div>
                <div className="table-cell header-cell">Actions</div>
                <div className="table-cell header-cell">Assign</div>
              </div>
              {sortedProjects.map((project, index) => (
                <div key={`${project.projectId}-${project.id}`} className="table-row">
                  <div className="table-cell">{index + 1}</div>
                  <div className="table-cell">{project.projectName}</div>
                  <div className="table-cell">{project.clientName || '-'}</div>
                  <div className="table-cell">{project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}</div>
                  <div className="table-cell">{project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}</div>
                  <div className="table-cell">#{project.projectId}</div>
                  <div className="table-cell">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => openEditModal(project)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="table-cell">
                    <button
                      type="button"
                      className="assign-button"
                      onClick={() => handleAssign(project)}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No projects added yet.</p>
              <p>Click the Add project button to create your first one.</p>
            </div>
          )}
        </section>
      </main>

      {showModal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProject ? 'Edit project' : 'Add project'}</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="project-form" onSubmit={handleSubmit}>
              <label>
                Project name
                <input
                  name="projectName"
                  value={formValue.projectName}
                  onChange={handleChange}
                  placeholder="Project name"
                  required
                />
              </label>

              <label>
                Client name
                <input
                  name="clientName"
                  value={formValue.clientName}
                  onChange={handleChange}
                  placeholder="Client name"
                  required
                />
              </label>

              <div className="date-row">
                <label>
                  Start date
                  <input
                    type="date"
                    name="startDate"
                    value={formValue.startDate}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  End date
                  <input
                    type="date"
                    name="endDate"
                    value={formValue.endDate}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <label>
                Project ID
                <input
                  name="projectId"
                  value={formValue.projectId}
                  onChange={handleChange}
                  placeholder="Project ID"
                  required
                />
              </label>

              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {editingProject ? 'Update project' : 'Save project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Manager