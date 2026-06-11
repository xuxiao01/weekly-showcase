<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  defaultWeeklyReportWeeks,
  type WeeklyReportWeek,
} from './data/weeklyReports'
import WeeklyContent from './components/WeeklyContent.vue'
import PageNavigation from './components/PageNavigation.vue'
import AppToolbar from './components/AppToolbar.vue'
import MarkdownPastePanel from './components/MarkdownPastePanel.vue'
import { usePageTransition } from './composables/usePageTransition'
import { parseWeeklyMd } from './utils/parseWeeklyMd'
import { loadReportWeeks, saveReportWeeks } from './utils/weeklyReportStorage'

const MARKDOWN_DRAFT_KEY = 'weekly-showcase-markdown-draft'

const markdownDraft = ref('')
const parseError = ref('')
const reportWeeks = ref<WeeklyReportWeek[]>(
  loadReportWeeks(defaultWeeklyReportWeeks),
)
const currentWeekId = ref(reportWeeks.value[0]?.id ?? defaultWeeklyReportWeeks[0]!.id)
const currentPageIndex = ref(0)
const importYear = ref('')
const importWeekNumber = ref('')
const importStartDate = ref('')
const importEndDate = ref('')
const contentRef = ref<HTMLElement | null>(null)
const isWeekPickerOpen = ref(false)
const isMarkdownPanelOpen = ref(false)
const isMobile = ref(false)
let mediaQuery: MediaQueryList | null = null
let syncMobile: (() => void) | null = null

const currentWeek = computed(() => {
  return (
    reportWeeks.value.find((week) => week.id === currentWeekId.value) ??
    reportWeeks.value[0] ??
    defaultWeeklyReportWeeks[0]!
  )
})

const reports = computed(() => currentWeek.value.reports)
const totalPages = computed(() => reports.value.length)

const currentIndex = computed({
  get: () => Math.min(currentPageIndex.value, Math.max(0, totalPages.value - 1)),
  set: (index) => {
    currentPageIndex.value = index
  },
})

const currentReport = computed(() => reports.value[currentIndex.value]!)
const reportMeta = computed(
  () => `${yearFromDateRange(currentWeek.value.dateRange)} 年${currentWeek.value.weekLabel} · ${currentWeek.value.shortDateRange}`,
)
const sortedWeeks = computed(() =>
  [...reportWeeks.value].sort((a, b) => {
    const dateCompare = b.dateRange.localeCompare(a.dateRange)
    if (dateCompare !== 0) return dateCompare
    return b.id.localeCompare(a.id)
  }),
)

const { isAnimating, goNext, goPrev } = usePageTransition(
  contentRef,
  currentIndex,
  totalPages,
)

const canGoPrev = computed(() => currentIndex.value > 0 && !isAnimating.value)
const canGoNext = computed(
  () => currentIndex.value < totalPages.value - 1 && !isAnimating.value,
)

onMounted(() => {
  const saved = sessionStorage.getItem(MARKDOWN_DRAFT_KEY)
  if (saved !== null) {
    markdownDraft.value = saved
  }

  syncImportMeta()

  mediaQuery = window.matchMedia('(max-width: 639px)')
  syncMobile = () => {
    isMobile.value = mediaQuery?.matches ?? false
  }
  syncMobile()
  mediaQuery.addEventListener('change', syncMobile)
})

onBeforeUnmount(() => {
  if (mediaQuery && syncMobile) {
    mediaQuery.removeEventListener('change', syncMobile)
  }
})

watch(markdownDraft, (value) => {
  sessionStorage.setItem(MARKDOWN_DRAFT_KEY, value)
})

watch(totalPages, (len) => {
  if (currentIndex.value >= len) {
    currentIndex.value = Math.max(0, len - 1)
  }
})

watch([importYear, importWeekNumber], syncWeekdayRangeFromImportFields)

function openMarkdownPanel() {
  parseError.value = ''
  syncImportMeta()
  isMarkdownPanelOpen.value = true
}

function closeMarkdownPanel() {
  parseError.value = ''
  isMarkdownPanelOpen.value = false
}

