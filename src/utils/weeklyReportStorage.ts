import type { WeeklyReport, WeeklyReportWeek } from '../data/weeklyReports'

export const REPORTS_STORAGE_KEY = 'weekly-showcase-reports'
export const REPORT_WEEKS_STORAGE_KEY = 'weekly-showcase-report-weeks'

function isWeeklyReport(value: unknown): value is WeeklyReport {
  if (!value || typeof value !== 'object') return false
  const r = value as WeeklyReport
  return (
    typeof r.id === 'number' &&
    typeof r.weekLabel === 'string' &&
    typeof r.dateRange === 'string' &&
    typeof r.shortDateRange === 'string' &&
    typeof r.partLabel === 'string' &&
    typeof r.title === 'string' &&
    Array.isArray(r.completed) &&
    Array.isArray(r.nextPlans)
  )
}

function isWeeklyReportWeek(value: unknown): value is WeeklyReportWeek {
  if (!value || typeof value !== 'object') return false
  const r = value as WeeklyReportWeek
  return (
    typeof r.id === 'string' &&
    typeof r.weekLabel === 'string' &&
    typeof r.dateRange === 'string' &&
    typeof r.shortDateRange === 'string' &&
    Array.isArray(r.reports) &&
    r.reports.length > 0 &&
    r.reports.every(isWeeklyReport)
  )
}

function normalizeReport(raw: WeeklyReport): WeeklyReport {
  return {
    id: raw.id,
    weekLabel: raw.weekLabel,
    dateRange: raw.dateRange,
    shortDateRange: raw.shortDateRange,
    partLabel: raw.partLabel,
    title: raw.title,
    completed: raw.completed.map((item) => ({
      title: item.title,
      description: item.description ?? '',
      images: item.images?.filter(Boolean),
    })),
    nextPlans: raw.nextPlans.map((item) => ({
      title: item.title,
      description: item.description ?? '',
      images: item.images?.filter(Boolean),
    })),
  }
}

function normalizeWeek(raw: WeeklyReportWeek): WeeklyReportWeek {
  return {
    id: raw.id,
    weekLabel: raw.weekLabel,
    dateRange: raw.dateRange,
    shortDateRange: raw.shortDateRange,
    reports: raw.reports.map(normalizeReport),
  }
}

function mergeWeeks(
  sourceWeeks: WeeklyReportWeek[],
  localWeeks: WeeklyReportWeek[],
  preferLocal: boolean,
): WeeklyReportWeek[] {
  const merged = new Map<string, WeeklyReportWeek>()
  sourceWeeks.forEach((week) => {
    merged.set(week.id, normalizeWeek(week))
  })
  localWeeks.forEach((week) => {
    if (preferLocal || !merged.has(week.id)) {
      merged.set(week.id, normalizeWeek(week))
    }
  })

  return [...merged.values()].sort((a, b) => {
    const dateCompare = b.dateRange.localeCompare(a.dateRange)
    if (dateCompare !== 0) return dateCompare
    return b.id.localeCompare(a.id)
  })
}

export function loadReports(fallback: WeeklyReport[]): WeeklyReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY)
    if (!raw) return fallback

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback

    if (!parsed.every(isWeeklyReport)) return fallback

    return parsed.map(normalizeReport)
  } catch {
    return fallback
  }
}

export function saveReports(reports: WeeklyReport[]): void {
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports))
}

export function loadReportWeeks(
  fallback: WeeklyReportWeek[],
): WeeklyReportWeek[] {
  try {
    const rawWeeks = localStorage.getItem(REPORT_WEEKS_STORAGE_KEY)
    if (rawWeeks) {
      const parsed: unknown = JSON.parse(rawWeeks)
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every(isWeeklyReportWeek)
      ) {
        return mergeWeeks(fallback, parsed, !import.meta.env.DEV)
      }
    }

    return fallback
  } catch {
    return fallback
  }
}

export function saveReportWeeks(weeks: WeeklyReportWeek[]): void {
  localStorage.setItem(REPORT_WEEKS_STORAGE_KEY, JSON.stringify(weeks))
}
