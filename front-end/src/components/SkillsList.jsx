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

  if (loading) return <div className="p-5">読み込み中...</div>;
  if (error) return <div className="text-red-600 p-5">{error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">あなたのスキル</h3>
        <div className="flex flex-wrap gap-3">
          {skills.length === 0 && (
            <p className="text-gray-600">スキルが登録されていません。</p>
          )}
          {skills.map((s) => (
            <span
              key={s.id}
              className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-500"
            >
              {s.skill ? s.skill.name : s.name} (Lv: {s.level || 'N/A'})
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          習得したいスキル
        </h3>
        <div className="flex flex-wrap gap-3">
          {desired.length === 0 && (
            <p className="text-gray-600">習得したいスキルがありません。</p>
          )}
          {desired.map((d) => (
            <span
              key={d.id}
              className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-400"
            >
              {d.skill ? d.skill.name : d.name} (優先度: {d.priority})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkillsList;
