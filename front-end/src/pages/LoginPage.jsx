import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    // simple local auth: accept any non-empty credentials
    if (!email.trim() || !password) {
      setError('メールとパスワードを入力してください。');
      return;
    }
    const user = { id: Date.now(), email };
    localStorage.setItem('currentUser', JSON.stringify(user));
    setError('');
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>ログイン</h2>
        <form onSubmit={submit}>
          <label>メールアドレス</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <label>パスワード</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
          {error && <div className="form-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" className="connect-btn">ログイン</button>
            <button type="button" className="remove-btn" onClick={() => { setEmail(''); setPassword(''); }}>クリア</button>
          </div>
        </form>

        <div style={{ marginTop: 16, color: '#555' }}>
          アカウントがない方は <Link to="/register" className="auth-create-link">こちらから作成</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
