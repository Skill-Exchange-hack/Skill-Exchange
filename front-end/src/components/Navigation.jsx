import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Navigation.css';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser'));
    } catch {
      return null;
    }
  });

  // update user state when route changes (login redirects will update nav)
  useEffect(() => {
    try {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
    } catch {
      setCurrentUser(null);
    }
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    try { localStorage.removeItem('currentUser'); } catch {}
    setCurrentUser(null);
    navigate('/login');
  };

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
          to="/matches"
          className={`nav-link ${isActive('/matches') ? 'active' : ''}`}
        >
          マッチング
        </Link>
        <Link
          to="/dashboard"
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          スキル一覧
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
        {currentUser ? (
          <button onClick={logout} className={`nav-link nav-link--logout`}>ログアウト</button>
        ) : (
          <Link to="/login" className={`nav-link nav-link--login ${isActive('/login') ? 'active' : ''}`}>
            ログイン
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
