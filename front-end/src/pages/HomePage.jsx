import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';

function HomePage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  // calendar state
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [dateSearch, setDateSearch] = useState('');

  const [eventsMap, setEventsMap] = useState(() => {
    try {
      const raw = localStorage.getItem('events');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('events', JSON.stringify(eventsMap));
    } catch {}
  }, [eventsMap]);

  // helpers
  const formatDate = (d) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const addEvent = (date, text) => {
    const key = formatDate(date);
    const next = { ...eventsMap };
    next[key] = next[key] ? [...next[key], { id: Date.now(), text }] : [{ id: Date.now(), text }];
    setEventsMap(next);
  };

  const removeEvent = (date, id) => {
    const key = formatDate(date);
    const next = { ...eventsMap };
    next[key] = (next[key] || []).filter((e) => e.id !== id);
    setEventsMap(next);
  };

  const jumpToDate = () => {
    try {
      const d = new Date(dateSearch);
      if (!isNaN(d)) {
        setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
        setSelectedDate(d);
      }
    } catch (e) {}
  };

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
          <li><Link to="/dashboard">📚 スキル一覧</Link></li>
          <li><Link to="/profile">👤 プロフィール</Link></li>
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
        {/* カレンダーセクション */}
        <section className="content-section">
          <h2>カレンダー</h2>
          <div className="activity-box two-column">
            <div className="frame">
              <div className="frame-header">月間カレンダー</div>
              <div className="frame-body">
                <Calendar
                  eventsMap={eventsMap}
                  currentMonth={currentMonth}
                  onPrev={() => setCurrentMonth(addMonths(currentMonth, -1))}
                  onNext={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  onSelectDate={(d) => setSelectedDate(d)}
                />
              </div>
            </div>

            <div className="frame">
              <div className="frame-header">予定</div>
              <div className="frame-body">
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontWeight: 700 }}>日付で移動</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="date-search-input" value={dateSearch} onChange={(e) => setDateSearch(e.target.value)} placeholder="YYYY-MM-DD" />
                    <button className="connect-btn" onClick={jumpToDate}>移動</button>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>選択日: {formatDate(selectedDate)}</div>
                  <EventList date={selectedDate} eventsMap={eventsMap} onAdd={addEvent} onRemove={removeEvent} />
                </div>
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

/* ---------- Calendar subcomponents ---------- */

function addMonths(d, n) {
  const dt = new Date(d.getFullYear(), d.getMonth() + n, 1);
  return dt;
}

function Calendar({ eventsMap, currentMonth, onPrev, onNext, onSelectDate }) {
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const startDay = new Date(startOfMonth);
  startDay.setDate(startOfMonth.getDate() - startOfMonth.getDay());

  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    days.push({ date: d, key, isCurrentMonth: d.getMonth() === currentMonth.getMonth(), events: eventsMap[key] || [] });
  }

  const monthLabel = `${currentMonth.getFullYear()}年 ${currentMonth.getMonth() + 1}月`;

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="connect-btn" onClick={onPrev}>‹</button>
        <div className="calendar-title">{monthLabel}</div>
        <button className="connect-btn" onClick={onNext}>›</button>
      </div>
      <div className="calendar-grid">
        {['日','月','火','水','木','金','土'].map((d) => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}
        {days.map((c) => (
          <div key={c.key} className={`calendar-day ${c.isCurrentMonth ? '' : 'other-month'}`} onClick={() => onSelectDate(c.date)}>
            <div className="day-number">{c.date.getDate()}</div>
            {c.events.length > 0 && <div className="event-badge">{c.events.length}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function EventList({ date, eventsMap, onAdd, onRemove }) {
  const [text, setText] = useState('');
  const key = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
  const list = eventsMap[key] || [];

  return (
    <div>
      <div className="event-list">
        {list.length === 0 && <p className="muted">この日は予定がありません。</p>}
        {list.map((e) => (
          <div key={e.id} className="event-item">
            <div>{e.text}</div>
            <button className="remove-btn" onClick={() => onRemove(date, e.id)}>削除</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <input className="skill-search-input" placeholder="予定を追加" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="connect-btn" onClick={() => { if (text.trim()) { onAdd(date, text.trim()); setText(''); } }}>追加</button>
      </div>
    </div>
  );
}
