<script setup lang="ts">
import type { WeeklyReport } from '../data/weeklyReports'

defineProps<{
  report: WeeklyReport
}>()
</script>

<template>
  <div class="weekly-content">
    <section class="weekly-summary-block">
      <p class="weekly-summary">{{ report.summary }}</p>
    </section>

    <div class="weekly-sections">
      <section class="weekly-section weekly-section--done">
        <h3 class="section-title">本周完成</h3>
        <ul class="weekly-items">
          <li
            v-for="(item, index) in report.completed"
            :key="`completed-${index}`"
            class="weekly-item"
          >
            <span class="item-index">{{ index + 1 }}</span>
            <div class="item-copy">
              <h4 class="item-title">{{ item.title }}</h4>
              <p class="item-description">{{ item.description }}</p>
            </div>
          </li>
        </ul>
      </section>

      <section class="weekly-section weekly-section--plan">
        <h3 class="section-title">下周计划</h3>
        <ul class="weekly-items">
          <li
            v-for="(item, index) in report.nextPlans"
            :key="`next-plan-${index}`"
            class="weekly-item"
          >
            <span class="item-index">{{ index + 1 }}</span>
            <div class="item-copy">
              <h4 class="item-title">{{ item.title }}</h4>
              <p class="item-description">{{ item.description }}</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
