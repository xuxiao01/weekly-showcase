<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string
    color?: string
    title?: string
  }>(),
  {
    size: 24,
    color: 'currentColor',
    title: '右箭头',
  },
)
</script>

<template>
  <svg
    class="arrow-right-icon"
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    role="img"
    aria-hidden="false"
  >
    <title>{{ title }}</title>
    <path
      d="M474.496 512l338.752-338.752-90.496-90.496L293.504 512l429.248 429.248 90.496-90.496z"
      :fill="color"
      transform="translate(1024 0) scale(-1 1)"
    />
  </svg>
</template>

<style scoped>
.arrow-right-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
