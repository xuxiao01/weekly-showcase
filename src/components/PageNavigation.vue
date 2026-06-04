<script setup lang="ts">
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
    <button
      type="button"
      class="nav-btn"
      :disabled="!canPrev"
      @click="emit('prev')"
    >
      上一页
    </button>
    <button
      type="button"
      class="nav-btn"
      :disabled="!canNext"
      @click="emit('next')"
    >
      下一页
    </button>
  </nav>
</template>
