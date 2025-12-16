import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Logging in with name:', name);

      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });

      console.log('Login response:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error:', errorData);
        setError(errorData.error || 'ユーザーが見つかりません');
        setLoading(false);
        return;
      }

      const userData = await response.json();
      console.log('Login successful, user data:', userData);

      // ユーザーデータをlocalStorageに保存
      localStorage.setItem('currentUser', JSON.stringify(userData));

      // プロフィールページにリダイレクト
      navigate('/profile');
    } catch (err) {
      console.error('Login fetch error:', err);
      setError('ログインに失敗しました。もう一度お試しください。');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-subtle">
      <div className="bg-white/95 backdrop-blur border border-slate-200 p-12 rounded-2xl shadow-2xl max-w-sm w-full animate-slide-up">
        <h2 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent text-center">
          スキル交換
        </h2>
        <p className="text-slate-600 text-center mb-8 text-sm">
          ユーザーにログインして始めましょう
        </p>

        {error && (
          <div className="text-red-600 text-sm mb-4 p-3 bg-red-50/95 rounded-lg border border-red-200 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-slate-700 font-bold mb-3 text-lg"
            >
              ユーザー名
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="あなたのユーザー名"
              required
              disabled={loading}
              className="w-full px-5 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary hover:shadow-lg text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>ログイン中...</span>
              </>
            ) : (
              '🔓 ログイン'
            )}
          </button>
        </form>

        <p className="text-slate-600 text-center mt-6 text-sm">
          アカウントをお持ちでないですか？{' '}
          <Link
            to="/register"
            className="text-emerald-600 font-bold hover:underline"
          >
            登録はこちら
          </Link>
        </p>
      </div>
    </div>
  );
}
