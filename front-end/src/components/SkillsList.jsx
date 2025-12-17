import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

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

  const handleDeleteUserSkill = async (skillId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/user-skills/${skillId}`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      setSkills(skills.filter((s) => s.id !== skillId));
      console.log('スキルを削除しました:', skillId);
    } catch (err) {
      console.error(err);
      setError('スキル削除に失敗しました: ' + err.message);
    }
  };

  const handleDeleteDesiredSkill = async (desiredId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/desired-skills/${desiredId}`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      setDesired(desired.filter((d) => d.id !== desiredId));
      console.log('習得したいスキルを削除しました:', desiredId);
    } catch (err) {
      console.error(err);
      setError('習得スキル削除に失敗しました: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-red-600 p-5 text-center font-semibold">{error}</div>
    );

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
            <div key={s.id} className="relative group">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 rounded-full text-sm font-bold border-2 border-emerald-300 shadow-md hover:shadow-lg transition-all transform hover:scale-110 animate-fade-in">
                {s.skill ? s.skill.name : s.name}{' '}
                <span className="ml-2 text-emerald-600">
                  Lv{s.level || '?'}
                </span>
              </span>
              <button
                onClick={() => handleDeleteUserSkill(s.id)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
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
            <div key={d.id} className="relative group">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-800 rounded-full text-sm font-bold border-2 border-cyan-300 shadow-md hover:shadow-lg transition-all transform hover:scale-110 animate-fade-in">
                {d.skill ? d.skill.name : d.name}{' '}
                <span className="ml-2 text-cyan-600">優先度{d.priority}</span>
              </span>
              <button
                onClick={() => handleDeleteDesiredSkill(d.id)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkillsList;
