export default function Header({ user, onMenuClick, onLogout, theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger: hidden on desktop, visible on mobile */}
        <button className="hamburger" onClick={onMenuClick} aria-label="Open menu">☰</button>
        <span className="header-title">Student Management</span>
      </div>
      <div className="header-right">
        {/* Dark / Light mode toggle */}
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <span className="header-user">{user?.name}</span>
        <button className="btn btn-outline btn-sm" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}