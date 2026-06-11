import type { WeeklyReport } from '../data/weeklyReports'

export interface ReportMetaDefaults {
  weekLabel: string
  dateRange: string
  shortDateRange: string
}

export type ParseWeeklyMdResult =
  | { ok: true; data: WeeklyReport[] }
  | { ok: false; message: string }

const PART_LABELS = [
  '第一部分',
  '第二部分',
  '第三部分',
  '第四部分',
  '第五部分',
  '第六部分',
  '第七部分',
  '第八部分',
  '第九部分',
  '第十部分',
]

function partLabelForIndex(index: number): string {
  return PART_LABELS[index] ?? `第 ${index + 1} 部分`
}

type SectionKey = 'completed' | 'nextPlans'
type ReportListItem = WeeklyReport['completed'][number]

interface PageDraft {
  title: string
  partLabel: string
  weekLabel?: string
  dateRange?: string
  shortDateRange?: string
  completed: WeeklyReport['completed']
  nextPlans: WeeklyReport['nextPlans']
}

function parseHeading(rawTitle: string, index: number) {
  const [partLabel, ...titleParts] = rawTitle.split(/[｜|]/)
  const title = titleParts.join('｜').trim()

  if (title && partLabel?.trim()) {
    return {
      partLabel: partLabel.trim(),
      title,
    }
  }

  return {
    partLabel: partLabelForIndex(index),
    title: rawTitle.trim(),
  }
}

function parseDateLine(line: string) {
  const match = line.match(
    /^\s*(?:(\d{4})\s*年)?\s*(第\s*\d+\s*周)\s*[·.・]\s*(.+?)\s*$/,
  )
  if (!match) return null

  const year = match[1]
  const weekLabel = match[2]!.replace(/\s+/g, ' ')
  const shortDateRange = match[3]!.trim()
  const dateRange = year
    ? shortDateRange.replace(
        /(\d{2})\.(\d{2})\s*-\s*(\d{2})\.(\d{2})/,
        `${year}.$1.$2 - ${year}.$3.$4`,
      )
    : shortDateRange

  return {
    weekLabel,
    dateRange,
    shortDateRange,
  }
}

export function parseWeeklyMd(
  markdown: string,
  meta: ReportMetaDefaults,
): ParseWeeklyMdResult {
  const trimmed = markdown.trim()
  if (!trimmed) {
    return { ok: false, message: '内容为空，请粘贴 Markdown 后再提交。' }
  }

  const pages: PageDraft[] = []
  let currentPage: PageDraft | null = null
  let currentSection: SectionKey | null = null
  let currentItem: ReportListItem | null = null

  for (const rawLine of trimmed.split(/\r?\n/)) {
    const line = rawLine.trimEnd()

    const h1Match = line.match(/^#\s+(.+)$/)
    if (h1Match && !line.startsWith('##')) {
      const heading = parseHeading(h1Match[1]!.trim(), pages.length)
      currentPage = {
        title: heading.title,
        partLabel: heading.partLabel,
        completed: [],
        nextPlans: [],
      }
      pages.push(currentPage)
      currentSection = null
      currentItem = null
      continue
    }

    if (/^##\s*本周完成\s*$/.test(line)) {
      currentSection = 'completed'
      currentItem = null
      continue
    }

    if (/^##\s*(未来展望|下周计划)\s*$/.test(line)) {
      currentSection = 'nextPlans'
      currentItem = null
      continue
    }

    const dateMeta = parseDateLine(line)
    if (dateMeta && currentPage) {
      currentPage.weekLabel = dateMeta.weekLabel
      currentPage.dateRange = dateMeta.dateRange
      currentPage.shortDateRange = dateMeta.shortDateRange
      continue
    }

    const images = [...line.matchAll(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)]
      .map((match) => match[1]?.trim())
      .filter((src): src is string => Boolean(src))
    if (images.length > 0 && currentItem) {
      currentItem.images = [...(currentItem.images ?? []), ...images]
      continue
    }

    const bulletMatch = line.match(/^\s*(?:[-*]|\d+[.)])\s+(.+)$/)
    if (bulletMatch && currentPage && currentSection) {
      const item = {
        title: bulletMatch[1]!.trim(),
        description: '',
      }
      currentPage[currentSection].push(item)
      currentItem = item
    }
  }

  if (pages.length === 0) {
    return {
      ok: false,
      message: '未找到任何页面，请使用「# 标题」作为每一页的开头。',
    }
  }

  const data: WeeklyReport[] = pages.map((page, index) => ({
    id: index + 1,
    weekLabel: page.weekLabel ?? meta.weekLabel,
    dateRange: page.dateRange ?? meta.dateRange,
    shortDateRange: page.shortDateRange ?? meta.shortDateRange,
    partLabel: page.partLabel,
    title: page.title,
    completed: page.completed,
    nextPlans: page.nextPlans,
  }))

  return { ok: true, data }
}

export function metaFromReports(
  reports: WeeklyReport[],
  fallback: ReportMetaDefaults,
): ReportMetaDefaults {
  const first = reports[0]
  if (!first) return fallback
  return {
    weekLabel: first.weekLabel,
    dateRange: first.dateRange,
    shortDateRange: first.shortDateRange,
  }
}
