<template>
  <div class="min-h-screen">
    <AppNavbar />
    
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <div v-else-if="!echo" class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 mb-2">回响不存在</h3>
        <p class="text-gray-600 mb-6">这个回响可能已被删除或不存在</p>
        <NuxtLink to="/echoes" class="btn-primary">返回回响列表</NuxtLink>
      </div>

      <div v-else>
        <!-- 页面标题 -->
        <div class="flex items-center mb-8">
          <button @click="$router.back()" class="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">回响详情</h1>
            <p class="text-gray-600 mt-1">创建于 {{ formatDate(echo.created_at) }}</p>
          </div>
        </div>

        <!-- 启发问题 -->
        <div class="card mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <LightBulbIcon class="w-6 h-6 text-purple-600" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">启发问题</h3>
              <p class="text-gray-700 mb-2">{{ echo.question_text }}</p>
              <span class="text-sm text-purple-600">
                {{ getCategoryName(echo.question_category) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 回响内容 -->
        <div class="card mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">我的回响</h2>
          <div class="prose max-w-none">
            <p class="text-gray-800 whitespace-pre-wrap leading-relaxed">{{ echo.response }}</p>
          </div>
        </div>

        <!-- 心情评分 -->
        <div v-if="echo.mood_score" class="card mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">心情评分</h2>
          <div class="flex items-center space-x-4">
            <div class="flex space-x-1">
              <div
                v-for="i in 10"
                :key="i"
                :class="[
                  'w-6 h-6 rounded-full',
                  i <= echo.mood_score ? 'bg-yellow-400' : 'bg-gray-200'
                ]"
              ></div>
            </div>
            <span class="text-lg font-medium text-gray-700">{{ echo.mood_score }}/10</span>
          </div>
          <p class="text-gray-600 mt-2">
            {{ getMoodDescription(echo.mood_score) }}
          </p>
        </div>

        <!-- 标签 -->
        <div v-if="echo.tags && echo.tags.length > 0" class="card mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">标签</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in echo.tags"
              :key="tag"
              class="px-3 py-2 bg-purple-100 text-purple-600 text-sm rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 相关回响 -->
        <div v-if="relatedEchoes.length > 0" class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">相关回响</h2>
          <div class="space-y-4">
            <div
              v-for="relatedEcho in relatedEchoes"
              :key="relatedEcho.id"
              class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              @click="navigateTo(`/echoes/${relatedEcho.id}`)"
            >
              <p class="text-gray-800 font-medium mb-2 line-clamp-2">{{ relatedEcho.question_text }}</p>
              <p class="text-gray-600 text-sm line-clamp-3">{{ relatedEcho.response }}</p>
              <div class="flex justify-between items-center mt-3">
                <span class="text-xs text-gray-500">{{ formatDate(relatedEcho.created_at) }}</span>
                <div v-if="relatedEcho.mood_score" class="flex items-center space-x-1">
                  <div
                    v-for="i in 5"
                    :key="i"
                    :class="[
                      'w-2 h-2 rounded-full',
                      i <= Math.round(relatedEcho.mood_score / 2) ? 'bg-yellow-400' : 'bg-gray-200'
                    ]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, LightBulbIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const echo = ref(null)
const relatedEchoes = ref([])
const loading = ref(true)

const categoryNames = {
  reflection: '自我反思',
  growth: '成长感悟',
  farewell: '告别思考',
  future: '未来展望',
  custom: '自定义'
}

const getCategoryName = (category) => {
  return categoryNames[category] || '其他'
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日 HH:mm')
}

const getMoodDescription = (score) => {
  if (score <= 2) return '心情低落'
  if (score <= 4) return '有些沮丧'
  if (score <= 6) return '心情一般'
  if (score <= 8) return '心情不错'
  return '心情很好'
}

const fetchEcho = async () => {
  try {
    const { data, error } = await supabase
      .from('user_echoes')
      .select(`
        *,
        inspiration_questions(category)
      `)
      .eq('id', route.params.id)
      .eq('user_id', user.value.id)
      .single()

    if (error) {
      console.error('获取回响失败:', error)
    } else {
      echo.value = {
        ...data,
        question_category: data.inspiration_questions?.category
      }
      
      // 获取相关回响
      await fetchRelatedEchoes()
    }
  } catch (err) {
    console.error('获取回响失败:', err)
  } finally {
    loading.value = false
  }
}

const fetchRelatedEchoes = async () => {
  if (!echo.value) return

  try {
    // 基于标签或问题类别查找相关回响
    let query = supabase
      .from('user_echoes')
      .select(`
        id,
        question_text,
        response,
        created_at,
        mood_score,
        tags
      `)
      .eq('user_id', user.value.id)
      .neq('id', echo.value.id)
      .order('created_at', { ascending: false })
      .limit(3)

    // 如果有标签，优先查找有相同标签的回响
    if (echo.value.tags && echo.value.tags.length > 0) {
      query = query.overlaps('tags', echo.value.tags)
    }

    const { data, error } = await query

    if (!error && data) {
      relatedEchoes.value = data
    }
  } catch (err) {
    console.error('获取相关回响失败:', err)
  }
}

onMounted(() => {
  fetchEcho()
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
