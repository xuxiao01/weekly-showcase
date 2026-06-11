import { defineConfig } from 'vite'
import type { Plugin, ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { mkdir, writeFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'

interface WeeklyReport {
  id: number
  weekLabel: string
  dateRange: string
  shortDateRange: string
  partLabel: string
  title: string
  completed: {
    title: string
    description: string
    images?: string[]
  }[]
  nextPlans: {
    title: string
    description: string
    images?: string[]
  }[]
}

interface WeeklyReportWeek {
  id: string
  weekLabel: string
  dateRange: string
  shortDateRange: string
  reports: WeeklyReport[]
}

function isWeeklyReport(value: unknown): value is WeeklyReport {
  if (!value || typeof value !== 'object') return false
  const report = value as WeeklyReport
  return (
    typeof report.id === 'number' &&
    typeof report.weekLabel === 'string' &&
    typeof report.dateRange === 'string' &&
    typeof report.shortDateRange === 'string' &&
    typeof report.partLabel === 'string' &&
    typeof report.title === 'string' &&
    Array.isArray(report.completed) &&
    Array.isArray(report.nextPlans)
  )
}

function isWeeklyReportWeek(value: unknown): value is WeeklyReportWeek {
  if (!value || typeof value !== 'object') return false
  const week = value as WeeklyReportWeek
  return (
    typeof week.id === 'string' &&
    typeof week.weekLabel === 'string' &&
    typeof week.dateRange === 'string' &&
    typeof week.shortDateRange === 'string' &&
    Array.isArray(week.reports) &&
    week.reports.length > 0 &&
    week.reports.every(isWeeklyReport)
  )
}

function normalizeReport(report: WeeklyReport): WeeklyReport {
  return {
    id: report.id,
    weekLabel: report.weekLabel,
    dateRange: report.dateRange,
    shortDateRange: report.shortDateRange,
    partLabel: report.partLabel,
    title: report.title,
    completed: report.completed.map((item) => ({
      title: item.title,
      description: item.description ?? '',
      images: item.images?.filter(Boolean),
    })),
    nextPlans: report.nextPlans.map((item) => ({
      title: item.title,
      description: item.description ?? '',
      images: item.images?.filter(Boolean),
    })),
  }
}

function normalizeWeeks(weeks: WeeklyReportWeek[]): WeeklyReportWeek[] {
  return [...weeks]
    .map((week) => ({
      id: week.id,
      weekLabel: week.weekLabel,
      dateRange: week.dateRange,
      shortDateRange: week.shortDateRange,
      reports: week.reports.map(normalizeReport),
    }))
    .sort((a, b) => b.dateRange.localeCompare(a.dateRange))
}

function serialize(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function reportVariableName(id: string) {
  return `reportWeek${id.replace(/[^a-zA-Z0-9]/g, '')}`
}

function assertSafeReportId(id: string) {
  if (!/^\d{4}-W\d{2}$/.test(id)) {
    throw new Error(`Invalid report id: ${id}`)
  }
}

function createReportWeekSource(week: WeeklyReportWeek) {
  const variableName = reportVariableName(week.id)

  return `import type { WeeklyReportWeek } from '../weeklyReports'

export const ${variableName}: WeeklyReportWeek = ${serialize(week)}
`
}

function createWeeklyReportsSource(weeks: WeeklyReportWeek[]) {
  const normalizedWeeks = normalizeWeeks(weeks)
  const firstWeek = normalizedWeeks[0]
  const firstWeekVariable = firstWeek ? reportVariableName(firstWeek.id) : null
  const imports = normalizedWeeks
    .map(
      (week) =>
        `import { ${reportVariableName(week.id)} } from './reports/${week.id}'`,
    )
    .join('\n')
  const weekList = normalizedWeeks
    .map((week) => `  ${reportVariableName(week.id)},`)
    .join('\n')

  return `${imports}

export interface WeeklyReport {
  id: number
  weekLabel: string
  dateRange: string
  shortDateRange: string
  partLabel: string
  title: string
  completed: {
    title: string
    description: string
    images?: string[]
  }[]
  nextPlans: {
    title: string
    description: string
    images?: string[]
  }[]
}

export interface WeeklyReportWeek {
  id: string
  weekLabel: string
  dateRange: string
  shortDateRange: string
  reports: WeeklyReport[]
}

export const defaultWeeklyReportWeeks: WeeklyReportWeek[] = [
${weekList}
]

export const defaultMeta = {
  weekLabel: ${JSON.stringify(firstWeek?.weekLabel ?? '第 23 周')},
  dateRange: ${JSON.stringify(firstWeek?.dateRange ?? '2026.06.01 - 2026.06.05')},
  shortDateRange: ${JSON.stringify(firstWeek?.shortDateRange ?? '06.01 - 06.05')},
} as const

export const defaultWeeklyReports: WeeklyReport[] = ${
    firstWeekVariable ? `${firstWeekVariable}.reports` : '[]'
  }

/** @deprecated 使用 defaultWeeklyReportWeeks */
export const weeklyReports = defaultWeeklyReports
`
}

function collectRequestBody(request: IncomingMessage) {
  return new Promise<string>((resolveBody, reject) => {
    let body = ''
    request.setEncoding('utf8')
    request.on('data', (chunk) => {
      body += chunk
    })
    request.on('end', () => resolveBody(body))
    request.on('error', reject)
  })
}

function weeklyReportsWriterPlugin(): Plugin {
  return {
    name: 'weekly-reports-writer',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/__weekly-dev/report-weeks', async (
        req: IncomingMessage,
        res: ServerResponse,
      ) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        try {
          const body = await collectRequestBody(req)
          const parsed = JSON.parse(body) as { weeks?: unknown }
          if (!Array.isArray(parsed.weeks) || !parsed.weeks.every(isWeeklyReportWeek)) {
            res.statusCode = 400
            res.end('Invalid report weeks')
            return
          }

          const normalizedWeeks = normalizeWeeks(parsed.weeks)
          const reportsDir = resolve(server.config.root, 'src/data/reports')
          await mkdir(reportsDir, { recursive: true })
          await Promise.all(
            normalizedWeeks.map((week) => {
              assertSafeReportId(week.id)
              return writeFile(
                resolve(reportsDir, `${week.id}.ts`),
                createReportWeekSource(week),
                'utf8',
              )
            }),
          )

          const target = resolve(server.config.root, 'src/data/weeklyReports.ts')
          await writeFile(target, createWeeklyReportsSource(normalizedWeeks), 'utf8')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true }))
        } catch {
          res.statusCode = 500
          res.end('Failed to write weekly reports')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [weeklyReportsWriterPlugin(), vue()],
  base: '/weekly/',
})
