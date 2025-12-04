import { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Profile from './components/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <Profile />;
      case 'settings':
        return (
          <div className="page-content">
            <h1>設定</h1>
            <p>設定ページの内容はここに表示されます。</p>
          </div>
        );
      default:
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
                <button className="profile-btn" onClick={() => setCurrentPage('profile')}>
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
  };

  return (
    <>
      <Navigation onNavigate={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
    </>
  );
}

export default App;
