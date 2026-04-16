import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const initialForm = {
  empCode: "",
  name: "",
  team: "",
  email: "",
  phone: "",
  manager: "",
  joinDate: "",
  lastWorkingDate: "",
  status: "ACTIVE",
  reason: "",
  remarks: "",
};

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  const activeCount = useMemo(
    () => employees.filter((e) => (e.status || "").toUpperCase() === "ACTIVE").length,
    [employees]
  );

  async function loadEmployees() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message || "Unable to load employees");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Failed to add employee");
      }

      setForm(initialForm);
      await loadEmployees();
    } catch (err) {
      setError(err.message || "Unable to create employee");
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>SimpleITDesk</h1>
        <p>Google-Sheets-backed user inventory app.</p>
        <div className="stats">
          <div>
            <strong>{employees.length}</strong>
            <span>Total Employees</span>
          </div>
          <div>
            <strong>{activeCount}</strong>
            <span>Active</span>
          </div>
          <div>
            <strong>{employees.length - activeCount}</strong>
            <span>Inactive</span>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Add Employee</h2>
        <form className="grid" onSubmit={handleSubmit}>
          {Object.entries(form).map(([key, value]) => (
            <label key={key}>
              <span>{key}</span>
              {key.includes("Date") ? (
                <input
                  type="date"
                  value={value}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              ) : key === "status" ? (
                <select
                  value={value}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                >
                  <option>ACTIVE</option>
                  <option>INACTIVE</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              )}
            </label>
          ))}
          <button type="submit">Save to Sheet</button>
        </form>
      </section>

      <section className="card">
        <h2>Employees</h2>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Emp Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Team</th>
                <th>Phone</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={`${employee.empCode}-${index}`}>
                  <td>{employee.empCode}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.team}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.manager}</td>
                  <td>{employee.status}</td>
                  <td>{employee.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
