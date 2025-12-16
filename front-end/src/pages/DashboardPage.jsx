import SkillsList from '../components/SkillsList';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // ユーザーが登録されていない場合はリダイレクト
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      navigate('/register');
    }
  }, [currentUser, navigate]);

  if (!currentUser || !currentUser.id) {
    return <div className="p-5">リダイレクト中...</div>;
  }

  return (
    <main className="flex-1 flex flex-col">
      <header className="bg-white p-8 shadow-md flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">スキル一覧</h1>
      </header>

      <section className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">スキル一覧</h2>
        <SkillsList />
      </section>
    </main>
  );
}

export default DashboardPage;
