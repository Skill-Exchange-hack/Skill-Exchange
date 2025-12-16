import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navigation() {
  const location = useLocation();
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

  return (
    <nav className="flex justify-between items-center bg-gray-900 px-8 py-4 shadow-lg mb-5">
      <div className="text-2xl font-bold text-green-500">スキル交換</div>
      <div className="flex gap-5">
        <Link
          to="/"
          className={`px-4 py-2 rounded-md transition-all ${
            isActive('/')
              ? 'bg-green-500 text-white'
              : 'text-white hover:bg-green-500/20'
          }`}
        >
          ホーム
        </Link>
        <Link
          to="/matches"
          className={`px-4 py-2 rounded-md transition-all ${
            isActive('/matches')
              ? 'bg-green-500 text-white'
              : 'text-white hover:bg-green-500/20'
          }`}
        >
          マッチング
        </Link>
        <Link
          to="/dashboard"
          className={`px-4 py-2 rounded-md transition-all ${
            isActive('/dashboard')
              ? 'bg-green-500 text-white'
              : 'text-white hover:bg-green-500/20'
          }`}
        >
          スキル一覧
        </Link>
        <Link
          to="/profile"
          className={`px-4 py-2 rounded-md transition-all ${
            isActive('/profile')
              ? 'bg-green-500 text-white'
              : 'text-white hover:bg-green-500/20'
          }`}
        >
          プロフィール
        </Link>
        <Link
          to="/settings"
          className={`px-4 py-2 rounded-md transition-all ${
            isActive('/settings')
              ? 'bg-green-500 text-white'
              : 'text-white hover:bg-green-500/20'
          }`}
        >
          設定
        </Link>
        {currentUser && (
          <span className="px-4 py-2 text-white">👤 {currentUser.name}</span>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
