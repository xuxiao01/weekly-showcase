import type { WeeklyReportWeek } from '../weeklyReports'

export const reportWeek2026W23: WeeklyReportWeek = {
  id: '2026-W23',
  weekLabel: '第 23 周',
  dateRange: '2026.06.01 - 2026.06.05',
  shortDateRange: '06.01 - 06.05',
  reports: [
    {
      id: 1,
      weekLabel: '第 23 周',
      dateRange: '2026.06.01 - 2026.06.05',
      shortDateRange: '06.01 - 06.05',
      partLabel: '第一部分',
      title: '小程序开发',
      completed: [
        { title: '优化了识字量小程序的主包大小', description: '' },
        {
          title:
            '加了数据埋点，一个是自定义的首屏加载时间，另一个是点击看图写话的点击量',
          description: '',
        },
        { title: '首页分享功能已上线', description: '' },
      ],
      nextPlans: [
        { title: '给小程序做分包', description: '' },
        { title: '加入错题回顾页面', description: '' },
      ],
    },
    {
      id: 2,
      weekLabel: '第 23 周',
      dateRange: '2026.06.01 - 2026.06.05',
      shortDateRange: '06.01 - 06.05',
      partLabel: '第二部分',
      title: '游戏试玩平台开发',
      completed: [
        {
          title: '做了是否引入 GSAP-skill 和动画库的对照实验',
          description: '',
        },
        {
          title:
            '开发了词语搭配挑战、文字躲猫猫、翻翻卡记忆挑战小游戏（已上线游戏试玩平台）',
          description: '',
        },
      ],
      nextPlans: [
        {
          title:
            '为每个小游戏加入文档功能，点击切换文档，展示玩法、音效、动效等设计信息，方便在其他地方复用',
          description: '',
        },
        { title: '评论区功能，收集组内好的想法与优化意见', description: '' },
      ],
    },
    {
      id: 3,
      weekLabel: '第 23 周',
      dateRange: '2026.06.01 - 2026.06.05',
      shortDateRange: '06.01 - 06.05',
      partLabel: '第三部分',
      title: '小墨作文小游戏开发',
      completed: [
        {
          title: '生成了一些项目中需要用到的图片素材，部分已经上线到了试玩平台中',
          description: '',
        },
      ],
      nextPlans: [
        {
          title:
            '音视频素材 Agent，自动去根据用户的想法，去一些网站下载一些相关的音视频',
          description: '',
        },
        { title: '更好的生成图片素材的方法', description: '' },
      ],
    },
  ],
}
