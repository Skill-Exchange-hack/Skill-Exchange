import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function HomePage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ユーザーが登録されていない場合はリダイレクト
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      navigate('/register');
    }
  }, [currentUser.id, navigate]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:8000/api/user-matches`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setMatches(data);
        if (data.length > 0) setSelected(data[0]);
      } catch (err) {
        console.error('マッチング取得エラー:', err);
        setError('マッチング情報の取得に失敗しました: ' + err.message);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.id) {
      fetchMatches();
    }
  }, [currentUser.id]);

  if (!currentUser || !currentUser.id) {
    return <div className="p-5">リダイレクト中...</div>;
  }

  if (loading) return <div className="p-5">読み込み中...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-subtle">
      <main className="flex-1 flex flex-col">
        <header className="bg-white/95 backdrop-blur p-8 shadow-lg border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              ようこそ！
            </h1>
            <p className="text-lg text-slate-600">{currentUser.name}さんのスキル交換プラットフォーム</p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-gradient-primary hover:shadow-lg text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            👤 プロフィール
          </button>
        </header>

        {error && (
          <div className="text-red-600 text-sm p-4 bg-red-50/95 mx-8 mt-6 rounded-lg border border-red-200 backdrop-blur">
            {error}
          </div>
        )}

        <section className="p-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            ✨ 最近のマッチング
          </h2>
          <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-lg border border-slate-200 min-h-52 flex items-center justify-center">
            <RecentMatches
              matches={matches}
              selectedId={selected ? selected.id : null}
              onSelect={(m) => setSelected(m)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function RecentMatches({ matches, selectedId, onSelect }) {
  if (!matches || matches.length === 0) {
    return <p className="text-slate-500 text-center text-lg">📭 最近のマッチングはありません。</p>;
  }

  return (
    <ul className="w-full flex flex-col gap-3 animate-fade-in">
      {matches.slice(0, 10).map((m) => (
        <li
          key={m.id}
          className={`p-5 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-102 border-2 ${
            selectedId === m.id
              ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-cyan-50 shadow-md'
              : 'border-slate-200 bg-white hover:shadow-lg'
          }`}
          onClick={() => onSelect(m)}
          role="button"
          tabIndex={0}
        >
          <div className="text-sm text-slate-500 mb-2">
            📅 {new Date(m.created_at).toLocaleDateString('ja-JP')}
          </div>
          <div className="text-lg font-semibold text-slate-800">
            ステータス: <span className="text-emerald-600">{m.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default HomePage;

function Calendar({ eventsMap, currentMonth, onPrev, onNext, onSelectDate }) {
  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const startDay = new Date(startOfMonth);
  startDay.setDate(startOfMonth.getDate() - startOfMonth.getDay());

  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')}`;
    days.push({
      date: d,
      key,
      isCurrentMonth: d.getMonth() === currentMonth.getMonth(),
      events: eventsMap[key] || [],
    });
  }

  const monthLabel = `${currentMonth.getFullYear()}年 ${
    currentMonth.getMonth() + 1
  }月`;

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="connect-btn" onClick={onPrev}>
          ‹
        </button>
        <div className="calendar-title">{monthLabel}</div>
        <button className="connect-btn" onClick={onNext}>
          ›
        </button>
      </div>
      <div className="calendar-grid">
        {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
          <div key={d} className="calendar-weekday">
            {d}
          </div>
        ))}
        {days.map((c) => (
          <div
            key={c.key}
            className={`calendar-day ${c.isCurrentMonth ? '' : 'other-month'}`}
            onClick={() => onSelectDate(c.date)}
          >
            <div className="day-number">{c.date.getDate()}</div>
            {c.events.length > 0 && (
              <div className="event-badge">{c.events.length}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EventList({ date, eventsMap, onAdd, onRemove }) {
  const [text, setText] = useState('');
  const key = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`
    : '';
  const list = eventsMap[key] || [];

  return (
    <div>
      <div className="event-list">
        {list.length === 0 && (
          <p className="muted">この日は予定がありません。</p>
        )}
        {list.map((e) => (
          <div key={e.id} className="event-item">
            <div>{e.text}</div>
            <button className="remove-btn" onClick={() => onRemove(date, e.id)}>
              削除
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <input
          className="skill-search-input"
          placeholder="予定を追加"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="connect-btn"
          onClick={() => {
            if (text.trim()) {
              onAdd(date, text.trim());
              setText('');
            }
          }}
        >
          追加
        </button>
      </div>
    </div>
  );
}
