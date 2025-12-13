import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    // store a simple user entry (in production use backend)
    const usersRaw = localStorage.getItem('users_db');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const user = { id: Date.now(), email };
    users.push(user);
    localStorage.setItem('users_db', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>アカウント作成</h2>
        <form onSubmit={submit}>
          <label>メールアドレス</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <label>パスワード</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" className="connect-btn">作成してログイン</button>
            <Link to="/login" className="remove-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>ログインへ戻る</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
