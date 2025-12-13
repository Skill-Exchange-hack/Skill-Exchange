import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import '../App.css';

function MessagePage() {
  const { id } = useParams();
  const location = useLocation();
  const partnerName = location.state?.partnerName || `ユーザー ${id}`;
  const storageKey = `messages_${id}`;
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    // scroll to bottom
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    const entry = { id: Date.now(), text: txt, date: new Date().toISOString(), sender: 'me' };
    setMessages((m) => [...m, entry]);
    setInput('');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="brand">スキル交換</div>
        <ul className="sidebar-menu">
          <li><Link to="/">🏠 ホーム</Link></li>
          <li><Link to="/matches">🤝 マッチング</Link></li>
          <li><Link to="/dashboard">📚 スキル一覧</Link></li>
          <li><Link to="/profile">👤 プロフィール</Link></li>
          <li><Link to="/settings">⚙ 設定</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>メッセージ — {partnerName}</h1>
        </header>

        <section className="page-content">
          <div className="activity-box" style={{ display: 'flex', flexDirection: 'column', minHeight: 360 }}>
            <div className="message-panel">
              <div className="message-header">{partnerName}</div>
              <div className="message-list" ref={listRef} style={{ padding: 12, flex: 1, overflow: 'auto' }}>
                {messages.length === 0 && <p style={{ color: '#666' }}>まだメッセージがありません。こんにちはから始めましょう。</p>}
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                    <div>{msg.text}</div>
                    <div className="message-date">{new Date(msg.date).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="message-input">
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={`メッセージを送る — ${partnerName}`} />
                <button onClick={send} className="connect-btn">送信</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MessagePage;
