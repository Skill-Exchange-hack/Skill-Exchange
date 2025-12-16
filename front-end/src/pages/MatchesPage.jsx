import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function MatchesPage() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [currentUserSkills, setCurrentUserSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ユーザーが登録されていない場合はリダイレクト
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      navigate('/register');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // すべてのユーザーを取得
        const usersRes = await fetch('http://localhost:8000/api/users');
        if (!usersRes.ok) {
          throw new Error(`ユーザー取得エラー: ${usersRes.status}`);
        }
        const usersData = await usersRes.json();
        setAllUsers(usersData.filter((u) => u.id !== currentUser.id));

        // 現在のユーザーのスキル取得
        const skillsRes = await fetch(
          `http://localhost:8000/api/user-skills?user_id=${currentUser.id}`
        );
        if (!skillsRes.ok) {
          throw new Error(`スキル取得エラー: ${skillsRes.status}`);
        }
        const skillsData = await skillsRes.json();
        setCurrentUserSkills(skillsData);

        // 現在のユーザーの欲しいスキル取得
        const desiredRes = await fetch(
          `http://localhost:8000/api/desired-skills?user_id=${currentUser.id}`
        );
        if (!desiredRes.ok) {
          throw new Error(`欲しいスキル取得エラー: ${desiredRes.status}`);
        }

        // マッチング情報取得
        const matchesRes = await fetch(
          'http://localhost:8000/api/user-matches'
        );
        if (!matchesRes.ok) {
          throw new Error(`マッチング取得エラー: ${matchesRes.status}`);
        }
        const matchesData = await matchesRes.json();
        setMatches(matchesData);
      } catch (err) {
        setError('データの取得に失敗しました: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.id) {
      fetchData();
    }
  }, [currentUser.id]);

  const connect = async (user) => {
    try {
      // 最初のスキルを取得（ない場合は1を使用）
      const skillFromUser1 =
        currentUserSkills.length > 0 ? currentUserSkills[0].skill_id : 1;
      const skillFromUser2 = 1;

      const response = await fetch('http://localhost:8000/api/user-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user1_id: currentUser.id,
          user2_id: user.id,
          skill_from_user1: skillFromUser1,
          skill_from_user2: skillFromUser2,
          status: 'pending',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      alert(`✓ ${user.name}さんとマッチしました！`);
    } catch (err) {
      alert('マッチング作成エラー: ' + err.message);
      console.error(err);
    }
  };

  if (!currentUser || !currentUser.id) {
    return <div className="p-5">リダイレクト中...</div>;
  }

  if (loading) return <div className="p-5">読み込み中...</div>;

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
              className="block px-3 py-3 rounded-lg bg-green-500 text-white font-semibold"
            >
              🤝 マッチング
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="block px-3 py-3 rounded-lg text-white hover:bg-gray-700 transition-colors"
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
          <h1 className="text-4xl font-bold text-gray-800">マッチング</h1>
        </header>

        {error && (
          <div className="text-red-600 text-sm p-5 bg-red-50 m-5 rounded-lg">
            {error}
          </div>
        )}

        <section className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ユーザー一覧
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            {allUsers.length === 0 && (
              <p className="text-gray-600">他のユーザーがいません。</p>
            )}
            <ul className="flex flex-col gap-3">
              {allUsers.map((user) => (
                <li
                  key={user.id}
                  className="p-4 rounded-lg border border-green-100 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800 text-base">
                        <strong>{user.name}</strong>
                      </div>
                      <div className="text-sm text-gray-600">
                        登録日:{' '}
                        {new Date(user.created_at).toLocaleDateString('ja-JP')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        onClick={() => connect(user)}
                      >
                        接続
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            マッチング履歴
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <ul className="flex flex-col gap-3">
              {matches.length === 0 && (
                <p className="text-gray-600">まだマッチングはありません。</p>
              )}
              {matches.map((m) => (
                <li
                  key={m.id}
                  className="p-4 rounded-lg border border-green-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm text-gray-600">
                    {new Date(m.created_at).toLocaleDateString('ja-JP')}
                  </div>
                  <div className="font-semibold text-gray-800">
                    ステータス: {m.status}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MatchesPage;
