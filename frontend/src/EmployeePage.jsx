import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

const EMPLOYEE_API = 'http://localhost:5000/api/employees'

function EmployeePage() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true)
      try {
        const response = await fetch(EMPLOYEE_API)
        if (!response.ok) {
          console.error('Failed to load employees')
          setEmployees([])
          return
        }

        const data = await response.json()
        setEmployees(data.employees || [])
      } catch (error) {
        console.error('Failed to load employees', error)
        setEmployees([])
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const sortedEmployees = useMemo(
    () => [...employees].sort((a, b) => (a.id || 0) - (b.id || 0)),
    [employees],
  )

  return (
    <div className="owner-dashboard">
      <header className="dashboard-header">
        <div className="logo-box">
          <span className="logo-text">KK</span>
          <span className="logo-caption">Employees</span>
        </div>

        <div className="title-group">
          <h1>Employee Details</h1>
        </div>

        <div className="header-actions">
          <button type="button" className="view-switch-button" onClick={() => navigate('/manager')}>
            Back
          </button>
        </div>
      </header>

      <main className="project-page">
        <div className="project-summary">
          <p className="summary-text">
            This page shows all employees with their email, phone number, client name, and project name.
          </p>
        </div>

        <section className="project-list">
          {loading ? (
            <div className="empty-state">
              <p>Loading employees...</p>
            </div>
          ) : sortedEmployees.length > 0 ? (
            <div className="project-table">
              <div className="employee-row header-row">
                <div className="employee-cell header-cell">ID</div>
                <div className="employee-cell header-cell">Employee Name</div>
                <div className="employee-cell header-cell">Email</div>
                <div className="employee-cell header-cell">Phone Number</div>
                <div className="employee-cell header-cell">Client Name</div>
                <div className="employee-cell header-cell">Project Name</div>
                <div className="employee-cell header-cell">Project ID</div>
              </div>
              {sortedEmployees.map((employee, index) => (
                <div key={employee.email || index} className="employee-row">
                  <div className="employee-cell">{employee.id || index + 1}</div>
                  <div className="employee-cell">{employee.employee_name || '-'}</div>
                  <div className="employee-cell">{employee.email || '-'}</div>
                  <div className="employee-cell">{employee.phone_number || '-'}</div>
                  <div className="employee-cell">{employee.client_name || '-'}</div>
                  <div className="employee-cell">{employee.project_name || '-'}</div>
                  <div className="employee-cell">{employee.project_id || '-'}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No employees found.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default EmployeePage
