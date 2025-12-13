import { Link } from 'react-router-dom';
import '../App.css';

function MatchesPage() {
  const raw = localStorage.getItem('matches');
  const matches = raw
    ? JSON.parse(raw)
    : [
        { id: 1, partner: '山田 太郎', skill: 'React', date: '2025-12-10' },
        { id: 2, partner: '佐藤 花子', skill: 'Python', date: '2025-12-08' },
        { id: 3, partner: '鈴木 次郎', skill: 'TypeScript', date: '2025-12-05' }
      ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="brand">スキル交換</div>
        <ul className="sidebar-menu">
          <li><Link to="/">🏠 ホーム</Link></li>
          <li className="active"><Link to="/matches">🤝 マッチング</Link></li>
          <li><Link to="/settings">⚙ 設定</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>マッチング</h1>
        </header>

        <section className="page-content">
          <h2>直近のマッチング</h2>
          <div className="activity-box">
            <ul className="matches-list">
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
