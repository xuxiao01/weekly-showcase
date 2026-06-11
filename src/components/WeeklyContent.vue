<script setup lang="ts">
import { computed, ref } from 'vue'
import type { WeeklyReport } from '../data/weeklyReports'
import ArrowRightIcon from './icons/ArrowRightIcon.vue'

defineProps<{
  report: WeeklyReport
}>()

const viewerImages = ref<string[]>([])
const viewerIndex = ref(0)
const currentViewerImage = computed(() => viewerImages.value[viewerIndex.value])

function openImageViewer(images: string[]) {
  viewerImages.value = images
  viewerIndex.value = 0
}

function closeImageViewer() {
  viewerImages.value = []
  viewerIndex.value = 0
}

function showPrevImage() {
  if (viewerImages.value.length <= 1) return
  viewerIndex.value =
    (viewerIndex.value - 1 + viewerImages.value.length) %
    viewerImages.value.length
}

function showNextImage() {
  if (viewerImages.value.length <= 1) return
  viewerIndex.value = (viewerIndex.value + 1) % viewerImages.value.length
}
</script>

<template>
  <div class="weekly-content">
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
              <p v-if="item.description" class="item-description">
                {{ item.description }}
              </p>
            </div>
            <button
              v-if="item.images?.length"
              type="button"
              class="item-image-trigger"
              aria-label="查看图片"
              @click="openImageViewer(item.images)"
            >
              <ArrowRightIcon :size="15" color="currentColor" title="查看图片" />
            </button>
          </li>
        </ul>
      </section>

      <section class="weekly-section weekly-section--plan">
        <h3 class="section-title">未来展望</h3>
        <ul class="weekly-items">
          <li
            v-for="(item, index) in report.nextPlans"
            :key="`next-plan-${index}`"
            class="weekly-item"
          >
            <span class="item-index">{{ index + 1 }}</span>
            <div class="item-copy">
              <h4 class="item-title">{{ item.title }}</h4>
              <p v-if="item.description" class="item-description">
                {{ item.description }}
              </p>
            </div>
            <button
              v-if="item.images?.length"
              type="button"
              class="item-image-trigger"
              aria-label="查看图片"
              @click="openImageViewer(item.images)"
            >
              <ArrowRightIcon :size="15" color="currentColor" title="查看图片" />
            </button>
          </li>
        </ul>
      </section>
    </div>

    <Teleport to="body">
      <div
        v-if="currentViewerImage"
        class="image-viewer-mask"
        @click="closeImageViewer"
      />
      <div
        v-if="currentViewerImage"
        class="image-viewer"
        role="dialog"
        aria-label="图片预览"
      >
        <button
          type="button"
          class="image-viewer-close"
          aria-label="关闭图片预览"
          @click="closeImageViewer"
        >
          ×
        </button>
        <button
          v-if="viewerImages.length > 1"
          type="button"
          class="image-viewer-arrow image-viewer-arrow--prev"
          aria-label="上一张图片"
          @click="showPrevImage"
        >
          <ArrowRightIcon :size="18" color="currentColor" title="上一张图片" />
        </button>
        <img class="image-viewer-img" :src="currentViewerImage" alt="" />
        <button
          v-if="viewerImages.length > 1"
          type="button"
          class="image-viewer-arrow image-viewer-arrow--next"
          aria-label="下一张图片"
          @click="showNextImage"
        >
          <ArrowRightIcon :size="18" color="currentColor" title="下一张图片" />
        </button>
        <div v-if="viewerImages.length > 1" class="image-viewer-count">
          {{ viewerIndex + 1 }} / {{ viewerImages.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>
