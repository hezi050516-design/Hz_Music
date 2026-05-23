# 音乐 App 设计文档

## 概述

一款连接本机后端的移动端音乐 App，支持本地音乐播放、网络流媒体播放、文件上传和音乐库管理。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React |
| 移动端打包 | Capacitor (WebView 套壳) |
| 后端 | Go (net/http) |
| 数据库 | SQLite |
| 音频协议 | HTTP Range requests |
| API 风格 | REST |

## 整体架构

```
┌─────────────────────────┐         HTTP/REST          ┌─────────────────────────┐
│  移动端 (React App)      │ ◄──────────────────────►  │   本机 Go 后端           │
│                         │       + HTTP Range 流       │                         │
│  Capacitor WebView      │         (局域网)            │  net/http + SQLite       │
│  React + React Router   │                            │  本地文件扫描 + 上传处理  │
│  HTML5 <audio>          │                            │                         │
└─────────────────────────┘                            └─────────────────────────┘
                                                                 │
                                                                 ▼
                                                        ┌─────────────────┐
                                                        │  本地音乐文件     │
                                                        │  (MP3/FLAC/WAV)  │
                                                        └─────────────────┘
```

## 后端 API

| 接口 | 方法 | 说明 |
|------|------|------|
| `GET /api/songs` | 获取音乐列表（分页+搜索） | 支持 `?q=关键词&page=1&limit=20` |
| `GET /api/songs/:id` | 获取单曲详情 | 含封面 URL、专辑、艺术家 |
| `GET /api/songs/:id/stream` | 流式播放音频 | HTTP Range 请求 |
| `GET /api/albums` | 专辑列表 | 按专辑分组 |
| `GET /api/artists` | 艺术家列表 | 按艺术家分组 |
| `POST /api/upload` | 上传音乐文件 | multipart/form-data |
| `POST /api/scan` | 触发重新扫描本地目录 | 扫描新文件 |

## 数据库 (SQLite)

- **songs**: id, title, artist, album, duration, cover_path, file_path, file_size, format, created_at
- **albums**: id, name, artist, cover_path
- **artists**: id, name

## 前端页面结构

```
App
├── 音乐库 (Library)
│   ├── 所有歌曲列表
│   ├── 专辑视图
│   └── 艺术家视图
├── 搜索
├── 上传 (Upload)
│   ├── 选择文件
│   ├── 上传进度
│   └── 完成提示
├── 播放器 (底部固定)
│   ├── 歌曲信息 + 封面
│   ├── 播放/暂停、上一首、下一首
│   ├── 进度条（可拖动）
│   └── 音量控制
└── 设置 (Settings)
    └── 后端地址配置
```

## 技术要点

- React Router 管理页面路由
- React Context 管理播放状态
- `<audio>` 元素 + 自定义控件
- Capacitor 打包 Android/iOS
- 后端地址手动配置（局域网连接）

## 项目目录结构

```
D:\Hz_Music\
├── client/              ← React 前端源码
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   └── package.json
├── server/              ← Go 后端源码
│   ├── main.go
│   ├── handlers/
│   ├── models/
│   ├── db/
│   └── go.mod
├── music/               ← 默认音乐存放目录
├── covers/              ← 封面缓存目录
├── docs/
│   └── superpowers/
│       └── specs/
└── opencode.json
```
