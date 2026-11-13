import { useOutletContext } from 'react-router-dom'
import NextToCall from '../components/NextToCall.jsx'
import PriorityGroup from '../components/PriorityGroup.jsx'
import TriageLevel from '../components/TriageLevel.jsx'
import { FACILITY_NAME, TRIAGE_NURSE } from '../data/patients.js'
import useNow from '../hooks/useNow.js'
import { byAcuity, currentShift, formatTime } from '../utils/patients.js'

const GROUPS = [
  { key: 'critical', name: 'Critical', levels: 'Levels 1–2', match: [1, 2] },
  { key: 'urgent', name: 'Urgent', levels: 'Level 3', match: [3] },
  { key: 'routine', name: 'Routine', levels: 'Levels 4–5', match: [4, 5] },
]

const LATEST_COUNT = 6

export default function Dashboard() {
  const { patients, callPatient } = useOutletContext()
  const now = useNow()

  const waiting = patients.filter((p) => p.status === 'Waiting').sort(byAcuity)
  const inAssessment = patients.filter((p) => p.status === 'In assessment').length
  const referred = patients.filter((p) => p.status === 'Referred').length
  const latest = [...patients]
    .sort((a, b) => new Date(b.arrivedAt) - new Date(a.arrivedAt))
    .slice(0, LATEST_COUNT)

  const date = now.toLocaleDateString('en-PH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const meta = [date, currentShift(now), TRIAGE_NURSE && `Triage nurse: ${TRIAGE_NURSE}`]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="dashboard">
      <header className="dash-head">
        <div className="dash-head__top">
          <h1 className="dash-head__title">{FACILITY_NAME}</h1>
          <p className="dash-head__time num" aria-label="Current time">
            {formatTime(now)}
          </p>
        </div>
        <p className="dash-head__meta">{meta}</p>
        <p className="dash-head__summary">
          <strong className="dash-head__big num">{waiting.length}</strong> waiting to be seen,{' '}
          <strong>{inAssessment}</strong> in assessment, <strong>{referred}</strong> referred out tonight.
        </p>
      </header>

      <NextToCall patient={waiting[0]} now={now} onCall={callPatient} />

      <section className="priority" aria-labelledby="priority-heading">
        <h2 id="priority-heading" className="section-title">
          Waiting by priority
        </h2>
        <div className="priority__groups">
          {GROUPS.map((group) => (
            <PriorityGroup
              key={group.key}
              group={group}
              patients={waiting.filter((p) => group.match.includes(p.level))}
              now={now}
            />
          ))}
        </div>
      </section>

      <section className="arrivals" aria-labelledby="arrivals-heading">
        <h2 id="arrivals-heading" className="section-title">
          Latest arrivals
        </h2>
        {latest.length === 0 ? (
          <p className="arrivals__empty">No arrivals yet.</p>
        ) : (
          <ul className="arrivals__list">
            {latest.map((patient) => (
              <li key={patient.id}>
                <span className="num arrivals__time">{formatTime(patient.arrivedAt)}</span>
                <span className="num">{patient.queueNo}</span>
                <span className="arrivals__name">{patient.name}</span>
                <span>{patient.complaint}</span>
                <TriageLevel level={patient.level} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
