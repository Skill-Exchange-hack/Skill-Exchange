import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [user, setUser] = useState(currentUser);
  const [skills, setSkills] = useState([]);
  const [desired, setDesired] = useState([]);
  const [editing, setEditing] = useState(false);
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

        // ユーザー情報取得
        const userRes = await fetch(
          `http://localhost:8000/api/users/${currentUser.id}`
        );
        if (!userRes.ok) {
          throw new Error(`HTTP ${userRes.status}: ${userRes.statusText}`);
        }
        const userData = await userRes.json();
        setUser(userData);

        // スキル取得
        const skillsRes = await fetch(
          `http://localhost:8000/api/user-skills?user_id=${currentUser.id}`
        );
        if (!skillsRes.ok) {
          throw new Error(`スキル取得エラー: ${skillsRes.status}`);
        }
        const skillsData = await skillsRes.json();
        setSkills(skillsData);

        // 欲しいスキル取得
        const desiredRes = await fetch(
          `http://localhost:8000/api/desired-skills?user_id=${currentUser.id}`
        );
        if (!desiredRes.ok) {
          throw new Error(`欲しいスキル取得エラー: ${desiredRes.status}`);
        }
        const desiredData = await desiredRes.json();
        setDesired(desiredData);
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

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError('プロフィール更新に失敗しました: ' + err.message);
    }
  };

  if (!currentUser || !currentUser.id) {
    return <div className="p-5">リダイレクト中...</div>;
  }

  if (loading) return <div className="p-5">読み込み中...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-subtle min-h-screen">
      <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl p-10 mb-8 animate-slide-up">
        <div className="flex items-center gap-10">
          <div className="text-8xl min-w-fit text-center">👤</div>
          <div className="flex-1">
            {editing ? (
              <input
                className="text-4xl font-bold border-2 border-emerald-500 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-cyan-500"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            ) : (
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">{user.name}</h1>
            )}
            <p className="text-slate-600 text-lg">ユーザーID: <span className="font-semibold text-slate-800">{user.id}</span></p>
          </div>
          {editing ? (
            <div className="flex gap-3">
              <button
                className="bg-gradient-primary hover:shadow-lg text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                onClick={handleSaveProfile}
              >
                ✓ 保存
              </button>
              <button
                className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                onClick={() => {
                  setEditing(false);
                  setUser(currentUser);
                }}
              >
                ✕ キャンセル
              </button>
            </div>
          ) : (
            <button
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              onClick={() => setEditing(true)}
            >
              ✏ 編集
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {error && (
          <div className="text-red-600 text-sm p-5 bg-red-50/95 rounded-xl border border-red-200 backdrop-blur">
            {error}
          </div>
        )}

        <section className="bg-white/95 backdrop-blur border border-slate-200 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            🎓 自分のスキル（教えられる）
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.length === 0 ? (
              <p className="text-slate-500 text-lg">スキルが登録されていません。</p>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} className="animate-fade-in">
                  <span className="inline-block px-5 py-2 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 rounded-full text-sm font-bold border-2 border-emerald-300 shadow-md hover:shadow-lg transition-all transform hover:scale-110">
                    {skill.skill ? skill.skill.name : skill.name} 
                    <span className="ml-2 text-emerald-600 font-bold">Lv{skill.level || '?'}</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white/95 backdrop-blur border border-slate-200 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            🚀 習得したいスキル（教わりたい）
          </h2>
          <div className="flex flex-wrap gap-3">
            {desired.length === 0 ? (
              <p className="text-slate-500 text-lg">習得したいスキルがありません。</p>
            ) : (
              desired.map((d) => (
                <div key={d.id} className="animate-fade-in">
                  <span className="inline-block px-5 py-2 bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-800 rounded-full text-sm font-bold border-2 border-cyan-300 shadow-md hover:shadow-lg transition-all transform hover:scale-110">
                    {d.skill ? d.skill.name : d.name} 
                    <span className="ml-2 text-cyan-600 font-bold">優先度{d.priority}</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white/95 backdrop-blur border border-slate-200 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">📅 登録日</h2>
          <p className="text-slate-700 text-lg font-medium">
            {new Date(user.created_at).toLocaleDateString('ja-JP')}
          </p>
        </section>
      </div>
    </div>
  );
}

export default Profile;
