<script setup lang="ts">
import { ref, computed } from 'vue'
import { weeklyReports } from './data/weeklyReports'
import WeeklyContent from './components/WeeklyContent.vue'
import PageNavigation from './components/PageNavigation.vue'
import { usePageTransition } from './composables/usePageTransition'

const currentIndex = ref(0)
const contentRef = ref<HTMLElement | null>(null)

const currentReport = computed(() => weeklyReports[currentIndex.value]!)
const reportMeta = computed(
  () => `2026 年${currentReport.value.weekLabel} · ${currentReport.value.shortDateRange}`,
)

const { isAnimating, goNext, goPrev } = usePageTransition(
  contentRef,
  currentIndex,
  weeklyReports.length,
)

const canGoPrev = computed(() => currentIndex.value > 0 && !isAnimating.value)
const canGoNext = computed(
  () => currentIndex.value < weeklyReports.length - 1 && !isAnimating.value,
)
</script>

<template>
  <div class="app">
    <header class="site-header">
      <h1 class="site-title">
        <span>{{ currentReport.partLabel }}｜</span>
        <span class="site-title-accent">{{ currentReport.title }}</span>
      </h1>
      <p class="site-meta">{{ reportMeta }}</p>
    </header>
    <div ref="contentRef" class="content-area">
      <WeeklyContent :report="currentReport" />
    </div>
    <PageNavigation
      :can-prev="canGoPrev"
      :can-next="canGoNext"
      @prev="goPrev"
      @next="goNext"
    />
  </div>
</template>
