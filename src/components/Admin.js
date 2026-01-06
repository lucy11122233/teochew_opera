import React, { useState, useEffect } from 'react';

// 管理后台组件
function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('add_video');
  const [newVideo, setNewVideo] = useState({
    title: '',
    category: '才子佳人',
    bvid: '',
    thumbnail: '',
    description: '',
    duration: '',
    tags: '',
    performer: '',
    year: ''
  });
  const [newMessage, setNewMessage] = useState({
    text: '',
    sender: '儿子'
  });
  const [videos, setVideos] = useState([]);
  const [messages, setMessages] = useState([]);

  // 管理员密码（在实际应用中应该从环境变量获取）
  const ADMIN_PASSWORD = 'mama123';

  // 从本地存储加载数据
  useEffect(() => {
    const savedVideos = localStorage.getItem('teochew_videos');
    const savedMessages = localStorage.getItem('teochew_messages');
    
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem('teochew_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('teochew_messages', JSON.stringify(messages));
  }, [messages]);

  // 登录验证
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('密码错误，请重试');
    }
  };

  // 添加新视频
  const handleAddVideo = (e) => {
    e.preventDefault();
    const video = {
      id: Date.now().toString(),
      ...newVideo,
      tags: newVideo.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    setVideos([...videos, video]);
    setNewVideo({
      title: '',
      category: '才子佳人',
      bvid: '',
      thumbnail: '',
      description: '',
      duration: '',
      tags: '',
      performer: '',
      year: ''
    });
    
    alert('视频添加成功！');
  };

  // 添加家人留言
  const handleAddMessage = (e) => {
    e.preventDefault();
    const message = {
      ...newMessage,
      date: new Date().toLocaleDateString('zh-CN'),
      id: Date.now()
    };
    
    setMessages([...messages, message]);
    setNewMessage({
      text: '',
      sender: '儿子'
    });
    
    alert('留言添加成功！');
  };

  // 删除视频
  const deleteVideo = (videoId) => {
    if (window.confirm('确定要删除这个视频吗？')) {
      setVideos(videos.filter(video => video.id !== videoId));
    }
  };

  // 删除留言
  const deleteMessage = (messageId) => {
    if (window.confirm('确定要删除这条留言吗？')) {
      setMessages(messages.filter(message => message.id !== messageId));
    }
  };

  // 渲染登录界面
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>管理后台登录</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>管理员密码：</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-btn">
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>管理后台</h2>
        <button 
          className="logout-btn"
          onClick={() => {
            setIsAuthenticated(false);
            setPassword('');
          }}
        >
          退出登录
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'add_video' ? 'active' : ''}`}
          onClick={() => setActiveTab('add_video')}
        >
          添加视频
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manage_videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage_videos')}
        >
          管理视频
        </button>
        <button 
          className={`tab-btn ${activeTab === 'add_message' ? 'active' : ''}`}
          onClick={() => setActiveTab('add_message')}
        >
          添加留言
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manage_messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage_messages')}
        >
          管理留言
        </button>
      </div>

      <div className="admin-content">
        {/* 添加视频 */}
        {activeTab === 'add_video' && (
          <div className="add-video-form">
            <h3>添加新视频</h3>
            <form onSubmit={handleAddVideo}>
              <div className="form-group">
                <label>剧目标题：</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                  placeholder="例如：苏六娘"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>分类：</label>
                <select
                  value={newVideo.category}
                  onChange={(e) => setNewVideo({...newVideo, category: e.target.value})}
                >
                  <option value="才子佳人">才子佳人</option>
                  <option value="经典苦情">经典苦情</option>
                  <option value="热闹武戏">热闹武戏</option>
                  <option value="喜庆贺岁">喜庆贺岁</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>B站视频ID (BV号)：</label>
                <input
                  type="text"
                  value={newVideo.bvid}
                  onChange={(e) => setNewVideo({...newVideo, bvid: e.target.value})}
                  placeholder="例如：BV1Zs411t7dL"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>封面图片URL：</label>
                <input
                  type="url"
                  value={newVideo.thumbnail}
                  onChange={(e) => setNewVideo({...newVideo, thumbnail: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              
              <div className="form-group">
                <label>剧情简介：</label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                  placeholder="简要描述剧情..."
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>时长：</label>
                <input
                  type="text"
                  value={newVideo.duration}
                  onChange={(e) => setNewVideo({...newVideo, duration: e.target.value})}
                  placeholder="例如：02:45:30"
                />
              </div>
              
              <div className="form-group">
                <label>主演：</label>
                <input
                  type="text"
                  value={newVideo.performer}
                  onChange={(e) => setNewVideo({...newVideo, performer: e.target.value})}
                  placeholder="例如：姚璇秋"
                />
              </div>
              
              <div className="form-group">
                <label>年份：</label>
                <input
                  type="text"
                  value={newVideo.year}
                  onChange={(e) => setNewVideo({...newVideo, year: e.target.value})}
                  placeholder="例如：1958"
                />
              </div>
              
              <div className="form-group">
                <label>标签 (用逗号分隔)：</label>
                <input
                  type="text"
                  value={newVideo.tags}
                  onChange={(e) => setNewVideo({...newVideo, tags: e.target.value})}
                  placeholder="例如：经典,爱情,姚璇秋"
                />
              </div>
              
              <button type="submit" className="submit-btn">
                添加视频
              </button>
            </form>
          </div>
        )}

        {/* 管理视频 */}
        {activeTab === 'manage_videos' && (
          <div className="manage-videos">
            <h3>管理视频 ({videos.length}个)</h3>
            <div className="videos-list">
              {videos.map(video => (
                <div key={video.id} className="video-item">
                  <div className="video-info">
                    <h4>{video.title}</h4>
                    <p>分类：{video.category}</p>
                    <p>BV号：{video.bvid}</p>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteVideo(video.id)}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 添加留言 */}
        {activeTab === 'add_message' && (
          <div className="add-message-form">
            <h3>添加家人留言</h3>
            <form onSubmit={handleAddMessage}>
              <div className="form-group">
                <label>留言内容：</label>
                <textarea
                  value={newMessage.text}
                  onChange={(e) => setNewMessage({...newMessage, text: e.target.value})}
                  placeholder="写下想对妈妈说的话..."
                  rows="4"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>署名：</label>
                <input
                  type="text"
                  value={newMessage.sender}
                  onChange={(e) => setNewMessage({...newMessage, sender: e.target.value})}
                  placeholder="例如：儿子、女儿"
                  required
                />
              </div>
              
              <button type="submit" className="submit-btn">
                发送留言
              </button>
            </form>
          </div>
        )}

        {/* 管理留言 */}
        {activeTab === 'manage_messages' && (
          <div className="manage-messages">
            <h3>管理留言 ({messages.length}条)</h3>
            <div className="messages-list">
              {messages.map(message => (
                <div key={message.id} className="message-item">
                  <div className="message-content">
                    <p>{message.text}</p>
                    <small>- {message.sender} ({message.date})</small>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteMessage(message.id)}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
