import '../styles/Navigation.css';

function Navigation({ onNavigate, currentPage }) {
  return (
    <nav className="navigation">
      <div className="nav-brand">スキル交換</div>
      <div className="nav-links">
        <button 
          className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          ホーム
        </button>
        <button 
          className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => onNavigate('profile')}
        >
          プロフィール
        </button>
        <button 
          className={`nav-link ${currentPage === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          設定
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
