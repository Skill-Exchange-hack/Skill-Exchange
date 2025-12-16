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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">ユーザー追加</h2>
        <form onSubmit={submit}>
          <label className="block text-gray-700 font-semibold mb-3">
            ユーザー名
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ユーザー名を入力"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
          />
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm mb-4">{success}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? '追加中...' : 'ユーザーを追加'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
