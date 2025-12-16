import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

// プログラミング言語キーと skill_id のマッピング
const LANGUAGE_SKILL_MAP = {
  javascript: 1,
  python: 2,
  java: 3,
  csharp: 4,
  cpp: 5,
  php: 6,
  ruby: 7,
  go: 8,
  rust: 9,
  typescript: 10,
  kotlin: 11,
  swift: 12,
};

function Profile() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [user, setUser] = useState(currentUser);
  const [skills, setSkills] = useState([]);
  const [desired, setDesired] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const [showAddDesiredForm, setShowAddDesiredForm] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skill_id: '',
    level: '初級',
    description: '',
  });
  const [newDesired, setNewDesired] = useState({ skill_id: '', priority: 1 });

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

        // スキル一覧を取得
        console.log('Fetching /api/skills...');
        const allSkillsRes = await fetch('http://localhost:8000/api/skills');
        console.log('Skills response:', allSkillsRes.status);
        if (!allSkillsRes.ok) {
          const errorData = await allSkillsRes.json().catch(() => ({}));
          console.error('Skills error:', errorData);
          throw new Error(`スキル一覧取得エラー: ${allSkillsRes.status}`);
        }
        const allSkillsData = await allSkillsRes.json();
        console.log('Skills data:', allSkillsData);
        setAllSkills(allSkillsData);

        // ユーザー情報取得
        console.log('Fetching /api/users/' + currentUser.id);
        const userRes = await fetch(
          `http://localhost:8000/api/users/${currentUser.id}`
        );
        console.log('User response:', userRes.status);
        if (!userRes.ok) {
          const errorData = await userRes.json().catch(() => ({}));
          console.error('User error:', errorData);
          throw new Error(`ユーザー取得エラー: HTTP ${userRes.status}`);
        }
        const userData = await userRes.json();
        console.log('User data:', userData);
        setUser(userData);

        // スキル取得
        console.log('Fetching /api/user-skills?user_id=' + currentUser.id);
        const skillsRes = await fetch(
          `http://localhost:8000/api/user-skills?user_id=${currentUser.id}`
        );
        console.log('User skills response:', skillsRes.status);
        if (!skillsRes.ok) {
          const errorData = await skillsRes.json().catch(() => ({}));
          console.error('User skills error:', errorData);
          throw new Error(`スキル取得エラー: ${skillsRes.status}`);
        }
        const skillsData = await skillsRes.json();
        console.log('Skills data:', skillsData);
        setSkills(skillsData);

        // 欲しいスキル取得
        console.log('Fetching /api/desired-skills?user_id=' + currentUser.id);
        const desiredRes = await fetch(
          `http://localhost:8000/api/desired-skills?user_id=${currentUser.id}`
        );
        console.log('Desired skills response:', desiredRes.status);
        if (!desiredRes.ok) {
          const errorData = await desiredRes.json().catch(() => ({}));
          console.error('Desired skills error:', errorData);
          throw new Error(`欲しいスキル取得エラー: ${desiredRes.status}`);
        }
        const desiredData = await desiredRes.json();
        console.log('Desired skills data:', desiredData);
        setDesired(desiredData);
      } catch (err) {
        setError('データの取得に失敗しました: ' + err.message);
        console.error('Fetch error:', err);
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

  const handleAddUserSkill = async (
    skillKey,
    level = '初級',
    description = ''
  ) => {
    try {
      const skillId = LANGUAGE_SKILL_MAP[skillKey];
      if (!skillId) {
        setError('選択されたスキルが無効です');
        return;
      }

      const res = await fetch('http://localhost:8000/api/user-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: currentUser.id,
          skill_id: skillId,
          level: level,
          description: description,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('バックエンドエラー:', errorData);
        throw new Error(
          errorData.errors
            ? Object.values(errorData.errors).flat().join(', ')
            : `HTTP ${res.status}: ${res.statusText}`
        );
      }

      const newSkillData = await res.json();
      setSkills([...skills, newSkillData]);
      setShowAddSkillForm(false);
      setNewSkill({ skill_id: '', level: '初級', description: '' });
      console.log('スキルを追加しました:', newSkillData);
    } catch (err) {
      console.error(err);
      setError('スキル追加に失敗しました: ' + err.message);
    }
  };

  const handleAddDesiredSkill = async (skillKey, priority = 1) => {
    try {
      const skillId = LANGUAGE_SKILL_MAP[skillKey];
      if (!skillId) {
        setError('選択されたスキルが無効です');
        return;
      }

      const res = await fetch('http://localhost:8000/api/desired-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: currentUser.id,
          skill_id: skillId,
          priority: priority,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('バックエンドエラー:', errorData);
        throw new Error(
          errorData.errors
            ? Object.values(errorData.errors).flat().join(', ')
            : `HTTP ${res.status}: ${res.statusText}`
        );
      }

      const newDesiredData = await res.json();
      setDesired([...desired, newDesiredData]);
      setShowAddDesiredForm(false);
      setNewDesired({ skill_id: '', priority: 1 });
      console.log('習得したいスキルを追加しました:', newDesiredData);
    } catch (err) {
      console.error(err);
      setError('習得スキル追加に失敗しました: ' + err.message);
    }
  };

  if (!currentUser || !currentUser.id) {
    return <div className="p-5">リダイレクト中...</div>;
  }

  if (loading) return <LoadingSpinner />;

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
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                {user.name}
              </h1>
            )}
            <p className="text-slate-600 text-lg">
              ユーザーID:{' '}
              <span className="font-semibold text-slate-800">{user.id}</span>
            </p>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-800">
              🎓 自分のスキル（教えられる）
            </h2>
            <button
              className="bg-gradient-primary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
              onClick={() => setShowAddSkillForm(!showAddSkillForm)}
            >
              {showAddSkillForm ? '✕' : '➕'}{' '}
              {showAddSkillForm ? 'キャンセル' : '追加'}
            </button>
          </div>

          {showAddSkillForm && (
            <div className="mb-6 p-5 bg-emerald-50 border-2 border-emerald-300 rounded-lg animate-slide-up">
              <div className="space-y-4">
                <select
                  className="w-full px-4 py-2 border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newSkill.skill_id}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, skill_id: e.target.value })
                  }
                >
                  <option value="">プログラミング言語を選択</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="cpp">C++</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="typescript">TypeScript</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="swift">Swift</option>
                </select>
                <select
                  className="w-full px-4 py-2 border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newSkill.level}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, level: e.target.value })
                  }
                >
                  <option value="初級">初級</option>
                  <option value="中級">中級</option>
                  <option value="上級">上級</option>
                  <option value="エキスパート">エキスパート</option>
                </select>
                <textarea
                  placeholder="説明（任意）"
                  className="w-full px-4 py-2 border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows="2"
                  value={newSkill.description}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, description: e.target.value })
                  }
                />
                <button
                  className="w-full bg-gradient-primary hover:shadow-lg text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
                  onClick={() => {
                    if (newSkill.skill_id) {
                      handleAddUserSkill(
                        newSkill.skill_id,
                        newSkill.level,
                        newSkill.description
                      );
                    }
                  }}
                >
                  ✓ 追加する
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {skills.length === 0 ? (
              <p className="text-slate-500 text-lg">
                スキルが登録されていません。
              </p>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} className="animate-fade-in">
                  <span className="inline-block px-5 py-2 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 rounded-full text-sm font-bold border-2 border-emerald-300 shadow-md hover:shadow-lg transition-all transform hover:scale-110">
                    {skill.skill ? skill.skill.name : skill.name}
                    <span className="ml-2 text-emerald-600 font-bold">
                      Lv{skill.level || '?'}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white/95 backdrop-blur border border-slate-200 p-8 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-800">
              🚀 習得したいスキル（教わりたい）
            </h2>
            <button
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
              onClick={() => setShowAddDesiredForm(!showAddDesiredForm)}
            >
              {showAddDesiredForm ? '✕' : '➕'}{' '}
              {showAddDesiredForm ? 'キャンセル' : '追加'}
            </button>
          </div>

          {showAddDesiredForm && (
            <div className="mb-6 p-5 bg-cyan-50 border-2 border-cyan-300 rounded-lg animate-slide-up">
              <div className="space-y-4">
                <select
                  className="w-full px-4 py-2 border-2 border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={newDesired.skill_id}
                  onChange={(e) =>
                    setNewDesired({ ...newDesired, skill_id: e.target.value })
                  }
                >
                  <option value="">プログラミング言語を選択</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="cpp">C++</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="typescript">TypeScript</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="swift">Swift</option>
                </select>
                <select
                  className="w-full px-4 py-2 border-2 border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={newDesired.priority}
                  onChange={(e) =>
                    setNewDesired({
                      ...newDesired,
                      priority: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="1">優先度1（低）</option>
                  <option value="2">優先度2（中）</option>
                  <option value="3">優先度3（高）</option>
                </select>
                <button
                  className="w-full bg-cyan-500 hover:shadow-lg text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
                  onClick={() => {
                    if (newDesired.skill_id) {
                      handleAddDesiredSkill(
                        newDesired.skill_id,
                        newDesired.priority
                      );
                    }
                  }}
                >
                  ✓ 追加する
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {desired.length === 0 ? (
              <p className="text-slate-500 text-lg">
                習得したいスキルがありません。
              </p>
            ) : (
              desired.map((d) => (
                <div key={d.id} className="animate-fade-in">
                  <span className="inline-block px-5 py-2 bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-800 rounded-full text-sm font-bold border-2 border-cyan-300 shadow-md hover:shadow-lg transition-all transform hover:scale-110">
                    {d.skill ? d.skill.name : d.name}
                    <span className="ml-2 text-cyan-600 font-bold">
                      優先度{d.priority}
                    </span>
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
