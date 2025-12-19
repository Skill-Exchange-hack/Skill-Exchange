import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

function HomePage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const [matches, setMatches] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [stats, setStats] = useState({
    userSkillsCount: 0,
    desiredSkillsCount: 0,
    matchesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ユーザーが登録されていない場合はリダイレクト
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      navigate('/register');
    }
  }, [currentUser.id, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // マッチング情報を取得
        const matchRes = await fetch(`http://localhost:8000/api/user-matches`);
        if (!matchRes.ok) {
          throw new Error(`マッチング取得エラー: ${matchRes.status}`);
        }
        const matchData = await matchRes.json();
        setMatches(matchData);

        // ユーザースキルを取得
        const userSkillsRes = await fetch(
          `http://localhost:8000/api/user-skills?user_id=${currentUser.id}`
        );
        const userSkillsData = userSkillsRes.ok
          ? await userSkillsRes.json()
          : [];

        // 希望スキルを取得
        const desiredSkillsRes = await fetch(
          `http://localhost:8000/api/desired-skills?user_id=${currentUser.id}`
        );
        const desiredSkillsData = desiredSkillsRes.ok
          ? await desiredSkillsRes.json()
          : [];

        // チャットメッセージを取得
        const messagesRes = await fetch(
          `http://localhost:8000/api/chat-messages/latest`
        );
        const messagesData = messagesRes.ok ? await messagesRes.json() : [];

        setStats({
          userSkillsCount: Array.isArray(userSkillsData)
            ? userSkillsData.length
            : 0,
          desiredSkillsCount: Array.isArray(desiredSkillsData)
            ? desiredSkillsData.length
            : 0,
          matchesCount: Array.isArray(matchData) ? matchData.length : 0,
        });

        setRecentMessages(
          Array.isArray(messagesData) ? messagesData.slice(0, 5) : []
        );
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError('データの取得に失敗しました。もう一度試してください。');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.id) {
      fetchData();
    }
  }, [currentUser.id]);

  if (!currentUser || !currentUser.id) {
    return <div className="p-5">リダイレクト中...</div>;
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <main className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <header className="bg-white/95 backdrop-blur p-8 shadow-lg border-b border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                ようこそ！
              </h1>
              <p className="text-lg text-slate-600">
                {currentUser.name}さんのスキル交換ダッシュボード
              </p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              👤 プロフィール
            </button>
          </div>
        </header>

        {error && (
          <div className="text-red-600 text-sm p-4 bg-red-50/95 mx-8 mt-6 rounded-lg border border-red-200 backdrop-blur">
            {error}
          </div>
        )}

        <div className="p-8">
          {/* 統計カード */}
          <StatisticsCards stats={stats} currentUser={currentUser} />

          {/* クイックアクション */}
          <QuickActions navigate={navigate} />

          {/* 最近のマッチング */}
          <section className="mt-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              ✨ 最近のマッチング
            </h2>
            <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-lg border border-slate-200 min-h-52">
              <RecentMatches matches={matches} currentUser={currentUser} />
            </div>
          </section>

          {/* 最新のチャット */}
          {recentMessages.length > 0 && (
            <section className="mt-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                💬 最新のチャット
              </h2>
              <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-lg border border-slate-200">
                <RecentMessages messages={recentMessages} navigate={navigate} />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

// 統計カード表示コンポーネント
function StatisticsCards({ stats, currentUser }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white/95 backdrop-blur p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">登録済みスキル</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {stats.userSkillsCount}
            </p>
          </div>
          <div className="text-5xl">🎯</div>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">求めてるスキル</p>
            <p className="text-4xl font-bold text-cyan-600 mt-2">
              {stats.desiredSkillsCount}
            </p>
          </div>
          <div className="text-5xl">🔍</div>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">マッチング数</p>
            <p className="text-4xl font-bold text-emerald-600 mt-2">
              {stats.matchesCount}
            </p>
          </div>
          <div className="text-5xl">🤝</div>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">ユーザー情報</p>
            <p className="text-2xl font-bold text-slate-700 mt-2">
              {currentUser.name}
            </p>
          </div>
          <div className="text-5xl">👤</div>
        </div>
      </div>
    </div>
  );
}

// クイックアクションボタンコンポーネント
function QuickActions({ navigate }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-slate-800 mb-4">
        クイックアクション
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/profile"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center block"
        >
          <span className="text-2xl block mb-2">📝</span>
          スキルを編集
        </Link>

        <Link
          to="/matches"
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
        >
          <span className="text-2xl block mb-2">🔗</span>
          マッチング探す
        </Link>

        <Link
          to="/chat-rooms"
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
        >
          <span className="text-2xl block mb-2">💬</span>
          チャットする
        </Link>

        <Link
          to="/dashboard"
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
        >
          <span className="text-2xl block mb-2">📚</span>
          スキル一覧
        </Link>
      </div>
    </div>
  );
}

// 最近のマッチング表示コンポーネント
function RecentMatches({ matches, currentUser }) {
  if (!matches || matches.length === 0) {
    return (
      <p className="text-slate-500 text-center py-8 text-lg">
        📭 まだマッチングはありません。
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {matches.map((m) => {
        // 相手ユーザーを特定
        const otherUser = m.user1_id === currentUser.id ? m.user2 : m.user1;

        return (
          <li
            key={m.id}
            className="p-5 rounded-lg border border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-sm text-slate-500 mb-2">
                  📅 {new Date(m.created_at).toLocaleDateString('ja-JP')}
                </div>
                <div className="text-lg font-semibold text-slate-800 mb-2">
                  相手:{' '}
                  <span className="text-blue-600">👤 {otherUser.name}</span>
                </div>
                <div className="text-lg font-semibold text-slate-800">
                  ステータス:{' '}
                  <span
                    className={`font-bold ${
                      m.status === 'accepted'
                        ? 'text-emerald-600'
                        : m.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {m.status === 'accepted'
                      ? '✅ 承認済み'
                      : m.status === 'pending'
                      ? '⏳ 保留中'
                      : '❌ ' + m.status}
                  </span>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// 最新のチャットメッセージ表示コンポーネント
function RecentMessages({ messages, navigate }) {
  if (!messages || messages.length === 0) {
    return (
      <p className="text-slate-500 text-center text-lg">
        💭 最新のメッセージはありません。
      </p>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all duration-300 cursor-pointer"
          onClick={() => navigate('/chat')}
        >
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-slate-800 truncate">
              {msg.sender_name || 'ユーザー'}
            </p>
            <span className="text-xs text-slate-500">
              {new Date(msg.created_at).toLocaleTimeString('ja-JP')}
            </span>
          </div>
          <p className="text-slate-600 text-sm truncate">{msg.message}</p>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
