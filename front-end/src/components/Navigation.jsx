import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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

  // update user state when route changes
  useEffect(() => {
    try {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
    } catch {
      setCurrentUser(null);
    }
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/register');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-5 shadow-2xl sticky top-0 z-50 border-b border-slate-700">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          スキル交換
        </div>
        <div className="flex gap-1">
          <Link
            to="/"
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive('/')
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            🏠 ホーム
          </Link>
          <Link
            to="/matches"
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive('/matches')
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            🤝 マッチング
          </Link>
          <Link
            to="/dashboard"
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive('/dashboard')
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            📚 スキル一覧
          </Link>
          <Link
            to="/profile"
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive('/profile')
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            👤 プロフィール
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-lg font-medium transition-all duration-300 text-gray-300 hover:text-white hover:bg-red-500/20 bg-red-500/10 border border-red-500/30"
          >
            🚪 ログアウト
          </button>
        </div>
        {currentUser && (
          <div className="flex items-center gap-3 text-gray-300">
            <span className="text-sm font-medium">👤 {currentUser.name}</span>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
