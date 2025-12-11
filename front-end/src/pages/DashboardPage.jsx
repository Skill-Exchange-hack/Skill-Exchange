import SkillsList from '../components/SkillsList';
import '../App.css';

function DashboardPage() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="brand">スキル交換</div>
        <ul className="sidebar-menu">
          <li className="active">🏠 ダッシュボード</li>
          <li>📊 分析</li>
          <li>👥 ユーザー</li>
          <li>⚙ 設定</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>ダッシュボード</h1>
        </header>

        <section className="page-content">
          <h2>スキル一覧</h2>
          <SkillsList />
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
