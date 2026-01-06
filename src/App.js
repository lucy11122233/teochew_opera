import React, { useState, useEffect } from 'react';
import './styles.css';
import operasData from './data/operas.json';
import Admin from './components/Admin';

// 主应用组件
function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [lunarDate, setLunarDate] = useState('');

  // 从本地存储加载数据
  useEffect(() => {
    const savedFavorites = localStorage.getItem('teochew_favorites');
    const savedMessages = localStorage.getItem('teochew_messages');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    
    // 计算农历日期（简化版本）
    updateLunarDate();
  }, []);

  // 保存收藏到本地存储
  useEffect(() => {
    localStorage.setItem('teochew_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 保存留言到本地存储
  useEffect(() => {
    localStorage.setItem('teochew_messages', JSON.stringify(messages));
  }, [messages]);

  // 更新农历日期
  const updateLunarDate = () => {
    const today = new Date();
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    
    // 简化的农历计算（实际项目中建议使用专业的农历库）
    const month = lunarMonths[today.getMonth()];
    const day = lunarDays[today.getDate() % 30];
    setLunarDate(`${month}${day}`);
  };

  // 语音搜索功能
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        alert('语音识别出错，请重试');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('您的浏览器不支持语音识别功能');
    }
  };

  // 过滤视频
  const filteredOperas = operasData.operas.filter(opera => {
    const matchesCategory = selectedCategory === 'all' || opera.category === selectedCategory;
    const matchesSearch = opera.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opera.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // 切换收藏状态
  const toggleFavorite = (operaId) => {
    setFavorites(prev => 
      prev.includes(operaId) 
        ? prev.filter(id => id !== operaId)
        : [...prev, operaId]
    );
  };

  // 播放视频
  const playVideo = (opera) => {
    setCurrentVideo(opera);
    setCurrentView('player');
  };

  // 渲染主页
  const renderHome = () => (
    <div className="home-container">
      {/* 农历显示 */}
      <div className="lunar-date">
        <span className="lunar-text">今日农历：{lunarDate}</span>
      </div>

      {/* 家人留言预览 */}
      {messages.length > 0 && (
        <div className="message-preview">
          <h3>💌 家人留言</h3>
          <div className="message-content">
            {messages[messages.length - 1].text}
          </div>
          <div className="message-sender">
            - {messages[messages.length - 1].sender}
          </div>
        </div>
      )}

      {/* 搜索栏 */}
      <div className="search-container">
        <input
          type="text"
          placeholder="搜索剧目或演员..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button 
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          onClick={startVoiceSearch}
        >
          🎤
        </button>
      </div>

      {/* 分类导航 */}
      <div className="category-nav">
        {operasData.categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/* 视频网格 */}
      <div className="video-grid">
        {filteredOperas.map(opera => (
          <div key={opera.id} className="video-card">
            <div className="video-thumbnail" onClick={() => playVideo(opera)}>
              <img src={opera.thumbnail} alt={opera.title} />
              <div className="play-overlay">
                <span className="play-btn">▶️</span>
              </div>
              <div className="video-duration">{opera.duration}</div>
            </div>
            <div className="video-info">
              <h3 className="video-title">{opera.title}</h3>
              <p className="video-description">{opera.description}</p>
              <div className="video-tags">
                {opera.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="video-actions">
                <button 
                  className={`favorite-btn ${favorites.includes(opera.id) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(opera.id)}
                >
                  {favorites.includes(opera.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染视频播放器
  const renderPlayer = () => {
    if (!currentVideo) return null;

    return (
      <div className="player-container">
        <div className="player-header">
          <button 
            className="back-btn"
            onClick={() => setCurrentView('home')}
          >
            ← 返回
          </button>
          <h2 className="player-title">{currentVideo.title}</h2>
        </div>
        
        <div className="video-player">
          <iframe
            src={`https://www.bilibili.com/video/${currentVideo.bvid}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            title={currentVideo.title}
          />
        </div>

        <div className="player-info">
          <div className="video-meta">
            <span className="performer">主演：{currentVideo.performer}</span>
            <span className="year">年份：{currentVideo.year}</span>
          </div>
          <p className="video-description">{currentVideo.description}</p>
          <div className="player-actions">
            <button 
              className={`favorite-btn-large ${favorites.includes(currentVideo.id) ? 'favorited' : ''}`}
              onClick={() => toggleFavorite(currentVideo.id)}
            >
              {favorites.includes(currentVideo.id) ? '❤️ 已收藏' : '🤍 收藏'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 渲染收藏页面
  const renderFavorites = () => {
    const favoriteOperas = operasData.operas.filter(opera => favorites.includes(opera.id));

    return (
      <div className="favorites-container">
        <h2 className="page-title">我的收藏 ❤️</h2>
        {favoriteOperas.length === 0 ? (
          <div className="empty-favorites">
            <p>还没有收藏任何剧目</p>
            <button className="browse-btn" onClick={() => setCurrentView('home')}>
              去浏览剧目
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favoriteOperas.map(opera => (
              <div key={opera.id} className="favorite-item">
                <div className="favorite-thumbnail" onClick={() => playVideo(opera)}>
                  <img src={opera.thumbnail} alt={opera.title} />
                  <div className="play-overlay">
                    <span className="play-btn">▶️</span>
                  </div>
                </div>
                <div className="favorite-info">
                  <h3>{opera.title}</h3>
                  <p>{opera.description}</p>
                  <button 
                    className="remove-favorite"
                    onClick={() => toggleFavorite(opera.id)}
                  >
                    移除收藏
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 渲染家人留言页面
  const renderMessages = () => (
    <div className="messages-container">
      <h2 className="page-title">家人留言 💌</h2>
      <div className="messages-list">
        {messages.map((message, index) => (
          <div key={index} className="message-item">
            <div className="message-text">{message.text}</div>
            <div className="message-meta">
              <span className="message-sender">- {message.sender}</span>
              <span className="message-date">{message.date}</span>
            </div>
          </div>
        ))}
      </div>
      {messages.length === 0 && (
        <p className="no-messages">暂无留言</p>
      )}
      
      {/* 管理后台入口 */}
      <div className="admin-entrance">
        <button 
          className="admin-btn"
          onClick={() => setCurrentView('admin')}
        >
          🔧 管理后台
        </button>
      </div>
    </div>
  );

  // 渲染管理后台
  const renderAdmin = () => (
    <Admin />
  );

  // 主渲染
  return (
    <div className="app">
      {/* 顶部导航 */}
      <header className="app-header">
        <h1 className="app-title">🎭 妈妈的潮剧大剧院</h1>
      </header>

      {/* 主内容区域 */}
      <main className="app-main">
        {currentView === 'home' && renderHome()}
        {currentView === 'player' && renderPlayer()}
        {currentView === 'favorites' && renderFavorites()}
        {currentView === 'messages' && renderMessages()}
        {currentView === 'admin' && renderAdmin()}
      </main>

      {/* 底部导航 */}
      <footer className="app-footer">
        <nav className="bottom-nav">
          <button 
            className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">看大戏</span>
          </button>
          <button 
            className={`nav-btn ${currentView === 'favorites' ? 'active' : ''}`}
            onClick={() => setCurrentView('favorites')}
          >
            <span className="nav-icon">❤️</span>
            <span className="nav-text">我的收藏</span>
          </button>
          <button 
            className={`nav-btn ${currentView === 'messages' ? 'active' : ''}`}
            onClick={() => setCurrentView('messages')}
          >
            <span className="nav-icon">💌</span>
            <span className="nav-text">家人留言</span>
          </button>
          <button 
            className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView('admin')}
          >
            <span className="nav-icon">🔧</span>
            <span className="nav-text">管理</span>
          </button>
        </nav>
      </footer>
    </div>
  );
}

export default App;