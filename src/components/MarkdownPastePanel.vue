<script setup lang="ts">
defineProps<{
  error?: string
}>()

const model = defineModel<string>({ required: true })
const year = defineModel<string>('year', { required: true })
const weekNumber = defineModel<string>('weekNumber', { required: true })
const startDate = defineModel<string>('startDate', { required: true })
const endDate = defineModel<string>('endDate', { required: true })

const emit = defineEmits<{
  cancel: []
  submit: []
}>()

const placeholder = `# 第一部分｜小程序开发

2026 年第 23 周 · 06.01 - 06.05

## 本周完成
1. 优化了识字量小程序的主包大小
2. 首页分享功能已上线

## 未来展望
1. 给小程序做分包
![分包示意](https://example.com/demo.png)`
</script>

<template>
  <div class="markdown-paste">
    <h2 class="markdown-paste-title">粘贴 Markdown</h2>
    <p class="markdown-paste-hint">
      支持标题、日期、列表；列表项后可紧跟一张或多张 Markdown 图片。
    </p>
    <div class="markdown-meta-fields">
      <label class="markdown-field">
        <span class="markdown-field-label">年份</span>
        <input
          v-model="year"
          type="number"
          min="2000"
          max="2100"
          inputmode="numeric"
          aria-label="年份"
        />
      </label>
      <label class="markdown-field">
        <span class="markdown-field-label">周数</span>
        <span class="markdown-week-input">
          第
          <input
            v-model="weekNumber"
            type="number"
            min="1"
            max="53"
            inputmode="numeric"
            aria-label="周数"
          />
          周
        </span>
      </label>
      <label class="markdown-field">
        <span class="markdown-field-label">开始日期</span>
        <input
          v-model="startDate"
          type="date"
          aria-label="开始日期"
          readonly
        />
      </label>
      <label class="markdown-field">
        <span class="markdown-field-label">结束日期</span>
        <input
          v-model="endDate"
          type="date"
          aria-label="结束日期"
          readonly
        />
      </label>
    </div>
    <textarea
      v-model="model"
      class="markdown-textarea"
      :placeholder="placeholder"
      spellcheck="false"
    />
    <div class="markdown-paste-actions">
      <p v-if="error" class="markdown-parse-error" role="alert">{{ error }}</p>
      <div class="markdown-action-buttons">
        <button
          type="button"
          class="markdown-cancel-btn"
          @click="emit('cancel')"
        >
          取消
        </button>
        <button
          type="button"
          class="markdown-submit-btn"
          @click="emit('submit')"
        >
          确认导入
        </button>
      </div>
    </div>
  </div>
</template>
