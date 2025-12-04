import '../styles/Profile.css';

function Profile() {
  const userProfile = {
    name: 'ユーザー名',
    email: 'user@example.com',
    bio: 'フルスタック開発者です。Reactとその周辺技術に興味があります。',
    location: '日本',
    joinDate: '2024年1月',
    skills: ['React', 'JavaScript', 'CSS', 'Node.js', 'SQL'],
    experience: '3年',
    avatar: '👤'
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{userProfile.avatar}</div>
        <div className="profile-info">
          <h1>{userProfile.name}</h1>
          <p className="profile-email">{userProfile.email}</p>
        </div>
        <button className="edit-btn">編集</button>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h2>自己紹介</h2>
          <p>{userProfile.bio}</p>
        </section>

        <section className="profile-section">
          <h2>基本情報</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>所在地</label>
              <p>{userProfile.location}</p>
            </div>
            <div className="info-item">
              <label>参加日</label>
              <p>{userProfile.joinDate}</p>
            </div>
            <div className="info-item">
              <label>経験年数</label>
              <p>{userProfile.experience}</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>スキル</h2>
          <div className="skills-list">
            {userProfile.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
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
            <div className="activity-item">
              <span className="activity-icon">⭐</span>
              <div className="activity-text">
                <p className="activity-title">スキル追加</p>
                <p className="activity-date">2024年1月15日</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
