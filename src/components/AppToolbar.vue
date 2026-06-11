<script setup lang="ts">
defineProps<{
  weekLabel: string
}>()

const emit = defineEmits<{
  chooseWeek: []
  pasteMarkdown: []
}>()
</script>

<template>
  <div class="app-toolbar">
    <button type="button" class="toolbar-btn" @click="emit('chooseWeek')">
      {{ weekLabel }} ▾
    </button>
    <button type="button" class="toolbar-btn" @click="emit('pasteMarkdown')">
      粘贴 Markdown
    </button>
  </div>
</template>