function selectWeek(weekId: WeeklyReportWeek['id']) {
  currentWeekId.value = weekId
  currentPageIndex.value = 0
  isWeekPickerOpen.value = false
}

function pad2(value: string | number) {
  return String(value).padStart(2, '0')
}

function shortDateFromInput(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return match ? `${match[2]}.${match[3]}` : ''
}

function fullDateFromInput(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return match ? `${match[1]}.${match[2]}.${match[3]}` : ''
}

function yearFromDateRange(dateRange: string) {
  return dateRange.match(/\d{4}/)?.[0] ?? '2026'
}

function formatDateInput(date: Date) {
  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())
  return `${year}-${month}-${day}`
}

function weekdayRangeForIsoWeek(year: number, weekNumber: number) {
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() || 7
  const weekOneMonday = new Date(year, 0, 4 - jan4Day + 1)
  const start = new Date(weekOneMonday)
  start.setDate(weekOneMonday.getDate() + (weekNumber - 1) * 7)

  const end = new Date(start)
  end.setDate(start.getDate() + 4)

  return {
    start: formatDateInput(start),
    end: formatDateInput(end),
  }
}

function weekNumberFromLabel(weekLabel: string) {
  return weekLabel.match(/\d+/)?.[0] ?? ''
}

function syncImportMeta() {
  importYear.value = yearFromDateRange(currentWeek.value.dateRange)
  importWeekNumber.value = weekNumberFromLabel(currentWeek.value.weekLabel)
  syncWeekdayRangeFromImportFields()
}

function syncWeekdayRangeFromImportFields() {
  const year = Number(importYear.value)
  const weekNumber = Number(importWeekNumber.value)
  if (
    !Number.isInteger(year) ||
    year < 2000 ||
    year > 2100 ||
    !Number.isInteger(weekNumber) ||
    weekNumber < 1 ||
    weekNumber > 53
  ) {
    return
  }

  const range = weekdayRangeForIsoWeek(year, weekNumber)
  importStartDate.value = range.start
  importEndDate.value = range.end
}

function buildImportMeta() {
  const year = Number(importYear.value)
  const weekNumber = Number(importWeekNumber.value)
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return { ok: false as const, message: '请输入 2000-2100 之间的年份。' }
  }

  if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 53) {
    return { ok: false as const, message: '请选择 1-53 之间的周数。' }
  }

  if (!importStartDate.value || !importEndDate.value) {
    return { ok: false as const, message: '请选择开始日期和结束日期。' }
  }

  if (importStartDate.value > importEndDate.value) {
    return { ok: false as const, message: '开始日期不能晚于结束日期。' }
  }

  const startShort = shortDateFromInput(importStartDate.value)
  const endShort = shortDateFromInput(importEndDate.value)
  const startFull = fullDateFromInput(importStartDate.value)
  const endFull = fullDateFromInput(importEndDate.value)

  return {
    ok: true as const,
    data: {
      year,
      weekLabel: `第 ${weekNumber} 周`,
      dateRange: `${startFull} - ${endFull}`,
      shortDateRange: `${startShort} - ${endShort}`,
    },
  }
}

async function persistReportWeeks(nextWeeks: WeeklyReportWeek[]) {
  saveReportWeeks(nextWeeks)

  if (!import.meta.env.DEV) {
    return
  }

  const response = await fetch('/__weekly-dev/report-weeks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ weeks: nextWeeks }),
  })

  if (!response.ok) {
    throw new Error('dev write failed')
  }
}

