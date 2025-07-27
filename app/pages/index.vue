<template>
  <div class="min-h-screen">
    <!-- 导航栏 -->
    <AppNavbar />

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 欢迎区域 -->
      <div class="text-center mb-16 fade-in">
        <h2 class="text-4xl md:text-5xl font-bold text-gradient mb-6 float">
          爱情的起点，都是最美的瞬间
        </h2>
        <p class="text-xl text-gray-600 mb-8 slide-up">
          在这里封存你的美好回忆，寻找新的地平线
        </p>
        <div v-if="!user" class="space-x-4 scale-in">
          <NuxtLink to="/auth/register" class="btn-primary shadow-glow">开始使用</NuxtLink>
          <NuxtLink to="/auth/login" class="btn-secondary">已有账号</NuxtLink>
        </div>
      </div>

      <!-- 功能介绍 -->
      <div class="grid md:grid-cols-2 gap-8 mb-16">
        <div class="card slide-up hover:shadow-glow transition-all duration-300" style="animation-delay: 0.2s">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">瞬间胶囊</h3>
            <p class="text-gray-600">
              封存你的美好瞬间，上传照片、记录文字、关联音乐，创建专属的回忆时间线
            </p>
          </div>
        </div>

        <div class="card slide-up hover:shadow-glow transition-all duration-300" style="animation-delay: 0.4s">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">地平线回响</h3>
            <p class="text-gray-600">
              通过启发性问题引导自我对话，记录成长轨迹，寻找属于你的新地平线
            </p>
          </div>
        </div>
      </div>

      <!-- 用户仪表板 -->
      <div v-if="user" class="grid md:grid-cols-3 gap-6">
        <NuxtLink to="/capsules" class="card hover:shadow-xl transition-shadow duration-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">我的胶囊</h3>
          <p class="text-gray-600 mb-4">查看和管理你的瞬间胶囊</p>
          <div class="text-blue-600 font-medium">进入 →</div>
        </NuxtLink>

        <NuxtLink to="/echoes" class="card hover:shadow-xl transition-shadow duration-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">我的回响</h3>
          <p class="text-gray-600 mb-4">记录你的心路历程</p>
          <div class="text-purple-600 font-medium">进入 →</div>
        </NuxtLink>

        <NuxtLink to="/timeline" class="card hover:shadow-xl transition-shadow duration-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">时间线</h3>
          <p class="text-gray-600 mb-4">回顾你的成长轨迹</p>
          <div class="text-green-600 font-medium">进入 →</div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
</script>
