<script setup lang="ts">
import ArrowRightIcon from './icons/ArrowRightIcon.vue'

defineProps<{
  canPrev: boolean
  canNext: boolean
}>()

const emit = defineEmits<{
  prev: []
  next: []
}>()
</script>

<template>
  <nav class="page-nav">
    <div class="page-nav-inner">
      <button
        type="button"
        class="nav-btn nav-btn--prev"
        :disabled="!canPrev"
        @click="emit('prev')"
      >
        <ArrowRightIcon
          class="nav-btn-icon nav-btn-icon--prev"
          :size="15"
          color="currentColor"
          title="上一页"
        />
        <span>上一页</span>
      </button>
      <button
        type="button"
        class="nav-btn nav-btn--next"
        :disabled="!canNext"
        @click="emit('next')"
      >
        <span>下一页</span>
        <ArrowRightIcon
          class="nav-btn-icon"
          :size="15"
          color="currentColor"
          title="下一页"
        />
      </button>
    </div>
  </nav>
</template>
