import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* --- サイドバー --- */}
      <aside className="sidebar">
        <div className="brand">スキル交換</div>
        <ul className="sidebar-menu">
          <li className="active">🏠 ホーム</li>
          <li>📊 分析</li>
          <li>👥 ユーザー</li>
          <li>⚙ 設定</li>
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

        {/* カードグリッド */}
        <section className="cards">
          <div className="card-item">
            <h3>総ユーザー数</h3>
            <p>1,245</p>
          </div>
          <div className="card-item">
            <h3>アクティブセッション</h3>
            <p>320</p>
          </div>
          <div className="card-item">
            <h3>サーバー負荷</h3>
            <p>45%</p>
          </div>
        </section>

        {/* 表やグラフを置くセクション */}
        <section className="content-section">
          <h2>最近のアクティビティ</h2>
          <div className="activity-box">
            <p>最近のアクティビティはありません。</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
