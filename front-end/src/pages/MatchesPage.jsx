import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

function MatchesPage() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [currentUserSkills, setCurrentUserSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [userSkillsMap, setUserSkillsMap] = useState({});
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
        const otherUsers = usersData.filter((u) => u.id !== currentUser.id);
        setAllUsers(otherUsers);

        // すべてのスキルを取得
        const allSkillsRes = await fetch('http://localhost:8000/api/skills');
        if (!allSkillsRes.ok) {
          throw new Error(`スキル一覧取得エラー: ${allSkillsRes.status}`);
        }
        const allSkillsData = await allSkillsRes.json();
        const skillMap = {};
        allSkillsData.forEach((skill) => {
          skillMap[skill.id] = skill;
        });

        // 各ユーザーのスキルを取得
        const userSkillsMapTemp = {};
        for (const user of otherUsers) {
          const skillRes = await fetch(
            `http://localhost:8000/api/user-skills?user_id=${user.id}`
          );
          if (skillRes.ok) {
            const skillData = await skillRes.json();
            userSkillsMapTemp[user.id] = skillData.map((us) => ({
              ...us,
              skill: skillMap[us.skill_id] || { name: '不明', category: '' },
            }));
          }
        }
        setUserSkillsMap(userSkillsMapTemp);

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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-subtle">
      <main className="flex-1 flex flex-col">
        <header className="bg-white/95 backdrop-blur p-8 shadow-lg border-b border-slate-200">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            🤝 マッチング
          </h1>
          <p className="text-slate-600 mt-2">
            他のユーザーとスキルを交換しましょう
          </p>
        </header>

        {error && (
          <div className="text-red-600 text-sm p-5 bg-red-50/95 m-5 rounded-xl border border-red-200 backdrop-blur font-semibold">
            {error}
          </div>
        )}

        <section className="p-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            ✨ ユーザー一覧
          </h2>
          <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-lg border border-slate-200">
            {allUsers.length === 0 && (
              <p className="text-slate-500 text-center py-8 text-lg">
                👥 他のユーザーがいません。
              </p>
            )}
            <ul className="flex flex-col gap-4">
              {allUsers.map((user) => (
                <li
                  key={user.id}
                  className="p-6 rounded-xl border-2 border-slate-200 bg-white hover:shadow-lg hover:border-emerald-300 transition-all duration-300 animate-fade-in"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg">
                        👤 {user.name}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        📅 登録日:{' '}
                        {new Date(user.created_at).toLocaleDateString('ja-JP')}
                      </div>
                      {userSkillsMap[user.id] &&
                        userSkillsMap[user.id].length > 0 && (
                          <div className="mt-3">
                            <div className="text-sm font-semibold text-slate-700 mb-2">
                              💡 保有スキル:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {userSkillsMap[user.id].map((userSkill) => (
                                <span
                                  key={userSkill.id}
                                  className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium"
                                >
                                  {userSkill.skill?.name || 'スキル'} (Lv.
                                  {userSkill.level})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                    <button
                      className="bg-gradient-primary hover:shadow-lg text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md ml-4 whitespace-nowrap"
                      onClick={() => connect(user)}
                    >
                      🔗 接続
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-6">
            📋 マッチング履歴
          </h2>
          <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-lg border border-slate-200">
            <ul className="flex flex-col gap-4">
              {matches.length === 0 && (
                <p className="text-slate-500 text-center py-8 text-lg">
                  📭 まだマッチングはありません。
                </p>
              )}
              {matches.map((m) => (
                <li
                  key={m.id}
                  className="p-4 rounded-xl border-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 hover:shadow-md transition-all animate-fade-in"
                >
                  <div className="text-sm text-slate-600">
                    📅 {new Date(m.created_at).toLocaleDateString('ja-JP')}
                  </div>
                  <div className="font-semibold text-slate-800">
                    ステータス:{' '}
                    <span className="text-cyan-600">{m.status}</span>
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
