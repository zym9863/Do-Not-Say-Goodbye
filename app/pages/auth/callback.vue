<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">正在处理认证...</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
  auth: false
})

// 处理认证回调
onMounted(async () => {
  // 等待一下让Supabase处理回调
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 重定向到首页
  await navigateTo('/')
})
</script>
