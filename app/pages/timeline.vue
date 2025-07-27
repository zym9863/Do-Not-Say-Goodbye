<template>
  <div class="min-h-screen">
    <AppNavbar />
    
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">成长时间线</h1>
        <p class="text-gray-600 mt-2">回顾你的回忆胶囊和心路历程</p>
      </div>

      <!-- 统计信息 -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="card text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ stats.capsules }}</div>
          <div class="text-gray-600">瞬间胶囊</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-purple-600 mb-2">{{ stats.echoes }}</div>
          <div class="text-gray-600">地平线回响</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">{{ stats.days }}</div>
          <div class="text-gray-600">使用天数</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-yellow-600 mb-2">{{ stats.avgMood.toFixed(1) }}</div>
          <div class="text-gray-600">平均心情</div>
        </div>
      </div>

      <!-- 时间线 -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <div v-else-if="timelineItems.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClockIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">还没有时间线记录</h3>
        <p class="text-gray-600 mb-6">开始创建胶囊和回响来建立你的成长轨迹</p>
        <div class="space-x-4">
          <NuxtLink to="/capsules/create" class="btn-primary">创建胶囊</NuxtLink>
          <NuxtLink to="/echoes/create" class="btn-secondary">写回响</NuxtLink>
        </div>
      </div>

      <div v-else class="relative">
        <!-- 时间线主线 -->
        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div class="space-y-8">
          <div
            v-for="(item, index) in timelineItems"
            :key="`${item.type}-${item.id}`"
            class="relative flex items-start space-x-6"
          >
            <!-- 时间线节点 -->
            <div
              :class="[
                'relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-lg',
                item.type === 'capsule' ? 'bg-blue-500' : 'bg-purple-500'
              ]"
            >
              <HeartIcon v-if="item.type === 'capsule'" class="w-8 h-8 text-white" />
              <ChatBubbleLeftRightIcon v-else class="w-8 h-8 text-white" />
            </div>

            <!-- 内容卡片 -->
            <div class="flex-1 min-w-0">
              <div
                class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                @click="navigateToItem(item)"
              >
                <!-- 胶囊内容 -->
                <div v-if="item.type === 'capsule'">
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">{{ item.title }}</h3>
                      <p class="text-sm text-gray-500">瞬间胶囊 · {{ formatDate(item.created_at) }}</p>
                    </div>
                    <span
                      :class="[
                        'px-2 py-1 rounded-full text-xs',
                        item.is_sealed 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-green-100 text-green-600'
                      ]"
                    >
                      {{ item.is_sealed ? '已封存' : '开放中' }}
                    </span>
                  </div>

                  <p v-if="item.description" class="text-gray-700 mb-4 line-clamp-2">
                    {{ item.description }}
                  </p>

                  <!-- 胶囊预览 -->
                  <div class="flex items-center space-x-4">
                    <div v-if="item.photos && item.photos.length > 0" class="flex -space-x-2">
                      <img
                        v-for="(photo, photoIndex) in item.photos.slice(0, 3)"
                        :key="photoIndex"
                        :src="photo"
                        :alt="`照片 ${photoIndex + 1}`"
                        class="w-10 h-10 rounded-full border-2 border-white object-cover"
                      />
                      <div
                        v-if="item.photos.length > 3"
                        class="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600"
                      >
                        +{{ item.photos.length - 3 }}
                      </div>
                    </div>

                    <div v-if="item.music_title" class="flex items-center text-sm text-gray-500">
                      <MusicalNoteIcon class="w-4 h-4 mr-1" />
                      <span>{{ item.music_title }}</span>
                    </div>
                  </div>
                </div>

                <!-- 回响内容 -->
                <div v-else>
                  <div class="mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.question_text }}</h3>
                    <p class="text-sm text-gray-500">地平线回响 · {{ formatDate(item.created_at) }}</p>
                  </div>

                  <p class="text-gray-700 mb-4 line-clamp-3">{{ item.response }}</p>

                  <div class="flex items-center justify-between">
                    <div v-if="item.mood_score" class="flex items-center space-x-2">
                      <span class="text-sm text-gray-600">心情:</span>
                      <div class="flex space-x-1">
                        <div
                          v-for="i in 5"
                          :key="i"
                          :class="[
                            'w-3 h-3 rounded-full',
                            i <= Math.round(item.mood_score / 2) ? 'bg-yellow-400' : 'bg-gray-200'
                          ]"
                        ></div>
                      </div>
                    </div>

                    <div v-if="item.tags && item.tags.length > 0" class="flex space-x-1">
                      <span
                        v-for="tag in item.tags.slice(0, 2)"
                        :key="tag"
                        class="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                      >
                        {{ tag }}
                      </span>
                      <span v-if="item.tags.length > 2" class="text-xs text-gray-500">
                        +{{ item.tags.length - 2 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="text-center mt-8">
          <button @click="loadMore" :disabled="loadingMore" class="btn-secondary">
            <span v-if="loadingMore">加载中...</span>
            <span v-else>加载更多</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { HeartIcon, ChatBubbleLeftRightIcon, ClockIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const timelineItems = ref([])
const stats = ref({
  capsules: 0,
  echoes: 0,
  days: 0,
  avgMood: 0
})
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const page = ref(0)
const pageSize = 10

const formatDate = (date) => {
  return dayjs(date).format('MM月DD日 HH:mm')
}

const navigateToItem = (item) => {
  if (item.type === 'capsule') {
    navigateTo(`/capsules/${item.id}`)
  } else {
    navigateTo(`/echoes/${item.id}`)
  }
}

const fetchStats = async () => {
  try {
    // 获取胶囊数量
    const { count: capsulesCount } = await supabase
      .from('moment_capsules')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.value.id)

    // 获取回响数量和平均心情
    const { data: echoesData } = await supabase
      .from('user_echoes')
      .select('mood_score, created_at')
      .eq('user_id', user.value.id)

    // 计算使用天数
    const { data: firstRecord } = await supabase
      .from('moment_capsules')
      .select('created_at')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    let daysSinceFirst = 0
    if (firstRecord) {
      daysSinceFirst = dayjs().diff(dayjs(firstRecord.created_at), 'day') + 1
    }

    // 计算平均心情
    const moodScores = echoesData?.filter(echo => echo.mood_score).map(echo => echo.mood_score) || []
    const avgMood = moodScores.length > 0 
      ? moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length 
      : 0

    stats.value = {
      capsules: capsulesCount || 0,
      echoes: echoesData?.length || 0,
      days: daysSinceFirst,
      avgMood
    }
  } catch (err) {
    console.error('获取统计信息失败:', err)
  }
}

const fetchTimelineItems = async (reset = false) => {
  try {
    if (reset) {
      page.value = 0
      timelineItems.value = []
      loadingMore.value = false
    } else {
      loadingMore.value = true
    }

    // 获取胶囊
    const { data: capsules } = await supabase
      .from('moment_capsules')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .range(page.value * pageSize, (page.value + 1) * pageSize - 1)

    // 获取回响
    const { data: echoes } = await supabase
      .from('user_echoes')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .range(page.value * pageSize, (page.value + 1) * pageSize - 1)

    // 合并并按时间排序
    const allItems = [
      ...(capsules || []).map(item => ({ ...item, type: 'capsule' })),
      ...(echoes || []).map(item => ({ ...item, type: 'echo' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    if (reset) {
      timelineItems.value = allItems
    } else {
      timelineItems.value.push(...allItems)
    }

    hasMore.value = allItems.length === pageSize * 2
    page.value++
  } catch (err) {
    console.error('获取时间线数据失败:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  fetchTimelineItems()
}

onMounted(async () => {
  await Promise.all([
    fetchStats(),
    fetchTimelineItems(true)
  ])
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
