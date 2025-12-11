import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-brand">スキル交換</div>
      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          ホーム
        </Link>
        <Link
          to="/dashboard"
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          ダッシュボード
        </Link>
        <Link 
          to="/profile" 
          className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
        >
          プロフィール
        </Link>
        <Link 
          to="/settings" 
          className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
        >
          設定
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
