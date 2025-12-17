import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MatchesPage from './pages/MatchesPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MessagePage from './pages/MessagePage';
import ChatRoomsPage from './pages/ChatRoomsPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/messages/:id" element={<MessagePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat-rooms" element={<ChatRoomsPage />} />
        <Route path="/chat/:chatRoomId" element={<ChatPage />} />{' '}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
