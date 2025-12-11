import { useEffect, useState } from 'react';
import '../styles/Profile.css';

function Profile() {
  const [name] = useState('ユーザー名');
  const [email] = useState('user@example.com');
  const [bio] = useState('フルスタック開発者です。Reactとその周辺技術に興味があります。');
  const [avatar] = useState('👤');

  const [skills, setSkills] = useState(() => {
    try {
      const raw = localStorage.getItem('skills');
      return raw ? JSON.parse(raw) : ['React', 'JavaScript', 'CSS'];
    } catch {
      return ['React', 'JavaScript', 'CSS'];
    }
  });

  const [desired, setDesired] = useState(() => {
    try {
      const raw = localStorage.getItem('desiredSkills');
      return raw ? JSON.parse(raw) : ['TypeScript', 'GraphQL'];
    } catch {
      return ['TypeScript', 'GraphQL'];
    }
  });

  const [skillInput, setSkillInput] = useState('');
  const [desiredInput, setDesiredInput] = useState('');

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('desiredSkills', JSON.stringify(desired));
  }, [desired]);

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (skills.includes(v)) {
      setSkillInput('');
      return;
    }
    setSkills([...skills, v]);
    setSkillInput('');
  };

  const removeSkill = (idx) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const addDesired = () => {
    const v = desiredInput.trim();
    if (!v) return;
    if (desired.includes(v)) {
      setDesiredInput('');
      return;
    }
    setDesired([...desired, v]);
    setDesiredInput('');
  };

  const removeDesired = (idx) => {
    setDesired(desired.filter((_, i) => i !== idx));
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{avatar}</div>
        <div className="profile-info">
          <h1>{name}</h1>
          <p className="profile-email">{email}</p>
        </div>
        <button className="edit-btn">編集</button>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h2>自己紹介</h2>
          <p>{bio}</p>
        </section>

        <section className="profile-section">
          <h2>自分のスキル（教えられる）</h2>
          <div className="skill-actions">
            <input
              className="skill-input"
              placeholder="例: Python"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <button className="add-btn" onClick={addSkill}>追加</button>
          </div>
          <div className="skills-list">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <span className="skill-tag">{skill}</span>
                <button className="remove-btn" onClick={() => removeSkill(index)}>削除</button>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2>習得したいスキル（教わりたい）</h2>
          <div className="skill-actions">
            <input
              className="skill-input"
              placeholder="例: Docker"
              value={desiredInput}
              onChange={(e) => setDesiredInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addDesired()}
            />
            <button className="add-btn" onClick={addDesired}>追加</button>
          </div>
          <div className="skills-list">
            {desired.map((d, index) => (
              <div key={index} className="skill-item">
                <span className="skill-tag desired">{d}</span>
                <button className="remove-btn" onClick={() => removeDesired(index)}>削除</button>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2>アクティビティ</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📝</span>
              <div className="activity-text">
                <p className="activity-title">プロフィール作成</p>
                <p className="activity-date">2024年1月1日</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
