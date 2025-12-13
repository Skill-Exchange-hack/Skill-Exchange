import { useEffect, useState } from 'react';
import '../styles/Profile.css';

function Profile() {
  const [name, setName] = useState(() => {
    try {
      const v = localStorage.getItem('profileName');
      return v || 'ユーザー名';
    } catch {
      return 'ユーザー名';
    }
  });
  const [email] = useState('user@example.com');
  const [bio, setBio] = useState(() => {
    try {
      const v = localStorage.getItem('profileBio');
      return v || 'フルスタック開発者です。Reactとその周辺技術に興味があります。';
    } catch {
      return 'フルスタック開発者です。Reactとその周辺技術に興味があります。';
    }
  });
  const [avatar] = useState('👤');
  const [editing, setEditing] = useState(false);

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

  useEffect(() => {
    // persist profile fields when not editing (or on save flow)
    localStorage.setItem('profileName', name);
    localStorage.setItem('profileBio', bio);
  }, [name, bio]);

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
          {editing ? (
            <input className="profile-name-input" value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <h1>{name}</h1>
          )}
          <p className="profile-email">{email}</p>
        </div>
        {editing ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="save-btn"
              onClick={() => {
                // save already persisted via effects; just exit edit mode
                setEditing(false);
              }}
            >保存</button>
            <button
              className="cancel-btn"
              onClick={() => {
                // reload values from storage to cancel changes
                try {
                  const n = localStorage.getItem('profileName');
                  if (n) setName(n);
                } catch {}
                try {
                  const b = localStorage.getItem('profileBio');
                  if (b) setBio(b);
                } catch {}
                try {
                  const s = localStorage.getItem('skills');
                  setSkills(s ? JSON.parse(s) : []);
                } catch {}
                try {
                  const d = localStorage.getItem('desiredSkills');
                  setDesired(d ? JSON.parse(d) : []);
                } catch {}
                setEditing(false);
              }}
            >キャンセル</button>
          </div>
        ) : (
          <button className="edit-btn" onClick={() => setEditing(true)}>編集</button>
        )}
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h2>自己紹介</h2>
          {editing ? (
            <textarea className="bio-input" value={bio} onChange={(e) => setBio(e.target.value)} />
          ) : (
            <p>{bio}</p>
          )}
        </section>

        <section className="profile-section">
          <h2>自分のスキル（教えられる）</h2>
          {editing && (
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
          )}
          <div className="skills-list">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <span className="skill-tag">{skill}</span>
                {editing && <button className="remove-btn" onClick={() => removeSkill(index)}>削除</button>}
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2>習得したいスキル（教わりたい）</h2>
          {editing && (
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
          )}
          <div className="skills-list">
            {desired.map((d, index) => (
              <div key={index} className="skill-item">
                <span className="skill-tag desired">{d}</span>
                {editing && <button className="remove-btn" onClick={() => removeDesired(index)}>削除</button>}
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
