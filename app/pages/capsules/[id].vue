<template>
  <div class="min-h-screen">
    <AppNavbar />
    
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <div v-else-if="!capsule" class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 mb-2">胶囊不存在</h3>
        <p class="text-gray-600 mb-6">这个胶囊可能已被删除或不存在</p>
        <NuxtLink to="/capsules" class="btn-primary">返回胶囊列表</NuxtLink>
      </div>

      <div v-else>
        <!-- 页面标题 -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center">
            <button @click="$router.back()" class="mr-4 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ capsule.title }}</h1>
              <p class="text-gray-600 mt-1">创建于 {{ formatDate(capsule.created_at) }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <span
              :class="[
                'px-3 py-1 rounded-full text-sm',
                capsule.is_sealed 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-green-100 text-green-600'
              ]"
            >
              {{ capsule.is_sealed ? '已封存' : '开放中' }}
            </span>
            
            <span v-if="timeUntilOpen" class="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
              {{ timeUntilOpen }}后开启
            </span>
            
            <button
              v-if="!capsule.is_sealed"
              @click="toggleSeal"
              class="btn-secondary"
            >
              封存胶囊
            </button>
            
            <button
              v-else-if="canOpen"
              @click="toggleSeal"
              class="btn-primary"
            >
              开启胶囊
            </button>
          </div>
        </div>

        <!-- 照片展示 -->
        <div v-if="capsule.photos && capsule.photos.length > 0" class="card mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">照片</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="(photo, index) in capsule.photos"
              :key="index"
              class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              @click="openPhotoModal(index)"
            >
              <img
                :src="photo"
                :alt="`照片 ${index + 1}`"
                class="w-full h-full object-cover"
                @error="handleImageError($event)"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <!-- 描述 -->
        <div v-if="capsule.description" class="card mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">描述</h2>
          <p class="text-gray-700 whitespace-pre-wrap">{{ capsule.description }}</p>
        </div>

        <!-- 音乐信息 -->
        <div v-if="capsule.music_title" class="card mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">音乐</h2>
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <MusicalNoteIcon class="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900">{{ capsule.music_title }}</h3>
              <p v-if="capsule.music_artist" class="text-gray-600">{{ capsule.music_artist }}</p>
              <a
                v-if="capsule.music_url"
                :href="capsule.music_url"
                target="_blank"
                class="text-blue-600 hover:text-blue-500 text-sm"
              >
                播放音乐 →
              </a>
            </div>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="capsule.tags && capsule.tags.length > 0" class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">标签</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in capsule.tags"
              :key="tag"
              class="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </main>

    <!-- 照片模态框 -->
    <div
      v-if="showPhotoModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="closePhotoModal"
    >
      <div class="max-w-4xl max-h-full p-4">
        <img
          :src="capsule.photos[currentPhotoIndex]"
          :alt="`照片 ${currentPhotoIndex + 1}`"
          class="max-w-full max-h-full object-contain"
        />
        
        <!-- 导航按钮 -->
        <div v-if="capsule.photos.length > 1" class="absolute inset-y-0 left-4 flex items-center">
          <button
            @click.stop="previousPhoto"
            class="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white"
          >
            <ChevronLeftIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div v-if="capsule.photos.length > 1" class="absolute inset-y-0 right-4 flex items-center">
          <button
            @click.stop="nextPhoto"
            class="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white"
          >
            <ChevronRightIcon class="w-6 h-6" />
          </button>
        </div>
        
        <!-- 关闭按钮 -->
        <button
          @click="closePhotoModal"
          class="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, MusicalNoteIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const capsule = ref(null)
const loading = ref(true)
const showPhotoModal = ref(false)
const currentPhotoIndex = ref(0)
const autoCheckTimer = ref(null)

const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日 HH:mm')
}

const canOpen = computed(() => {
  if (!capsule.value?.is_sealed || !capsule.value?.open_date) return false
  return new Date() >= new Date(capsule.value.open_date)
})

const timeUntilOpen = computed(() => {
  if (!capsule.value?.is_sealed || !capsule.value?.open_date) return null
  
  const now = new Date()
  const openDate = new Date(capsule.value.open_date)
  const diff = openDate.getTime() - now.getTime()
  
  if (diff <= 0) return null
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}天${hours}小时`
  if (hours > 0) return `${hours}小时${minutes}分钟`
  return `${minutes}分钟`
})

const startAutoCheck = () => {
  if (capsule.value?.is_sealed && capsule.value?.open_date) {
    autoCheckTimer.value = setInterval(() => {
      if (canOpen.value) {
        clearInterval(autoCheckTimer.value)
        // 胶囊可以开启了，刷新状态
        fetchCapsule()
      }
    }, 60000) // 每分钟检查一次
  }
}

const stopAutoCheck = () => {
  if (autoCheckTimer.value) {
    clearInterval(autoCheckTimer.value)
    autoCheckTimer.value = null
  }
}

const fetchCapsule = async () => {
  try {
    const { data, error } = await supabase
      .from('moment_capsules')
      .select('*')
      .eq('id', route.params.id)
      .eq('user_id', user.value.id)
      .single()

    if (error) {
      console.error('获取胶囊失败:', error)
    } else {
      capsule.value = data
      // 启动定时检查
      stopAutoCheck() // 先清除之前的定时器
      startAutoCheck()
    }
  } catch (err) {
    console.error('获取胶囊失败:', err)
  } finally {
    loading.value = false
  }
}

const toggleSeal = async () => {
  if (!capsule.value) return

  const isSealing = !capsule.value.is_sealed
  let updateData = {
    is_sealed: isSealing
  }

  if (isSealing) {
    // 封存时设置开启日期（例如：30天后）
    const openDate = new Date()
    openDate.setDate(openDate.getDate() + 30)
    updateData.seal_date = new Date().toISOString()
    updateData.open_date = openDate.toISOString()
  } else {
    // 开启时清除封存相关日期
    updateData.seal_date = null
    updateData.open_date = null
  }

  try {
    const { error } = await supabase
      .from('moment_capsules')
      .update(updateData)
      .eq('id', capsule.value.id)

    if (error) {
      console.error('更新胶囊状态失败:', error)
      alert('操作失败，请重试')
    } else {
      capsule.value = { ...capsule.value, ...updateData }
    }
  } catch (err) {
    console.error('更新胶囊状态失败:', err)
    alert('操作失败，请重试')
  }
}

const openPhotoModal = (index) => {
  currentPhotoIndex.value = index
  showPhotoModal.value = true
}

const closePhotoModal = () => {
  showPhotoModal.value = false
}

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  } else {
    currentPhotoIndex.value = capsule.value.photos.length - 1
  }
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < capsule.value.photos.length - 1) {
    currentPhotoIndex.value++
  } else {
    currentPhotoIndex.value = 0
  }
}

const handleImageError = (event) => {
  console.error('图片加载失败:', event.target.src)
  event.target.style.display = 'none'
  // 创建一个错误提示元素
  const errorDiv = document.createElement('div')
  errorDiv.className = 'w-full h-full flex items-center justify-center text-gray-400'
  errorDiv.innerHTML = '<div class="text-center"><div class="text-2xl mb-2">📷</div><div class="text-sm">图片加载失败</div></div>'
  event.target.parentNode.appendChild(errorDiv)
}

onMounted(() => {
  fetchCapsule()
})

onUnmounted(() => {
  stopAutoCheck()
})
</script>
