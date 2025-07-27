<template>
  <div class="min-h-screen">
    <!-- 导航栏 -->
    <AppNavbar />

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 欢迎区域 -->
      <div class="text-center mb-20 pt-16 pb-8 fade-in">
        <div class="relative">
          <h1 class="text-5xl md:text-7xl font-black text-aurora mb-8 float leading-tight">
            爱情的起点
          </h1>
          <h2 class="text-3xl md:text-4xl font-bold text-gradient mb-8 float-delayed">
            都是最美的瞬间
          </h2>
          <div class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-warm rounded-full opacity-20 blur-xl float"></div>
          <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-echo rounded-full opacity-15 blur-2xl float-delayed"></div>
        </div>
        
        <p class="text-xl md:text-2xl text-gray-600 mb-12 slide-up max-w-3xl mx-auto leading-relaxed">
          在这里封存你的美好回忆，通过启发性对话寻找新的地平线，<br class="hidden md:block">
          让每一个瞬间都成为永恒的珍藏
        </p>
        
        <div v-if="!user" class="flex flex-col sm:flex-row gap-4 justify-center items-center scale-in">
          <NuxtLink to="/auth/register" class="btn-primary shadow-glow text-lg px-8 py-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            开始使用
          </NuxtLink>
          <NuxtLink to="/auth/login" class="btn-secondary text-lg px-8 py-4">已有账号</NuxtLink>
        </div>
      </div>

      <!-- 功能介绍 -->
      <div class="grid md:grid-cols-2 gap-8 mb-20">
        <div class="card aurora-card slide-up delay-200 hover:shadow-capsule">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-capsule rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-capsule">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-capsule mb-4">瞬间胶囊</h3>
            <p class="text-gray-600 text-lg leading-relaxed">
              封存你的美好瞬间，上传照片、记录文字、关联音乐，<br>
              创建专属的回忆时间线，让爱永远鲜活
            </p>
          </div>
        </div>

        <div class="card aurora-card slide-up delay-400 hover:shadow-echo">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-echo rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-echo">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-echo mb-4">地平线回响</h3>
            <p class="text-gray-600 text-lg leading-relaxed">
              通过启发性问题引导自我对话，记录成长轨迹，<br>
              在反思中寻找属于你的新地平线
            </p>
          </div>
        </div>
      </div>

      <!-- 用户仪表板 -->
      <div v-if="user" class="mb-16">
        <h2 class="text-3xl font-bold text-center text-gradient mb-12 fade-in">我的空间</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <NuxtLink to="/capsules" class="dashboard-card card hover:shadow-capsule group">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-capsule rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">我的胶囊</h3>
            <p class="text-gray-600 mb-4 text-sm">查看和管理你的瞬间胶囊</p>
            <div class="text-capsule font-semibold">进入胶囊世界</div>
          </NuxtLink>

          <NuxtLink to="/echoes" class="dashboard-card card hover:shadow-echo group">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-echo rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">我的回响</h3>
            <p class="text-gray-600 mb-4 text-sm">记录你的心路历程</p>
            <div class="text-echo font-semibold">聆听内心回响</div>
          </NuxtLink>

          <NuxtLink to="/timeline" class="dashboard-card card hover:shadow-timeline group">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-timeline rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">时间线</h3>
            <p class="text-gray-600 mb-4 text-sm">回顾你的成长轨迹</p>
            <div class="text-timeline font-semibold">追溯时光足迹</div>
          </NuxtLink>
        </div>
      </div>

      <!-- 特色说明 -->
      <div v-if="!user" class="text-center py-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl mb-16 fade-in">
        <h2 class="text-3xl font-bold text-gradient mb-8">为什么选择我们？</h2>
        <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto px-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">隐私保护</h3>
            <p class="text-gray-600 text-sm">你的回忆只属于你，安全可靠的数据保护</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">用心设计</h3>
            <p class="text-gray-600 text-sm">优雅的界面，温暖的交互，为爱而生</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-timeline rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">持续成长</h3>
            <p class="text-gray-600 text-sm">不断更新功能，陪伴你的每一个重要时刻</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="text-center py-12 text-gray-500 text-sm fade-in">
      <p>© 2025 不说再见 - 用心记录，用爱封存</p>
    </footer>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
</script>
