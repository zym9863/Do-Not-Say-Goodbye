<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="text-center">
      <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ExclamationTriangleIcon class="w-12 h-12 text-red-500" />
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        {{ error.statusCode === 404 ? '页面未找到' : '出现错误' }}
      </h1>
      
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        {{ error.statusCode === 404 
          ? '抱歉，您访问的页面不存在。可能是链接错误或页面已被移除。' 
          : '抱歉，系统出现了一些问题。请稍后再试。' 
        }}
      </p>
      
      <div class="space-x-4">
        <button @click="handleError" class="btn-primary">
          {{ error.statusCode === 404 ? '返回首页' : '重试' }}
        </button>
        <NuxtLink to="/" class="btn-secondary">
          回到首页
        </NuxtLink>
      </div>
      
      <div v-if="error.statusCode !== 404" class="mt-8 text-sm text-gray-500">
        错误代码: {{ error.statusCode }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  error: Object
})

const handleError = () => {
  if (props.error.statusCode === 404) {
    navigateTo('/')
  } else {
    clearError({ redirect: '/' })
  }
}
</script>
