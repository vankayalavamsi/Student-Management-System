import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/students', label: 'Students', icon: '👥', end: true },
  { to: '/students/add', label: 'Add Student', icon: '➕' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar({ open, onClose, onLogout }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">🎓 Student MS</div>

      <nav className="sidebar-nav">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose} /* close the mobile sidebar after selecting */
          >
            <span className="sidebar-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>⏻ Logout</button>
      </div>
    </aside>
  );
}