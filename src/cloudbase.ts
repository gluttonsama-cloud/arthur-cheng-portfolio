import cloudbase from '@cloudbase/js-sdk';

const app = cloudbase.init({
  env: 'frist-1-6gby1les17e6401d' 
});

const auth = app.auth();
const db = app.database();

/**
 * 获取指定项目的点赞总数
 */
export async function getProjectLikes(projectId: string): Promise<number> {
  try {
    // 首次调用保证匿名登录状态完成
    const loginState = await auth.getLoginState();
    if (!loginState) {
      await auth.anonymousAuthProvider().signIn();
    }
    
    // 由于数据库规则限制，可能直接 .count() 匿名无权限获取所有记录。
    // 在这里我们获取 count
    const res = await db.collection('project_likes').where({ projectId }).count();
    return res.total;
  } catch (err) {
    console.error('获取项目点赞失败', err);
    return 0; // 如果 collection 未创建或无权限，返回 0
  }
}

/**
 * 添加当前用户的点赞记录
 * 前提是必须开启在控制台：身份认证 -> 登录方式 -> **匿名登录**
 * 及 数据库 project_likes 的权限推荐为：所有用户可读，仅创建者及管理员可读写。
 */
export async function likeProject(projectId: string): Promise<boolean> {
  try {
    let loginState = await auth.getLoginState();
    if (!loginState) {
      await auth.anonymousAuthProvider().signIn();
      loginState = await auth.getLoginState();
    }
    
    if (!loginState) {
        throw new Error("CloudBase Login Failed: 请检开发控制台是否开启【匿名登录】并配置【安全域名】。");
    }

    const uid = loginState.user.uid || '{openid}';
    console.log(`[CloudBase] Current UID: ${uid}`);

    // 查询是否已点赞
    const existing = await db.collection('project_likes').where({ 
        projectId, 
        _openid: uid 
    }).get();

    if (existing.data && existing.data.length > 0) {
        // 已经点赞过
        return false;
    }

    await db.collection('project_likes').add({
      projectId,
      createdAt: db.serverDate()
    });
    
    return true;
  } catch (err) {
    console.error('点赞失败', err);
    return false;
  }
}

/**
 * 检查当前用户是否已点赞某项目
 */
export async function checkHasLiked(projectId: string): Promise<boolean> {
    try {
        const loginState = await auth.getLoginState();
        if (!loginState) return false;

        const uid = loginState.user.uid || '{openid}';
        const existing = await db.collection('project_likes')
                           .where({ projectId, _openid: uid })
                           .get();
        return existing.data && existing.data.length > 0;
    } catch(err) {
        return false;
    }
}

/**
 * 记录一次访问量
 */
export async function trackVisit(): Promise<void> {
    try {
        const loginState = await auth.getLoginState() || await auth.anonymousAuthProvider().signIn();
        if (!loginState) return;

        const statsDoc = db.collection('system_stats').doc('visitor_stats');
        const res = await statsDoc.get();

        if (res.data && res.data.length > 0) {
            await statsDoc.update({
                total_visits: db.command.inc(1),
                last_visit: db.serverDate()
            });
        } else {
            // 初始化
            await statsDoc.set({
                total_visits: 1,
                last_visit: db.serverDate()
            });
        }
    } catch (err) {
        console.error('[CloudBase] 访问统计更新失败', err);
    }
}

/**
 * 获取总访问量
 */
export async function getVisitorStats(): Promise<number> {
    try {
        const res = await db.collection('system_stats').doc('visitor_stats').get();
        if (res.data && res.data.length > 0) {
            return res.data[0].total_visits || 0;
        }
        return 0;
    } catch (err) {
        return 0;
    }
}

/**
 * 词语库定义
 */
export const ADVICE_LIBRARY = {
  templates: [
    "{subject}{verb}{descriptor}",
    "{subject}{verb}",
    "{subject}{descriptor}",
    "{verb}{descriptor}",
    "{subject}！"
  ],
  subjects: ["你好", "大佬", "路过的", "这份作品", "前方", "这里", "在那之后", "前有", "前无", "设计", "动效", "代码", "交互", "细节", "太阳", "无火的余灰", "秘密", "陷阱"],
  verbs: ["路过这里", "太酷了", "很流畅", "非常有创意", "亮瞎眼", "震撼人心", "有待优化", "有", "没有", "难道是", "竟然有", "很有用", "值得赞美", "赞美", "小心", "存在着"],
  descriptors: ["马", "巨大宝箱", "宝藏", "绝景", "希望", "绝望", "🔥", "👍", "💯", "(瑞思拜)", "(跪了)", "！", "？", "......", "哦！", "赞美它！"]
};

export interface AdviceMessage {
  _id?: string;
  templateIdx: number;
  subjectIdx: number;
  verbIdx?: number;
  descriptorIdx?: number;
  createdAt?: any;
}

/**
 * 发布谏言
 */
export async function addAdvice(advice: Omit<AdviceMessage, '_id' | 'createdAt'>): Promise<boolean> {
  try {
    const loginState = await auth.getLoginState() || await auth.anonymousAuthProvider().signIn();
    if (!loginState) return false;

    await db.collection('system_messages').add({
      ...advice,
      createdAt: db.serverDate()
    });
    return true;
  } catch (err) {
    console.error('[CloudBase] 发布谏言失败', err);
    return false;
  }
}

/**
 * 获取最新谏言
 */
export async function getAdvices(): Promise<AdviceMessage[]> {
  try {
    const res = await db.collection('system_messages')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    return res.data;
  } catch (err) {
    return [];
  }
}
