import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('ユーザー名を入力してください。');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ユーザー追加に失敗しました。');
      }

      const user = await response.json();
      setSuccess(`ユーザー「${user.name}」を追加しました。`);
      setName('');
      localStorage.setItem('currentUser', JSON.stringify(user));

      // 2秒後にホームページへ遷移
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-subtle">
      <div className="bg-white/95 backdrop-blur border border-slate-200 p-12 rounded-2xl shadow-2xl max-w-sm w-full animate-slide-up">
        <h2 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent text-center">
          スキル交換
        </h2>
        <p className="text-slate-600 text-center mb-8 text-sm">新しいユーザーを登録して始めましょう</p>
        
        <form onSubmit={submit}>
          <label className="block text-slate-700 font-bold mb-3 text-lg">
            ユーザー名
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="あなたのユーザー名"
            disabled={loading}
            className="w-full px-5 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent mb-6 transition-all"
          />
          {error && <div className="text-red-600 text-sm mb-4 p-3 bg-red-50/95 rounded-lg border border-red-200 font-semibold">{error}</div>}
          {success && (
            <div className="text-emerald-600 text-sm mb-4 p-3 bg-emerald-50/95 rounded-lg border border-emerald-200 font-semibold">{success}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary hover:shadow-lg text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? '⏳ 追加中...' : '✨ ユーザーを追加'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
