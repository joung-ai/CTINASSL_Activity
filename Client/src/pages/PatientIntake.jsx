import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import TriageLevel from '../components/TriageLevel.jsx'
import { STATUSES } from '../data/patients.js'
import useNow from '../hooks/useNow.js'
import { LONG_WAIT_MINUTES, byAcuity, formatTime, formatWait, minutesSince } from '../utils/patients.js'

const FILTERS = ['All', ...STATUSES]

function StatusLine({ patient, now }) {
  if (patient.status === 'Waiting') {
    const minutes = minutesSince(patient.arrivedAt, now)
    return (
      <span className={minutes >= LONG_WAIT_MINUTES ? 'wait--long' : undefined}>
        Waiting {formatWait(minutes)}
      </span>
    )
  }
  if (patient.status === 'In assessment') return <span className="status--active">In assessment</span>
  return <span>{patient.status}</span>
}

export default function PatientIntake() {
  const { patients } = useOutletContext()
  const now = useNow()
  const [filter, setFilter] = useState('All')

  const sorted = [...patients].sort(byAcuity)
  const rows = filter === 'All' ? sorted : sorted.filter((p) => p.status === filter)
  const countFor = (name) => (name === 'All' ? sorted.length : sorted.filter((p) => p.status === name).length)

  return (
    <div className="intake">
      <div className="intake__inner">
        <div className="intake__head">
          <div>
            <h1 className="intake__title">Patient intake</h1>
            <p className="intake__sub">Sorted by triage level, then arrival time.</p>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            aria-disabled="true"
            title="The intake form is not built yet"
          >
            New intake
          </button>
        </div>

        <div className="segmented" role="group" aria-label="Filter by status">
          {FILTERS.map((name) => (
            <button
              key={name}
              type="button"
              className="segmented__button"
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
            >
              {name} <span className="num">{countFor(name)}</span>
            </button>
          ))}
        </div>

        <div className="intake__panel">
          <table className="intake-table">
            <caption className="sr-only">Patients in the ER, sorted by triage level then arrival time</caption>
            <colgroup>
              <col style={{ width: '27%' }} />
              <col style={{ width: '31%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '17%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Chief complaint</th>
                <th scope="col">Triage level</th>
                <th scope="col" className="intake-table__right">
                  Arrived
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="intake-table__empty">
                    {filter === 'All' ? 'No patients in the queue.' : `No patients with status ${filter}.`}
                  </td>
                </tr>
              ) : (
                rows.map((patient) => (
                  <tr key={patient.id}>
                    <th scope="row">
                      <span className="patient__name">{patient.name}</span>
                      <span className="patient__meta">
                        <span className="num">{patient.queueNo}</span> · {patient.age} · {patient.sex}
                      </span>
                    </th>
                    <td>{patient.complaint}</td>
                    <td>
                      <TriageLevel level={patient.level} />
                    </td>
                    <td className="intake-table__right">
                      <span className="patient__name num">{formatTime(patient.arrivedAt)}</span>
                      <span className="patient__meta">
                        <StatusLine patient={patient} now={now} />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
