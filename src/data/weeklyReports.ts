export interface WeeklyReport {
  id: number
  weekLabel: string
  dateRange: string
  shortDateRange: string
  partLabel: string
  title: string
  summary: string
  completed: {
    title: string
    description: string
  }[]
  nextPlans: {
    title: string
    description: string
  }[]
}

export const weeklyReports: WeeklyReport[] = [
  {
    id: 1,
    weekLabel: '第 23 周',
    dateRange: '2026.06.01 - 2026.06.05',
    shortDateRange: '06.01 - 06.05',
    partLabel: '第一部分',
    title: '小程序开发',
    summary: '围绕核心业务流程推进小程序页面与交互，优先保证主要链路可用、信息层级清晰。',
    completed: [
      {
        title: '首页与核心入口整理',
        description: '优化首页模块排布，统一按钮、卡片与状态提示样式，提升首屏可读性。',
      },
      {
        title: '业务流程页面推进',
        description: '完成关键页面结构搭建，并补齐页面跳转、数据展示与空状态处理。',
      },
      {
        title: '接口联调与问题修复',
        description: '配合后端完成主要接口联调，修复字段兼容、加载状态和异常提示问题。',
      },
    ],
    nextPlans: [
      {
        title: '继续完善细节体验',
        description: '重点处理表单校验、页面反馈、弱网状态和移动端适配问题。',
      },
      {
        title: '准备阶段性验收',
        description: '整理测试用例与问题清单，推进小程序核心流程进入可验收状态。',
      },
    ],
  },
  {
    id: 2,
    weekLabel: '第 23 周',
    dateRange: '2026.06.01 - 2026.06.05',
    shortDateRange: '06.01 - 06.05',
    partLabel: '第二部分',
    title: '小游戏试玩平台开发',
    summary: '本周聚焦试玩平台基础能力和页面框架，推动从内容展示到试玩转化的基础链路成型。',
    completed: [
      {
        title: '平台页面框架搭建',
        description: '完成试玩平台首页、游戏列表与详情页的基础结构，统一页面栅格与信息密度。',
      },
      {
        title: '试玩入口与状态流转',
        description: '梳理试玩入口、任务状态和结果反馈逻辑，保证用户能清楚识别当前进度。',
      },
      {
        title: '内容配置能力整理',
        description: '补充游戏配置字段，支持封面、标签、试玩说明和基础排序展示。',
      },
    ],
    nextPlans: [
      {
        title: '试玩链路继续细化',
        description: '完善任务领取、试玩计时、结果提交与异常恢复逻辑。',
      },
      {
        title: '后台配置与数据埋点',
        description: '推进配置后台字段联调，并补充关键行为埋点，便于后续观察转化效果。',
      },
      {
        title: '视觉规范收口',
        description: '统一列表、标签、按钮和详情区样式，让试玩平台页面更稳定易扫读。',
      },
    ],
  },
]
