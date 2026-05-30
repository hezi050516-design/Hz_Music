# HzMusic

局域网自托管音乐播放器，Go 后端 + React 前端，支持手机 App（Capacitor）和浏览器访问。

## 功能

- 音乐库管理（扫描本地音乐文件、上传、搜索）
- 流式播放（HTTP Range，支持进度拖动）
- Spotify 风格深色 UI + 白天模式切换
- 用户注册/登录（验证码 + 密码校验 + 单会话）
- 歌词显示（在线获取 timestamped lyrics）
- 播放队列 + 三种播放模式（顺序/列表循环/单曲循环）
- Android App 打包（Capacitor）

~~梦游写的，什么功能都带点，AI太好用了AWA~~

## 快速开始

### 1. 启动后端

```bash
cd server
go build -o hz-music .
./hz-music
```

后端默认监听 `:8080`，启动时自动扫描 `music/` 目录。

### 2. 启动前端

```bash
cd client
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

### 3. 手机连接

手机和电脑在同一局域网，手机浏览器打开 `http://电脑IP:5173`，或打包 APK 安装。

## 项目结构

```
HzMusic/
├── server/           Go 后端
│   ├── main.go       入口 + 路由
│   ├── db/           JSON 文件数据库
│   ├── handlers/     API 处理（歌曲/歌手/上传/认证）
│   ├── models/       数据模型
│   └── scanner/      音乐文件扫描
├── client/           React 前端
│   ├── src/
│   │   ├── api/      API 客户端
│   │   ├── context/  React Context（播放/认证/主题）
│   │   ├── components/ 组件
│   │   └── pages/    页面
│   └── android/      Capacitor Android
├── music/            音乐文件存放（gitignore）
├── music.json        数据库文件（gitignore）
└── start-backend.bat / start-frontend.bat 一键启动脚本
```

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/songs | 歌曲列表（?q=&page=&limit=） |
| GET | /api/songs/:id | 歌曲详情 |
| GET | /api/songs/:id/stream | 流式播放 |
| GET | /api/artists | 歌手列表 |
| GET | /api/captcha | 获取验证码 |
| POST | /api/register | 注册 {username, password, password_again, captcha_id, captcha_answer} |
| POST | /api/login | 登录 {username, password, captcha_id, captcha_answer} |
| POST | /api/upload | 上传音乐（需 Authorization header） |
| POST | /api/scan | 重新扫描音乐目录 |

## 文件命名规范

音乐文件命名格式：`歌名_歌手.mp3`

例如：`花海_周杰伦.mp3`

## 打包 Android APK

```bash
cd client
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

APK 输出路径：`android/app/build/outputs/apk/debug/app-debug.apk`

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Go (net/http) |
| 存储 | JSON 文件 |
| 前端 | React + Vite |
| UI | Spotify 风格 + lucide-react 图标 |
| 移动端 | Capacitor |
| 歌词 | timestamped-lyrics |
