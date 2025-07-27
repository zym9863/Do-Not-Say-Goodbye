<template>
  <nav class="navbar-glass sticky top-0 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <NuxtLink 
            to="/" 
            class="text-xl font-bold text-aurora transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <div class="w-8 h-8 bg-gradient-aurora rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">不</span>
            </div>
            <span>不说再见</span>
          </NuxtLink>
        </div>
        
        <div class="flex items-center space-x-6">
          <template v-if="user">
            <NuxtLink 
              to="/capsules" 
              class="nav-link text-capsule transition-all duration-300"
              :class="{ 'nav-link-active': $route.path.startsWith('/capsules') }"
            >
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-gradient-capsule rounded-full"></div>
                <span>瞬间胶囊</span>
              </div>
            </NuxtLink>
            <NuxtLink 
              to="/echoes" 
              class="nav-link text-echo transition-all duration-300"
              :class="{ 'nav-link-active': $route.path.startsWith('/echoes') }"
            >
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-gradient-echo rounded-full"></div>
                <span>地平线回响</span>
              </div>
            </NuxtLink>
            <NuxtLink 
              to="/timeline" 
              class="nav-link text-timeline transition-all duration-300"
              :class="{ 'nav-link-active': $route.path.startsWith('/timeline') }"
            >
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-gradient-timeline rounded-full"></div>
                <span>时间线</span>
              </div>
            </NuxtLink>
            
            <!-- 用户菜单 -->
            <div class="relative" ref="userMenuRef">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-all duration-300 p-2 rounded-xl hover:bg-white/20"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <span class="text-sm font-bold text-white">
                    {{ user.email?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <ChevronDownIcon 
                  class="w-4 h-4 transition-transform duration-300" 
                  :class="{ 'rotate-180': showUserMenu }"
                />
              </button>
              
              <div 
                v-show="showUserMenu"
                class="absolute right-0 mt-3 w-56 glass-strong rounded-2xl shadow-2xl border border-white/40 py-2 scale-in"
              >
                <div class="px-4 py-3 text-sm text-gray-600 border-b border-white/20">
                  <div class="font-medium text-gray-900">{{ user.email }}</div>
                  <div class="text-xs text-gray-500 mt-1">已登录</div>
                </div>
                <button 
                  @click="signOut"
                  class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span>登出</span>
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <NuxtLink to="/auth/login" class="btn-secondary">登录</NuxtLink>
            <NuxtLink to="/auth/register" class="btn-primary shadow-glow">注册</NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { onClickOutside } from '@vueuse/core'

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const showUserMenu = ref(false)
const userMenuRef = ref(null)

// 点击外部关闭菜单
onClickOutside(userMenuRef, () => {
  showUserMenu.value = false
})

const signOut = async () => {
  showUserMenu.value = false
  await supabase.auth.signOut()
  await navigateTo('/')
}
</script>