async function handleSubmit() {
  const metaResult = buildImportMeta()
  if (!metaResult.ok) {
    parseError.value = metaResult.message
    return
  }

  const meta = metaResult.data
  const result = parseWeeklyMd(markdownDraft.value, meta)

  if (!result.ok) {
    parseError.value = result.message
    return
  }

  parseError.value = ''
  const normalizedReports = result.data.map((report, index) => ({
    ...report,
    id: index + 1,
    weekLabel: meta.weekLabel,
    dateRange: meta.dateRange,
    shortDateRange: meta.shortDateRange,
  }))
  const weekId = `${yearFromDateRange(meta.dateRange)}-W${pad2(importWeekNumber.value)}`
  const nextWeek: WeeklyReportWeek = {
    id: weekId,
    weekLabel: meta.weekLabel,
    dateRange: meta.dateRange,
    shortDateRange: meta.shortDateRange,
    reports: normalizedReports,
  }
  const existingIndex = reportWeeks.value.findIndex((week) => week.id === weekId)
  const nextWeeks =
    existingIndex >= 0
      ? reportWeeks.value.map((week) => (week.id === weekId ? nextWeek : week))
      : [nextWeek, ...reportWeeks.value]

  reportWeeks.value = nextWeeks
  try {
    await persistReportWeeks(nextWeeks)
  } catch {
    saveReportWeeks(nextWeeks)
    parseError.value = '已保存到浏览器本地，但写入源码文件失败，请检查开发服务。'
    return
  }
  currentWeekId.value = weekId
  currentPageIndex.value = 0
  isMarkdownPanelOpen.value = false
}
</script>

<template>
  <div class="app">
    <AppToolbar
      :week-label="currentWeek.weekLabel"
      @choose-week="isWeekPickerOpen = !isWeekPickerOpen"
      @paste-markdown="openMarkdownPanel"
    />

    <div
      v-if="isWeekPickerOpen && !isMobile"
      class="week-popover"
      role="dialog"
      aria-label="周次选择"
    >
      <button
        v-for="week in sortedWeeks"
        :key="week.id"
        type="button"
        class="week-option"
        :class="{ 'week-option--active': week.id === currentWeek.id }"
        @click="selectWeek(week.id)"
      >
        <span class="week-option-label">{{ week.weekLabel }}</span>
        <span class="week-option-date">{{ week.shortDateRange }}</span>
      </button>
    </div>

    <header class="site-header">
      <h1 class="site-title">
        <span>{{ currentReport.partLabel }}｜</span>
        <span class="site-title-accent">{{ currentReport.title }}</span>
      </h1>
      <p class="site-meta">{{ reportMeta }}</p>
      <div class="mobile-actions">
        <button
          type="button"
          class="mobile-action-button"
          @click="isWeekPickerOpen = true"
        >
          {{ currentWeek.weekLabel }} ▾
        </button>
        <button
          type="button"
          class="mobile-action-button"
          @click="openMarkdownPanel"
        >
          粘贴 Markdown
        </button>
      </div>
    </header>

    <div class="content-area">
      <div ref="contentRef" class="content-shell">
        <WeeklyContent :report="currentReport" />
      </div>
    </div>

    <PageNavigation
      :can-prev="canGoPrev"
      :can-next="canGoNext"
      @prev="goPrev"
      @next="goNext"
    />

    <div
      v-if="isWeekPickerOpen && isMobile"
      class="sheet-mask"
      @click="isWeekPickerOpen = false"
    />
    <div
      v-if="isWeekPickerOpen && isMobile"
      class="bottom-sheet week-sheet"
      role="dialog"
      aria-label="周次选择"
    >
      <div class="sheet-title">选择周次</div>
      <button
        v-for="week in sortedWeeks"
        :key="week.id"
        type="button"
        class="week-option"
        :class="{ 'week-option--active': week.id === currentWeek.id }"
        @click="selectWeek(week.id)"
      >
        <span class="week-option-label">{{ week.weekLabel }}</span>
        <span class="week-option-date">{{ week.shortDateRange }}</span>
      </button>
    </div>

    <div
      v-if="isMarkdownPanelOpen"
      class="modal-mask"
      @click="closeMarkdownPanel"
    />
    <div
      v-if="isMarkdownPanelOpen"
      :class="isMobile ? 'bottom-sheet markdown-sheet' : 'markdown-modal'"
      role="dialog"
      aria-label="粘贴 Markdown"
    >
      <MarkdownPastePanel
        v-model="markdownDraft"
        v-model:year="importYear"
        v-model:week-number="importWeekNumber"
        v-model:start-date="importStartDate"
        v-model:end-date="importEndDate"
        :error="parseError"
        @cancel="closeMarkdownPanel"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
