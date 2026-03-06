import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',          icon: '🏠', label: 'Home' },
  { to: '/patient',   icon: '🔍', label: 'Patient Search' },
  { to: '/admin',     icon: '📊', label: 'Admin Dashboard' },
  { to: '/verify',    icon: '🔐', label: 'Verify Record' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        ❤️‍🩺 <span>HealthTrack</span>
      </div>
      <nav>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">Healthcare Vitals v1.0</div>
    </aside>
  );
}
