import { useEffect, useState } from 'react';

function SkillsList() {
  const [skills, setSkills] = useState([]);
  const [desired, setDesired] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ユーザーのスキル取得
        const skillsRes = await fetch(
          `http://localhost:8000/api/user-skills?user_id=${currentUser.id}`
        );
        if (!skillsRes.ok) {
          throw new Error(`スキル取得失敗: HTTP ${skillsRes.status}`);
        }
        const skillsData = await skillsRes.json();
        setSkills(skillsData);

        // ユーザーの欲しいスキル取得
        const desiredRes = await fetch(
          `http://localhost:8000/api/desired-skills?user_id=${currentUser.id}`
        );
        if (!desiredRes.ok) {
          throw new Error(`欲しいスキル取得失敗: HTTP ${desiredRes.status}`);
        }
        const desiredData = await desiredRes.json();
        setDesired(desiredData);
      } catch (err) {
        setError(`スキルデータ取得エラー: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.id) {
      fetchData();
    }
  }, [currentUser.id]);

  if (loading) return <div className="p-5 text-slate-600">読み込み中...</div>;
  if (error) return <div className="text-red-600 p-5 text-center font-semibold">{error}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white/95 backdrop-blur border border-slate-200 p-8 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          🎓 あなたのスキル
        </h3>
        <div className="flex flex-wrap gap-3">
          {skills.length === 0 && (
            <p className="text-slate-500">スキルが登録されていません。</p>
          )}
          {skills.map((s) => (
            <span
              key={s.id}
              className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 rounded-full text-sm font-bold border-2 border-emerald-300 shadow-md hover:shadow-lg transition-all transform hover:scale-110 animate-fade-in"
            >
              {s.skill ? s.skill.name : s.name} <span className="ml-2 text-emerald-600">Lv{s.level || '?'}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur border border-slate-200 p-8 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          🚀 習得したいスキル
        </h3>
        <div className="flex flex-wrap gap-3">
          {desired.length === 0 && (
            <p className="text-slate-500">習得したいスキルがありません。</p>
          )}
          {desired.map((d) => (
            <span
              key={d.id}
              className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-800 rounded-full text-sm font-bold border-2 border-cyan-300 shadow-md hover:shadow-lg transition-all transform hover:scale-110 animate-fade-in"
            >
              {d.skill ? d.skill.name : d.name} <span className="ml-2 text-cyan-600">優先度{d.priority}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkillsList;
