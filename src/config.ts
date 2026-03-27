/**
 * ============================================
 * 个人主页配置文件
 * ============================================
 * 
 * 修改此文件中的内容即可更新你的个人主页
 * 所有字段都有详细注释说明
 */

// ==========================================
// 个人信息
// ==========================================

export const PROFILE = {
  // 网站标题（显示在导航栏）
  siteName: 'SYS.ARCHIVE',

  // 你的名字（可选，目前未使用）
  name: '程彦硕',

  // 个人简介 - 第一段（主要描述）
  bioPrimary: `Freshman exploring full-stack development. Currently learning full-stack dev, game dev, and AI agents—curious about turning ideas into reality.
大一学生，正在探索计算机的各方各面。目前在学习全栈开发、游戏开发与 AI Agent 应用，对将创意变成现实的过程充满好奇。`,

  // 个人简介 - 第二段（补充说明）
  bioSecondary: `Keeping an open mind, trying different directions. Every project is a learning opportunity.
保持开放的心态，尝试不同的技术方向。每一个项目都是一次学习的机会。`,

  // 网站标题栏文字
  navLinks: [
    { label: 'VIEWPORT', href: '#viewport' },
    { label: 'MEDIA_STREAM', href: '#media' },
    { label: 'DATABANKS', href: '#databanks' },
    { label: 'UPLINK', href: '#uplink' },
  ],
} as const;

// ==========================================
// 视频展示数据
// ==========================================

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  tags: string[];
}

export const VIDEOS: VideoItem[] = [
  {
    id: 'V1',
    title: 'WEPRINT_SYSTEM_DEMO',
    description: '智能 3D 打印服务平台演示视频 - 核心流程展示',
    url: '/images/WePrint-mobile.mp4',
    thumbnail: '/images/WePrint-1.png',
    tags: ['AI', '3D_PRINT', 'APP']
  },
  {
    id: 'V2',
    title: 'WEPRINT_SYSTEM_DEMO',
    description: '智能 3D 打印服务平台演示视频 - 核心流程展示',
    url: '/images/WePrint-web1.mp4',
    thumbnail: '/images/WePrint-1.png',
    tags: ['AI', '3D_PRINT', 'WEB']
  }
];

// ==========================================
// 技能列表
// ==========================================

export const SKILLS = [
  'HTML / CSS / JS',
  'REACT / VUE',
  'NODE.JS',
  'DATABASE',
  'GAME DEV',
  'AI AGENT',
] as const;

// ==========================================
// 社交链接
// ==========================================

export const SOCIAL_LINKS = {
  // GitHub 个人主页链接
  github: 'https://github.com/gluttonsama-cloud',

  // LinkedIn 个人主页链接
  linkedin: 'https://linkedin.com/in/yourusername',

  // 电子邮件地址（会自动转换为 mailto: 链接）
  email: 'gluttonsama@gmail.com',
} as const;

// ==========================================
// 项目数据
// ==========================================

export interface ProjectMedia {
  type: 'video' | 'image';
  url: string;
}

export interface Project {
  id: string;
  title: string;           // 项目标题（建议全大写，赛博朋克风格）
  year: string;            // 年份
  client: string;          // 客户/公司名称（或项目类型）
  description: string;     // 项目描述
  role: string;            // 你的角色
  tech: string[];          // 技术栈
  media: ProjectMedia[];   // 图片/视频链接
}

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'WePrint',
    year: '2026',
    client: '企业合作项目',
    description: '一站式智能 3D 打印服务平台，支持用户拍照建模、AI 生成 3D 模型、在线预览、下单打印。包含用户端、管理端、后端服务、GPU 服务四个子系统，集成 AI 智能助手实现订单审核与设备诊断自动化。',
    role: '主开发者',
    tech: ['REACT', 'NODE.JS', 'MONGODB', 'THREE.JS', 'LANGCHAIN'],
    media: [
      { type: 'image', url: '/images/WePrint-1.png' },
      { type: 'image', url: '/images/WePrint-2.png' },
      { type: 'image', url: '/images/WePrint-3.png' },
      { type: 'image', url: '/images/WePrint-4.png' },
      { type: 'image', url: '/images/WePrint-5.png' },
      { type: 'video', url: '/images/WePrint-mobile.mp4' },
      { type: 'video', url: '/images/WePrint-web.mp4' },
    ],
  },
  {
    id: '2',
    title: 'ImmerSing',
    year: '2025-2026',
    client: '独立游戏项目',
    description: '沉浸式音乐战斗游戏，玩家通过歌唱控制战斗节奏。基于 Unity URP 开发，包含行为树 AI、音频分析、Buff 系统、状态机架构等核心模块。',
    role: '技术总监 / 系统架构',
    tech: ['UNITY', 'C#', 'URP', '行为树', '音频系统'],
    media: [
      { type: 'image', url: '/images/ImmerSing-1.png' },
      { type: 'image', url: '/images/ImmerSing-2.png' },
      { type: 'image', url: '/images/ImmerSing-3.png' },
      { type: 'video', url: '/images/ImmerSing.mp4' },
    ],
  },
  {
    id: '3',
    title: '烹小白',
    year: '2025',
    client: '跨平台烹饪助手',
    description: '专为烹饪初学者设计的跨平台应用，集成 AI 烹饪助手、厨房食材管理、食谱发现等功能。基于 uni-app 开发，支持 H5、微信小程序等多端部署。',
    role: '主开发者',
    tech: ['VUE 3', 'UNI-APP', 'VITE', 'SCSS'],
    media: [
      { type: 'video', url: '/images/烹小白-1.mp4' },
      { type: 'video', url: '/images/烹小白-2.mp4' },
      { type: 'video', url: '/images/烹小白.mp4' },
    ],
  },
  {
    id: '4',
    title: 'NutriLife',
    year: '2026',
    client: '比赛项目',
    description: '私人终生饮食营养管理 APP，支持拍照识别食物、营养分析、个性化建议、周报复盘。基于 Flutter 开发，集成 AI 视觉识别与 LLM 智能建议。',
    role: '参赛项目',
    tech: ['FLUTTER', 'SUPABASE', 'AI 视觉', 'LLM'],
    media: [
      { type: 'image', url: 'https://picsum.photos/seed/nutrilife/800/450' },
    ],
  },
];

// ==========================================
// 模态框文字
// ==========================================

export const MODAL_TEXT = {
  // 项目详情页底部附加文字
  additionalInfo: `> ACCESS DENIED - INSUFFICIENT CLEARANCE FOR CLASSIFIED DATA`,

  // 文件标题格式（{title} 会被替换为项目标题）
  fileTitle: 'FILE: {title}.DAT',
} as const;

// ==========================================
// 状态栏文字
// ==========================================

export const STATUS_TEXT = {
  // 等待连接提示
  awaitingConnection: 'AWAITING TRANSMISSION...',

  // 建立连接标题
  connectionTitle: 'ESTABLISH_UPLINK',
} as const;