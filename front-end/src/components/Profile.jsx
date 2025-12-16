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
    <div className="max-w-4xl mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="flex items-center gap-8 bg-white p-8 rounded-lg shadow mb-8">
        <div className="text-8xl min-w-fit text-center">👤</div>
        <div className="flex-1">
          {editing ? (
            <input
              className="text-4xl font-bold border-2 border-green-500 rounded-lg px-4 py-2 w-full"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          ) : (
            <h1 className="text-4xl font-bold text-gray-800">{user.name}</h1>
          )}
          <p className="text-gray-600">ID: {user.id}</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              onClick={handleSaveProfile}
            >
              保存
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              onClick={() => {
                setEditing(false);
                setUser(currentUser);
              }}
            >
              キャンセル
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            onClick={() => setEditing(true)}
          >
            編集
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {error && (
          <div className="text-red-600 text-sm p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            自分のスキル（教えられる）
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.length === 0 ? (
              <p className="text-gray-600">スキルが登録されていません。</p>
            ) : (
              skills.map((skill) => (
                <div key={skill.id}>
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-500">
                    {skill.skill ? skill.skill.name : skill.name} (Lv:{' '}
                    {skill.level || 'N/A'})
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            習得したいスキル（教わりたい）
          </h2>
          <div className="flex flex-wrap gap-3">
            {desired.length === 0 ? (
              <p className="text-gray-600">習得したいスキルがありません。</p>
            ) : (
              desired.map((d) => (
                <div key={d.id}>
                  <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-400">
                    {d.skill ? d.skill.name : d.name} (優先度: {d.priority})
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">登録日</h2>
          <p className="text-gray-700">
            {new Date(user.created_at).toLocaleDateString('ja-JP')}
          </p>
        </section>
      </div>
    </div>
  );
}

export default Profile;
