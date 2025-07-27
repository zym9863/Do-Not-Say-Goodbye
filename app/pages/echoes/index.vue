<template>
  <div class="min-h-screen">
    <AppNavbar />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">地平线回响</h1>
          <p class="text-gray-600 mt-2">通过启发性问题引导自我对话，记录成长轨迹</p>
        </div>
        <NuxtLink to="/echoes/create" class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          写回响
        </NuxtLink>
      </div>

      <!-- 今日问题 -->
      <div v-if="todayQuestion" class="card mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <LightBulbIcon class="w-6 h-6 text-purple-600" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">今日启发</h3>
            <p class="text-gray-700 mb-4">{{ todayQuestion.question }}</p>
            <NuxtLink 
              :to="`/echoes/create?question_id=${todayQuestion.id}`"
              class="btn-primary"
            >
              回应这个问题
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 回响列表 -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <div v-else-if="echoes.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChatBubbleLeftRightIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">还没有回响</h3>
        <p class="text-gray-600 mb-6">开始你的第一次自我对话吧</p>
        <NuxtLink to="/echoes/create" class="btn-primary">
          写第一个回响
        </NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="echo in echoes"
          :key="echo.id"
          class="card hover:shadow-lg transition-shadow duration-200"
        >
          <!-- 问题 -->
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-700 font-medium">{{ echo.question_text }}</p>
            <span class="text-xs text-gray-500 mt-1 block">
              {{ getCategoryName(echo.question_category) }}
            </span>
          </div>

          <!-- 回响内容 -->
          <div class="mb-4">
            <p class="text-gray-800 whitespace-pre-wrap">{{ echo.response }}</p>
          </div>

          <!-- 心情评分 -->
          <div v-if="echo.mood_score" class="mb-4">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">心情评分:</span>
              <div class="flex space-x-1">
                <div
                  v-for="i in 10"
                  :key="i"
                  :class="[
                    'w-3 h-3 rounded-full',
                    i <= echo.mood_score ? 'bg-yellow-400' : 'bg-gray-200'
                  ]"
                ></div>
              </div>
              <span class="text-sm text-gray-600">{{ echo.mood_score }}/10</span>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="echo.tags && echo.tags.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in echo.tags"
                :key="tag"
                class="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 时间 -->
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ formatDate(echo.created_at) }}</span>
            <NuxtLink 
              :to="`/echoes/${echo.id}`"
              class="text-purple-600 hover:text-purple-500"
            >
              查看详情 →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore && !loading" class="text-center mt-8">
        <button @click="loadMore" class="btn-secondary">
          加载更多
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { PlusIcon, LightBulbIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const echoes = ref([])
const todayQuestion = ref(null)
const loading = ref(true)
const hasMore = ref(true)
const page = ref(0)
const pageSize = 10

const categoryNames = {
  reflection: '自我反思',
  growth: '成长感悟',
  farewell: '告别思考',
  future: '未来展望'
}

const getCategoryName = (category) => {
  return categoryNames[category] || '其他'
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日 HH:mm')
}

const fetchTodayQuestion = async () => {
  try {
    const { data, error } = await supabase
      .from('inspiration_questions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!error && data) {
      todayQuestion.value = data
    }
  } catch (err) {
    console.error('获取今日问题失败:', err)
  }
}

const fetchEchoes = async (reset = false) => {
  try {
    if (reset) {
      page.value = 0
      echoes.value = []
    }

    const { data, error } = await supabase
      .from('user_echoes')
      .select(`
        *,
        inspiration_questions!inner(category)
      `)
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .range(page.value * pageSize, (page.value + 1) * pageSize - 1)

    if (error) {
      console.error('获取回响失败:', error)
    } else {
      const processedData = data.map(echo => ({
        ...echo,
        question_category: echo.inspiration_questions?.category
      }))

      if (reset) {
        echoes.value = processedData
      } else {
        echoes.value.push(...processedData)
      }

      hasMore.value = data.length === pageSize
      page.value++
    }
  } catch (err) {
    console.error('获取回响失败:', err)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  fetchEchoes()
}

onMounted(async () => {
  await Promise.all([
    fetchTodayQuestion(),
    fetchEchoes(true)
  ])
})
</script>
