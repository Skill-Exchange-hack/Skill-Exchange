import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatRoomId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isMountedRef = useRef(true);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // ユーザーが登録されていない場合はリダイレクト
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      navigate('/register');
    }
  }, [currentUser.id, navigate]);

  // クリーンアップ - このEffectが最初に実行される必要がある
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // チャットメッセージを取得
  useEffect(() => {
    let isFirstLoad = true;

    const fetchMessages = async () => {
      if (!isMountedRef.current) return;

      try {
        // 初回読み込み以外はローディング表示しない
        if (isFirstLoad) {
          setLoading(true);
          isFirstLoad = false;
        }
        setError(null);

        // チャットルーム情報を取得
        const chatRoomRes = await fetch(
          `http://localhost:8000/api/chat-rooms/${chatRoomId}`
        );
        if (!chatRoomRes.ok) {
          throw new Error(`チャットルーム取得エラー: ${chatRoomRes.status}`);
        }
        const chatRoomData = await chatRoomRes.json();
        console.log('Chat room:', chatRoomData);

        // マッチ情報から相手を特定
        if (chatRoomData.match) {
          const other =
            chatRoomData.match.user1_id === currentUser.id
              ? chatRoomData.match.user2
              : chatRoomData.match.user1;
          if (isMountedRef.current) {
            setOtherUser(other);
          }
        }

        // メッセージを取得
        const messagesRes = await fetch(
          `http://localhost:8000/api/chat-messages?chat_room_id=${chatRoomId}&limit=100`
        );
        if (!messagesRes.ok) {
          throw new Error(`メッセージ取得エラー: ${messagesRes.status}`);
        }
        const messagesData = await messagesRes.json();
        if (isMountedRef.current) {
          setMessages(messagesData);
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError('データの取得に失敗しました: ' + err.message);
          console.error('Fetch error:', err);
        }
      } finally {
        if (isMountedRef.current && isFirstLoad === false) {
          setLoading(false);
        }
      }
    };

    if (chatRoomId && currentUser.id) {
      fetchMessages();
      // 初回読み込み後、5秒ごとにメッセージをポーリング
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [chatRoomId, currentUser.id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    try {
      setIsSending(true);
      const response = await fetch('http://localhost:8000/api/chat-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_room_id: parseInt(chatRoomId),
          sender_id: currentUser.id,
          message: newMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('エラー:', errorData);
        throw new Error(
          errorData.errors
            ? Object.values(errorData.errors).flat().join(', ')
            : `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const newMsg = await response.json();
      setMessages([...messages, newMsg]);
      setNewMessage('');
      console.log('メッセージを送信しました:', newMsg);
    } catch (err) {
      console.error(err);
      setError('メッセージ送信エラー: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  if (!currentUser || !currentUser.id) {
    return <div className="p-5">リダイレクト中...</div>;
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-subtle">
      {/* ヘッダー */}
      <header className="bg-white/95 backdrop-blur p-6 shadow-lg border-b border-slate-200">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/chat-rooms')}
              className="text-slate-600 hover:text-slate-800 font-bold"
            >
              ← 戻る
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                💬 {otherUser?.name || 'チャット'}
              </h1>
              {otherUser && (
                <p className="text-sm text-slate-500">
                  ユーザーID: {otherUser.id}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* メッセージエリア */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-6 h-[500px] overflow-y-auto mb-6 shadow-lg">
          {error && (
            <div className="text-red-600 text-sm p-4 bg-red-50 rounded-lg mb-4 border border-red-200">
              {error}
            </div>
          )}

          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <p className="text-lg">メッセージはまだありません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isOwnMessage = msg.sender_id === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isOwnMessage ? 'justify-end' : 'justify-start'
                    } animate-fade-in`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-gradient-primary text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-white/70' : 'text-slate-500'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString('ja-JP')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* メッセージ入力エリア */}
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-6 shadow-lg">
          <div className="flex gap-3">
            <textarea
              className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="メッセージを入力..."
              rows="3"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  sendMessage();
                }
              }}
            />
            <button
              className="bg-gradient-primary hover:shadow-lg text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={sendMessage}
              disabled={!newMessage.trim() || isSending}
            >
              {isSending ? '送信中...' : '📤 送信'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            💡 Ctrl + Enterでも送信できます
          </p>
        </div>
      </main>
    </div>
  );
}

export default ChatPage;
