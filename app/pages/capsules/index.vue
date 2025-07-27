<template>
  <div class="min-h-screen">
    <AppNavbar />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="flex justify-between items-center mb-12 fade-in">
        <div>
          <h1 class="text-4xl font-black text-capsule mb-3">瞬间胶囊</h1>
          <p class="text-gray-600 text-lg">封存你的美好瞬间，创建专属的回忆时间线</p>
        </div>
        <NuxtLink to="/capsules/create" class="btn-primary btn-capsule shadow-capsule">
          <PlusIcon class="w-5 h-5 mr-2" />
          创建胶囊
        </NuxtLink>
      </div>

      <!-- 胶囊列表 -->
      <div v-if="loading" class="text-center py-20 fade-in">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style="animation-delay: 0.2s; animation-duration: 1.5s;"></div>
        </div>
        <p class="mt-6 text-gray-600 text-lg">正在加载你的胶囊...</p>
      </div>

      <div v-else-if="capsules.length === 0" class="text-center py-20 fade-in">
        <div class="relative mb-8">
          <div class="w-32 h-32 bg-gradient-capsule rounded-3xl flex items-center justify-center mx-auto shadow-capsule">
            <HeartIcon class="w-16 h-16 text-white" />
          </div>
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-warm rounded-full opacity-60 animate-ping"></div>
          <div class="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-echo rounded-full opacity-40 animate-pulse"></div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">还没有瞬间胶囊</h3>
        <p class="text-gray-600 mb-8 text-lg max-w-md mx-auto">
          开始创建你的第一个美好瞬间吧，让珍贵的回忆永远保存
        </p>
        <NuxtLink to="/capsules/create" class="btn-primary btn-capsule shadow-capsule text-lg px-8 py-4">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          创建第一个胶囊
        </NuxtLink>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(capsule, index) in capsules"
          :key="capsule.id"
          class="capsule-card card aurora-card cursor-pointer transition-all duration-500 slide-up"
          :style="`animation-delay: ${index * 0.1}s`"
          @click="navigateTo(`/capsules/${capsule.id}`)"
        >
          <!-- 胶囊预览图 -->
          <div class="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6 overflow-hidden relative group">
            <img
              v-if="capsule.photos && capsule.photos.length > 0"
              :src="capsule.photos[0]"
              :alt="capsule.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              @error="handleImageError($event)"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="text-center">
                <PhotoIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <span class="text-sm text-gray-500">暂无图片</span>
              </div>
            </div>
            <!-- 渐变遮罩 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- 胶囊信息 -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-1">{{ capsule.title }}</h3>
            <p class="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{{ capsule.description }}</p>
            
            <!-- 标签 -->
            <div v-if="capsule.tags && capsule.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in capsule.tags.slice(0, 3)"
                :key="tag"
                class="px-3 py-1 bg-gradient-capsule text-white text-xs rounded-full shadow-sm"
              >
                {{ tag }}
              </span>
              <span v-if="capsule.tags.length > 3" class="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{{ capsule.tags.length - 3 }}
              </span>
            </div>

            <!-- 音乐信息 -->
            <div v-if="capsule.music_title" class="flex items-center text-sm text-gray-500 mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <MusicalNoteIcon class="w-4 h-4 mr-2 text-blue-500" />
              <span class="font-medium">{{ capsule.music_title }}</span>
              <span v-if="capsule.music_artist" class="ml-1">- {{ capsule.music_artist }}</span>
            </div>

            <!-- 状态和时间 -->
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    capsule.is_sealed 
                      ? 'bg-gradient-echo text-white shadow-echo' 
                      : 'bg-gradient-timeline text-white shadow-timeline'
                  ]"
                >
                  {{ capsule.is_sealed ? '已封存' : '开放中' }}
                </span>
                <span v-if="getTimeUntilOpen(capsule)" class="px-3 py-1 bg-gradient-warm text-white rounded-full text-xs font-medium">
                  {{ getTimeUntilOpen(capsule) }}
                </span>
              </div>
              <span class="text-gray-500 text-sm font-medium">
                {{ formatDate(capsule.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { PlusIcon, HeartIcon, PhotoIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const capsules = ref([])
const loading = ref(true)

const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日')
}

const getTimeUntilOpen = (capsule) => {
  if (!capsule.is_sealed || !capsule.open_date) return null
  
  const now = new Date()
  const openDate = new Date(capsule.open_date)
  const diff = openDate.getTime() - now.getTime()
  
  if (diff <= 0) return null
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}天后开启`
  if (hours > 0) return `${hours}小时后开启`
  return '即将开启'
}

const handleImageError = (event) => {
  console.error('图片加载失败:', event.target.src)
  const parent = event.target.parentNode
  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><div class="text-center"><div class="text-2xl mb-2">📷</div><div class="text-sm">图片加载失败</div></div></div>'
}

const fetchCapsules = async () => {
  try {
    const { data, error } = await supabase
      .from('moment_capsules')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取胶囊失败:', error)
    } else {
      capsules.value = data || []
    }
  } catch (err) {
    console.error('获取胶囊失败:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCapsules()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
