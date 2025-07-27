<template>
  <div class="min-h-screen">
    <AppNavbar />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">瞬间胶囊</h1>
          <p class="text-gray-600 mt-2">封存你的美好瞬间，创建专属的回忆时间线</p>
        </div>
        <NuxtLink to="/capsules/create" class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          创建胶囊
        </NuxtLink>
      </div>

      <!-- 胶囊列表 -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <div v-else-if="capsules.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HeartIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">还没有瞬间胶囊</h3>
        <p class="text-gray-600 mb-6">开始创建你的第一个美好瞬间吧</p>
        <NuxtLink to="/capsules/create" class="btn-primary">
          创建第一个胶囊
        </NuxtLink>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="capsule in capsules"
          :key="capsule.id"
          class="card hover:shadow-xl transition-shadow duration-200 cursor-pointer"
          @click="navigateTo(`/capsules/${capsule.id}`)"
        >
          <!-- 胶囊预览图 -->
          <div class="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
            <img
              v-if="capsule.photos && capsule.photos.length > 0"
              :src="capsule.photos[0]"
              :alt="capsule.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <PhotoIcon class="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <!-- 胶囊信息 -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ capsule.title }}</h3>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ capsule.description }}</p>
            
            <!-- 标签 -->
            <div v-if="capsule.tags && capsule.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
              <span
                v-for="tag in capsule.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
              >
                {{ tag }}
              </span>
              <span v-if="capsule.tags.length > 3" class="text-xs text-gray-500">
                +{{ capsule.tags.length - 3 }}
              </span>
            </div>

            <!-- 音乐信息 -->
            <div v-if="capsule.music_title" class="flex items-center text-sm text-gray-500 mb-3">
              <MusicalNoteIcon class="w-4 h-4 mr-1" />
              <span>{{ capsule.music_title }}</span>
              <span v-if="capsule.music_artist" class="ml-1">- {{ capsule.music_artist }}</span>
            </div>

            <!-- 状态和时间 -->
            <div class="flex justify-between items-center text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs',
                  capsule.is_sealed 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-green-100 text-green-600'
                ]"
              >
                {{ capsule.is_sealed ? '已封存' : '开放中' }}
              </span>
              <span class="text-gray-500">
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
