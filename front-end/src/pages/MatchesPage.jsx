import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import '../App.css';

function MatchesPage() {
  const [matches, setMatches] = useState(() => {
    try {
      const raw = localStorage.getItem('matches');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // current user's skills and desired skills (from Profile)
  const currentSkills = useMemo(() => {
    try {
      const raw = localStorage.getItem('skills');
      return raw ? JSON.parse(raw) : ['React', 'JavaScript', 'CSS'];
    } catch {
      return ['React', 'JavaScript', 'CSS'];
    }
  }, []);

  const currentDesired = useMemo(() => {
    try {
      const raw = localStorage.getItem('desiredSkills');
      return raw ? JSON.parse(raw) : ['TypeScript', 'GraphQL'];
    } catch {
      return ['TypeScript', 'GraphQL'];
    }
  }, []);

  // load other users (sample or from localStorage)
  const users = useMemo(() => {
    try {
      const raw = localStorage.getItem('users');
      if (raw) return JSON.parse(raw);
    } catch {}

    // sample users
    return [
      { id: 2, name: '山田 太郎', skills: ['React', 'Node.js'], desired: ['TypeScript'] },
      { id: 3, name: '佐藤 花子', skills: ['Python', 'Django'], desired: ['React', 'JavaScript'] },
      { id: 4, name: '鈴木 次郎', skills: ['TypeScript', 'GraphQL'], desired: ['Go'] },
      { id: 5, name: '高橋 愛', skills: ['CSS', 'Design'], desired: ['React'] }
    ];
  }, []);

  // compute mutual matches: user wants X and other can teach X, and other wants Y and current can teach Y
  const potentialMatches = useMemo(() => {
    const res = [];
    users.forEach((u) => {
      const teaches = u.skills.filter((s) => currentDesired.includes(s));
      const wants = u.desired.filter((s) => currentSkills.includes(s));
      if (teaches.length > 0 || wants.length > 0) {
        res.push({
          ...u,
          matchSkills: teaches,
          reciprocal: wants,
          score: teaches.length + wants.length
        });
      }
    });
    // sort by score desc
    return res.sort((a, b) => b.score - a.score);
  }, [users, currentDesired, currentSkills]);

  const navigate = useNavigate();

  const [skillQuery, setSkillQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = skillQuery.trim().toLowerCase();
    if (!q) return [];
    return users
      .map((u) => {
        const matched = u.skills.find((s) => s.toLowerCase().includes(q));
        if (matched) return { ...u, matchedSkill: matched, matchSkills: [matched] };
        return null;
      })
      .filter(Boolean);
  }, [users, skillQuery]);

  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches));
  }, [matches]);

  const connect = async (user) => {
    const date = new Date().toISOString().slice(0, 10);
    const skill = user.matchSkills[0] || user.reciprocal[0] || '';
    const entry = {
      id: Date.now(),
      partner: user.name,
      skill,
      date
    };
    setMatches((m) => [entry, ...m]);

    // navigate to message page after creating match
    try {
      navigate(`/messages/${user.id}`, { state: { partnerName: user.name } });
    } catch (e) {}

    // Try to POST to backend; fail silently if not available
    try {
      await fetch('/api/user-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, matched_user_id: user.id, status: 'pending' })
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="brand">スキル交換</div>
        <ul className="sidebar-menu">
          <li><Link to="/">🏠 ホーム</Link></li>
          <li className="active"><Link to="/matches">🤝 マッチング</Link></li>
          <li><Link to="/dashboard">📚 スキル一覧</Link></li>
          <li><Link to="/profile">👤 プロフィール</Link></li>
          <li><Link to="/settings">⚙ 設定</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>マッチング</h1>
        </header>

        <section className="page-content">
          <h2>おすすめのマッチ</h2>
          <div className="activity-box">
            {potentialMatches.length === 0 && <p>現在、表示するマッチがありません。</p>}
            <ul className="matches-list">
              {potentialMatches.map((m) => (
                <li key={m.id} className="match-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="match-info"><strong>{m.name}</strong></div>
                      <div className="match-sub">教えられる: {m.matchSkills.join(', ') || '—'}</div>
                      <div className="match-sub">教わりたい: {m.reciprocal.join(', ') || '—'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="connect-btn" onClick={() => connect(m)}>接続</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 検索：教わりたいスキルで講師を検索 */}
          <div style={{ marginTop: 20 }} className="skill-search">
            <label style={{ display: 'block', marginBottom: 8, color: '#333', fontWeight: 700 }}>講師を検索（教わりたいスキル）</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
                placeholder="例: React, TypeScript"
                className="skill-search-input"
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              />
              <button className="connect-btn" onClick={() => { /* no-op, results update live */ }}>検索</button>
            </div>

            {skillQuery.trim() !== '' && (
              <div style={{ marginTop: 12 }}>
                <div style={{ marginBottom: 8, color: '#444', fontWeight: 700 }}>検索結果</div>
                <ul className="matches-list">
                  {searchResults.length === 0 && <p style={{ color: '#666' }}>該当する講師が見つかりません。</p>}
                  {searchResults.map((t) => (
                    <li key={t.id} className="teacher-item match-item">
                      <div>
                        <div className="match-info"><strong>{t.name}</strong></div>
                        <div className="match-sub">教えられる: {t.matchedSkill}</div>
                      </div>
                      <div>
                        <button className="connect-btn" onClick={() => connect(t)}>接続</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <h2 style={{ marginTop: 24 }}>直近のマッチング</h2>
          <div className="activity-box">
            <ul className="matches-list">
              {matches.length === 0 && <p>まだマッチングはありません。</p>}
              {matches.map((m) => (
                <li key={m.id} className="match-item">
                  <div className="match-date">{m.date}</div>
                  <div className="match-info">{m.partner} — {m.skill}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MatchesPage;
