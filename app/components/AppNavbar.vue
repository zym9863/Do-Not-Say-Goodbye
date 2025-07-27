<template>
  <nav class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            不说再见
          </NuxtLink>
        </div>
        
        <div class="flex items-center space-x-4">
          <template v-if="user">
            <NuxtLink 
              to="/capsules" 
              class="text-gray-700 hover:text-blue-600 transition-colors"
              :class="{ 'text-blue-600 font-medium': $route.path.startsWith('/capsules') }"
            >
              瞬间胶囊
            </NuxtLink>
            <NuxtLink 
              to="/echoes" 
              class="text-gray-700 hover:text-purple-600 transition-colors"
              :class="{ 'text-purple-600 font-medium': $route.path.startsWith('/echoes') }"
            >
              地平线回响
            </NuxtLink>
            <NuxtLink 
              to="/timeline" 
              class="text-gray-700 hover:text-green-600 transition-colors"
              :class="{ 'text-green-600 font-medium': $route.path.startsWith('/timeline') }"
            >
              时间线
            </NuxtLink>
            
            <!-- 用户菜单 -->
            <div class="relative" ref="userMenuRef">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-blue-600">
                    {{ user.email?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <ChevronDownIcon class="w-4 h-4" />
              </button>
              
              <div 
                v-show="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
              >
                <div class="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  {{ user.email }}
                </div>
                <button 
                  @click="signOut"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  登出
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <NuxtLink to="/auth/login" class="btn-secondary">登录</NuxtLink>
            <NuxtLink to="/auth/register" class="btn-primary">注册</NuxtLink>
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
