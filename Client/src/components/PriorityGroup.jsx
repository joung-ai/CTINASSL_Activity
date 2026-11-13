import { LONG_WAIT_MINUTES, formatWait, minutesSince } from '../utils/patients.js'

export default function PriorityGroup({ group, patients, now }) {
  return (
    <section className={`group group--${group.key}`} aria-labelledby={`group-${group.key}`}>
      <div className="group__head">
        <p className="group__circle" aria-hidden="true">
          <span className="group__count num">{patients.length}</span>
        </p>
        <div>
          <h3 id={`group-${group.key}`} className="group__name">
            {group.name}
          </h3>
          <p className="group__levels">
            {group.levels} · {patients.length} waiting
          </p>
        </div>
      </div>

      {patients.length === 0 ? (
        <p className="group__empty">None waiting.</p>
      ) : (
        <ul className="group__list">
          {patients.map((patient) => {
            const minutes = minutesSince(patient.arrivedAt, now)
            return (
              <li key={patient.id}>
                <span className="num">{patient.queueNo}</span>
                <span>{patient.name}</span>
                <span className={`num group__wait${minutes >= LONG_WAIT_MINUTES ? ' wait--long' : ''}`}>
                  {formatWait(minutes)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
