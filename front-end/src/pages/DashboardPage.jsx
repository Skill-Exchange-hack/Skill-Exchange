import SkillsList from '../components/SkillsList';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // ユーザーが登録されていない場合はリダイレクト
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      navigate('/register');
    }
  }, [currentUser, navigate]);

  if (!currentUser || !currentUser.id) {
    return <div className="p-5">リダイレクト中...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-60 bg-gray-800 text-white p-5 sticky top-5 self-start max-h-screen overflow-auto rounded-lg">
        <div className="text-2xl font-bold mb-8 text-green-500">スキル交換</div>
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              to="/"
              className="block px-3 py-3 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              🏠 ホーム
            </Link>
          </li>
          <li>
            <Link
              to="/matches"
              className="block px-3 py-3 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              🤝 マッチング
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="block px-3 py-3 rounded-lg bg-green-500 text-white font-semibold"
            >
              📚 スキル一覧
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="block px-3 py-3 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              👤 プロフィール
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="block px-3 py-3 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              ⚙ 設定
            </Link>
          </li>
        </ul>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-white p-8 shadow-md flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">スキル一覧</h1>
        </header>

        <section className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">スキル一覧</h2>
          <SkillsList />
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
