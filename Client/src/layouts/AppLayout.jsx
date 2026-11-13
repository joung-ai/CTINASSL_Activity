import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { patients as initialPatients } from '../data/patients.js'

export default function AppLayout() {
  // Held here so "Call patient" on the dashboard shows up on the intake list too.
  // Not persisted: a reload goes back to the data file.
  const [patients, setPatients] = useState(initialPatients)

  const callPatient = (id) =>
    setPatients((list) => list.map((p) => (p.id === id ? { ...p, status: 'In assessment' } : p)))

  return (
    <div className="app">
      <Sidebar />
      <main className="app__main">
        <Outlet context={{ patients, callPatient }} />
      </main>
    </div>
  )
}
