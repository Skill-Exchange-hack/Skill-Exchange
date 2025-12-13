import SkillsList from '../components/SkillsList';
import { Link } from 'react-router-dom';
import '../App.css';

function DashboardPage() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="brand">スキル交換</div>
        <ul className="sidebar-menu">
          <li className="active"><Link to="/dashboard">🏠 スキル一覧</Link></li>
          <li><Link to="/matches">🤝 マッチング</Link></li>
          <li><Link to="/settings">⚙ 設定</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>スキル一覧</h1>
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
