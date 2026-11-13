import { Link } from 'react-router-dom'
import TriageLevel from './TriageLevel.jsx'
import { LONG_WAIT_MINUTES, formatWait, minutesSince } from '../utils/patients.js'

export default function NextToCall({ patient, now, onCall }) {
  const minutes = patient ? minutesSince(patient.arrivedAt, now) : 0

  return (
    <section className="next" aria-labelledby="next-heading">
      <h2 id="next-heading" className="next__title">
        Next to call
      </h2>
      <div className="next__row">
        {patient ? (
          <>
            <p className="next__queue num">{patient.queueNo}</p>
            <div>
              <p className="next__name">{patient.name}</p>
              <p>
                {patient.age} · {patient.sex}
              </p>
            </div>
            <p className="next__complaint">{patient.complaint}</p>
            <TriageLevel level={patient.level} />
            <p className={`num next__wait${minutes >= LONG_WAIT_MINUTES ? ' wait--long' : ''}`}>
              {formatWait(minutes)} waiting
            </p>
          </>
        ) : (
          <p className="next__empty">No patients waiting.</p>
        )}
        <div className="next__actions">
          {patient && (
            <button type="button" className="btn btn--primary" onClick={() => onCall(patient.id)}>
              Call patient
            </button>
          )}
          <Link to="/patient-intake" className="text-link">
            Open intake list
          </Link>
        </div>
      </div>
    </section>
  )
}
