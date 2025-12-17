import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function ChatRoomsPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isMountedRef = useRef(true);

  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastMessages, setLastMessages] = useState({});

  // ユーザーが登録されていない場合はリダイレクト
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      navigate('/register');
    }
  }, [currentUser.id, navigate]);

  // クリーンアップ
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // チャットルーム一覧を取得
  useEffect(() => {
    let isFirstLoad = true;

    const fetchChatRooms = async () => {
      if (!isMountedRef.current) return;

      try {
        // 初回読み込み以外はローディング表示しない
        if (isFirstLoad) {
          setLoading(true);
          isFirstLoad = false;
        }
        setError(null);

        console.log('Fetching chat rooms for user:', currentUser.id);
        const response = await fetch(
          `http://localhost:8000/api/chat-rooms?user_id=${currentUser.id}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', errorData);
          throw new Error(`チャットルーム取得エラー: ${response.status}`);
        }

        const data = await response.json();
        console.log('Chat rooms:', data);

        if (isMountedRef.current) {
          setChatRooms(data);

          // 各チャットルームの最新メッセージを取得
          const messagesMap = {};
          for (const room of data) {
            try {
              const msgRes = await fetch(
                `http://localhost:8000/api/chat-messages/latest?chat_room_id=${room.id}&count=1`
              );
              if (msgRes.ok) {
                const msgs = await msgRes.json();
                if (msgs.length > 0) {
                  messagesMap[room.id] = msgs[0];
                }
              }
            } catch (err) {
              console.error(
                `Failed to fetch message for room ${room.id}:`,
                err
              );
            }
          }
          if (isMountedRef.current) {
            setLastMessages(messagesMap);
          }
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError('データの取得に失敗しました: ' + err.message);
        }
        console.error(err);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (currentUser && currentUser.id) {
      fetchChatRooms();
      // 5秒ごとに更新（ポーリング）
      const interval = setInterval(fetchChatRooms, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser.id]);

  if (!currentUser || !currentUser.id) {
    return <div className="p-5">リダイレクト中...</div>;
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-subtle">
      <main className="flex-1 flex flex-col">
        <header className="bg-white/95 backdrop-blur p-8 shadow-lg border-b border-slate-200">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            💬 メッセージ
          </h1>
          <p className="text-slate-600 mt-2">
            スキル交換中のメンバーとチャットしましょう
          </p>
        </header>

        {error && (
          <div className="text-red-600 text-sm p-5 bg-red-50/95 m-5 rounded-xl border border-red-200 backdrop-blur font-semibold">
            {error}
          </div>
        )}

        <section className="p-8 flex-1">
          <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-lg border border-slate-200">
            {chatRooms.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 text-lg mb-4">
                  📭 チャットルームがありません
                </p>
                <p className="text-slate-400 text-sm mb-6">
                  マッチングページでユーザーと接続してチャットを開始しましょう
                </p>
                <Link
                  to="/matches"
                  className="inline-block bg-gradient-primary hover:shadow-lg text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  🤝 マッチングページへ
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {chatRooms.map((room) => {
                  const lastMsg = lastMessages[room.id];
                  const messagePreview = lastMsg
                    ? (lastMsg.sender_id === currentUser.id ? 'あなた: ' : '') +
                      lastMsg.message.substring(0, 30) +
                      (lastMsg.message.length > 30 ? '...' : '')
                    : 'メッセージがまだありません';
                  const lastMsgTime = lastMsg
                    ? new Date(lastMsg.created_at).toLocaleString('ja-JP', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '';

                  return (
                    <Link
                      key={room.id}
                      to={`/chat/${room.id}`}
                      className="p-5 rounded-xl border-2 border-slate-200 bg-white hover:shadow-lg hover:border-cyan-300 transition-all duration-300 animate-fade-in cursor-pointer block hover:bg-slate-50"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          {/* ユーザー名と時刻 */}
                          <div className="flex justify-between items-center gap-2 mb-2">
                            <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                              👤 {room.other_user.name}
                            </div>
                            {lastMsgTime && (
                              <div className="text-xs text-slate-400 whitespace-nowrap">
                                {lastMsgTime}
                              </div>
                            )}
                          </div>

                          {/* 最後のメッセージプレビュー */}
                          <div className="text-sm text-slate-600 mb-3 truncate">
                            💬 {messagePreview}
                          </div>

                          {/* スキル交換情報 */}
                          <div className="text-xs text-slate-500">
                            💱 {room.skill_exchange.user1_skill} ↔{' '}
                            {room.skill_exchange.user2_skill}
                          </div>
                        </div>
                        <div className="text-2xl flex-shrink-0">💬</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ChatRoomsPage;
