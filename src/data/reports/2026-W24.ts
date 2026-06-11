import type { WeeklyReportWeek } from '../weeklyReports'

export const reportWeek2026W24: WeeklyReportWeek = {
  id: '2026-W24',
  weekLabel: '第 24 周',
  dateRange: '2026.06.08 - 2026.06.12',
  shortDateRange: '06.08 - 06.12',
  reports: [
    {
      id: 1,
      weekLabel: '第 24 周',
      dateRange: '2026.06.08 - 2026.06.12',
      shortDateRange: '06.08 - 06.12',
      partLabel: '第一部分',
      title: '小墨作文小游戏开发',
      completed: [
        {
          title: '文字翻翻卡,词语消消乐,古诗填填乐,三个小游戏的第一版h5内网上线',
          description: '',
        },
        {
          title: '处理相关数据适配,三个游戏的接入洪恩 TTS 生成的音频',
          description: '',
        },
      ],
      nextPlans: [
        {
          title: '整体UI:三个小游戏的整体的布局边距增加,目前视觉上看着太挤了',
          description: '',
        },
        {
          title:
            '整体UI:三个小游戏的通用弹窗大小需要再设计一下,字号大小,字体目前是默认,引入霞鹜文楷 Web 字体(免费商用字体)',
          description: '',
        },
        {
          title:
            '词语消消乐 UI:提示太弱,改成组词消消乐首页顺序调整按照字词句的顺序,词语消消乐优化一下提示,让用户更好理解关卡',
          description: '',
        },
        {
          title:
            '玩法:将所有数据遍历,年级分类,新增关卡页,记忆关卡,本身孩子也能记一记玩到哪关了,先本地存储',
          description: '',
          images: [
            'https://typorabucket0308.oss-cn-beijing.aliyuncs.com/images/20260611144124374.png',
          ],
        },
      ],
    },
  ],
}
