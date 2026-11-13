import { TRIAGE_LABELS } from '../data/patients.js'

// Number in a colored square plus the level name, so color is never the only signal.
export default function TriageLevel({ level }) {
  return (
    <span className="level">
      <span className={`level__box level__box--${level}`} aria-hidden="true">
        {level}
      </span>
      <span>
        <span className="sr-only">Level {level}, </span>
        {TRIAGE_LABELS[level]}
      </span>
    </span>
  )
}
