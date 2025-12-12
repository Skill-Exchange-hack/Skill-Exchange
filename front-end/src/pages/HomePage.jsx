import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function HomePage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('matches');
      const m = raw
        ? JSON.parse(raw)
        : [
            { id: 1, partner: '山田 太郎', skill: 'React', date: '2025-12-10' },
            { id: 2, partner: '佐藤 花子', skill: 'Python', date: '2025-12-08' },
            { id: 3, partner: '鈴木 次郎', skill: 'TypeScript', date: '2025-12-05' }
          ];
      setMatches(m);
      if (m.length > 0) setSelected(m[0]);
    } catch (e) {
      setMatches([]);
    }
  }, []);

  return (
    <div className="dashboard-container">
      {/* --- サイドバー --- */}
      <aside className="sidebar">
        <div className="brand">スキル交換</div>
        <ul className="sidebar-menu">
          <li className="active"><Link to="/">🏠 ホーム</Link></li>
          <li><Link to="/matches">🤝 マッチング</Link></li>
          <li><Link to="/settings">⚙ 設定</Link></li>
        </ul>
      </aside>

      {/* --- メインコンテンツ --- */}
      <main className="main-content">
        {/* ヘッダー */}
        <header className="header">
          <h1>ようこそ、ユーザーさん！</h1>
          <button className="profile-btn" onClick={() => navigate('/profile')}>
            プロフィールを見る
          </button>
        </header>

        {/* カードグリッド（統計表示は削除されました） */}

        {/* 表やグラフを置くセクション */}
        <section className="content-section">
          <h2>最近のアクティビティ</h2>
          <div className="activity-box two-column">
            <div className="frame">
              <div className="frame-header">マッチ履歴</div>
              <div className="frame-body">
                <RecentMatches
                  matches={matches}
                  selectedId={selected ? selected.id : null}
                  onSelect={(m) => setSelected(m)}
                />
              </div>
            </div>

            <div className="frame">
              <div className="frame-header">メッセージ</div>
              <div className="frame-body">
                <MessagePanel match={selected} showHeader={false} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
function RecentMatches({ matches, selectedId, onSelect }) {
  if (!matches || matches.length === 0) {
    return <p>最近のマッチングはありません。</p>;
  }

  return (
    <ul className="matches-list">
      {matches.slice(0, 10).map((m) => (
        <li
          key={m.id}
          className={`match-item ${selectedId === m.id ? 'selected' : ''}`}
          onClick={() => onSelect(m)}
          role="button"
          tabIndex={0}
        >
          <div className="match-date">{m.date}</div>
          <div className="match-info">{m.partner} — {m.skill}</div>
        </li>
      ))}
    </ul>
  );
}

function MessagePanel({ match, showHeader = true }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!match) {
      setMessages([]);
      return;
    }
    try {
      const raw = localStorage.getItem(`messages_${match.id}`);
      const m = raw ? JSON.parse(raw) : [];
      setMessages(m);
    } catch (e) {
      setMessages([]);
    }
  }, [match]);

  const send = () => {
    if (!match || !text.trim()) return;
    const newMsg = { id: Date.now(), from: 'me', text: text.trim(), date: new Date().toISOString() };
    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(`messages_${match.id}`, JSON.stringify(updated));
    setText('');
  };

  if (!match) {
    return (
      <div className="message-panel empty">
        <p>マッチを選択するとメッセージを送信できます。</p>
      </div>
    );
  }

  return (
    <div className="message-panel">
      {showHeader && <div className="message-header">{match.partner} — {match.skill}</div>}
      <div className="message-list">
        {messages.length === 0 && <p className="muted">メッセージはありません。</p>}
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.from === 'me' ? 'sent' : 'received'}`}>
            <div className="message-text">{msg.text}</div>
            <div className="message-date">{new Date(msg.date).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="メッセージを入力..." />
        <button onClick={send}>送信</button>
      </div>
    </div>
  );
}

export default HomePage;
