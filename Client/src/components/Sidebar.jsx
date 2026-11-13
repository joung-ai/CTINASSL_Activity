import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

const ICONS = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  intake: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4h6v3H9z" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  queue: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  records: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  settings: (
    <>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
      <path d="M16 8l4 4-4 4M20 12H9" />
    </>
  ),
}

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
  { label: 'Patient Intake', to: '/patient-intake', icon: 'intake' },
  { label: 'Queue', icon: 'queue' },
  { label: 'Records', icon: 'records' },
  { label: 'Settings', icon: 'settings' },
  { label: 'Logout', icon: 'logout' },
]

function Icon({ name }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  )
}

function NavItem({ item, variant, onNavigate }) {
  const base = `nav-item nav-item--${variant}`
  const content = (
    <>
      {variant === 'rail' && <Icon name={item.icon} />}
      <span className={variant === 'rail' ? 'sr-only' : undefined}>{item.label}</span>
    </>
  )

  if (item.to) {
    return (
      <NavLink
        to={item.to}
        title={item.label}
        className={({ isActive }) => `${base}${isActive ? ' is-active' : ''}`}
        onClick={onNavigate}
      >
        {content}
      </NavLink>
    )
  }

  return (
    <button type="button" className={`${base} is-disabled`} aria-disabled="true" title={item.label}>
      {content}
      <span className="sr-only"> (not available yet)</span>
    </button>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const closeRef = useRef(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (open) closeRef.current?.focus()
    else if (wasOpen.current) toggleRef.current?.focus()
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="sidebar-slot">
      <nav className={`sidebar${open ? ' sidebar--open' : ''}`} aria-label="Main">
        {open ? (
          <>
            <div className="sidebar__head">
              <p className="sidebar__title">Menu</p>
              <button ref={closeRef} type="button" className="sidebar__close" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <ul className="menu-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <NavItem item={item} variant="row" onNavigate={() => setOpen(false)} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <button
              ref={toggleRef}
              type="button"
              className="sidebar__logo"
              aria-label="Open menu"
              title="Open menu"
              onClick={() => setOpen(true)}
            />
            <ul className="rail-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <NavItem item={item} variant="rail" />
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </div>
  )
}
