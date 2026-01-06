# 妈妈的潮剧大剧院 - 项目文件结构

## 项目概述
- 技术栈：React.js + Tailwind CSS
- 部署：Vercel 或 GitHub Pages
- 数据存储：LocalStorage + JSON

## 文件结构

### 核心组件文件

1. **App.js** - 主应用组件
   - 顶部导航栏（看大戏、听唱段、我的收藏、家人留言）
   - 视频网格展示区域
   - 语音搜索按钮
   - 农历节气显示
   - 家人留言板预览

2. **components/VideoPlayer.js** - 视频播放组件
   - Bilibili iframe播放器集成
   - 全屏播放控制
   - 视频信息展示
   - 收藏按钮

3. **components/VideoGrid.js** - 视频网格组件
   - 响应式网格布局
   - 视频卡片展示
   - 分类筛选
   - 搜索功能

4. **components/Favorites.js** - 收藏页面
   - 收藏列表展示
   - 删除收藏功能
   - 播放历史记录

5. **components/Admin.js** - 管理后台
   - 密码保护
   - 添加新视频
   - 编辑视频信息
   - 管理留言板

6. **components/VoiceSearch.js** - 语音搜索组件
   - Web Speech API集成
   - 语音识别界面
   - 搜索结果展示

### 数据文件

7. **data/operas.json** - 潮剧数据
   - 经典剧目信息
   - B站视频ID
   - 分类标签
   - 封面图片

8. **data/categories.json** - 分类数据
   - 才子佳人
   - 经典苦情
   - 热闹武戏
   - 喜庆贺岁

### 样式文件

9. **styles.css** - 自定义样式
   - 潮汕传统配色
   - 大字体样式
   - 响应式布局
   - 动画效果

### 工具文件

10. **utils/dateUtils.js** - 日期工具
    - 农历转换
    - 节气计算
    - 节日判断

11. **utils/storageUtils.js** - 存储工具
    - LocalStorage操作
    - 收藏数据管理
    - 设置保存

## 核心功能模块

### 第一阶段：UI框架
- 超大导航按钮（最小80px高度）
- 24px+字体大小
- 高对比度配色
- 响应式网格布局

### 第二阶段：内容引擎
- Bilibili视频集成
- 自动分类系统
- 搜索功能
- 收藏系统

### 第三阶段：智能功能
- 语音搜索
- 远程管理
- 农历节气
- 家人留言

## 数据结构示例

### 视频数据
```json
{
  "id": "unique_id",
  "title": "苏六娘",
  "category": "才子佳人",
  "bvid": "Bilibili视频ID",
  "thumbnail": "封面图片URL",
  "description": "剧情简介",
  "duration": "时长",
  "tags": ["经典", "姚璇秋"]
}
```

### 收藏数据
```json
{
  "favorites": ["video_id1", "video_id2"],
  "history": [{"video_id", "watch_time", "date"}],
  "settings": {"font_size", "voice_enabled"}
}
```
