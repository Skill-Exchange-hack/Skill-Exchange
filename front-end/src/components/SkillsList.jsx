import { useEffect, useState } from 'react';
import '../styles/Profile.css';

function SkillsList() {
  const [skills, setSkills] = useState([]);
  const [desired, setDesired] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('skills');
      const s = raw ? JSON.parse(raw) : ['React', 'JavaScript', 'CSS'];
      setSkills(s);
    } catch (e) {
      setSkills(['React', 'JavaScript', 'CSS']);
    }

    try {
      const rawD = localStorage.getItem('desiredSkills');
      const d = rawD ? JSON.parse(rawD) : ['TypeScript', 'GraphQL'];
      setDesired(d);
    } catch (e) {
      setDesired(['TypeScript', 'GraphQL']);
    }
  }, []);

  const languages = [
    'Python', 'Java', 'C++', 'Ruby', 'Go',
    'Swift', 'Kotlin', 'PHP', 'Rust', 'Dart', 'TypeScript'
  ];

  const available = languages.filter((l) => !skills.includes(l) && !desired.includes(l));

  return (
    <div className="skills-panel">
      <div className="skills-section">
        <h3>あなたのスキル</h3>
        <div className="skills-grid">
          {skills.length === 0 && <p>スキルが登録されていません。</p>}
          {skills.map((s, i) => (
            <span key={i} className="skill-tag">{s}</span>
          ))}
        </div>
      </div>

      <div className="skills-section">
        <h3>習得したいスキル</h3>
        <div className="skills-grid">
          {desired.length === 0 && <p>習得したいスキルがありません。</p>}
          {desired.map((d, i) => (
            <span key={i} className="skill-tag desired">{d}</span>
          ))}
        </div>
      </div>

      <div className="skills-section">
        <h3>習得できるスキル一覧（プログラミング言語）</h3>
        <div className="skills-grid">
          {available.length === 0 && <p>利用可能なスキルがありません。</p>}
          {available.map((a, i) => (
            <span key={i} className="skill-tag available">{a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkillsList;
