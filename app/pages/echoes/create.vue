<template>
  <div class="min-h-screen">
    <AppNavbar />
    
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <div class="flex items-center mb-4">
          <button @click="$router.back()" class="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          <h1 class="text-3xl font-bold text-gray-900">写回响</h1>
        </div>
        <p class="text-gray-600">让内心的声音流淌，记录这一刻的感悟</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- 选择问题 -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">启发问题</h2>
          
          <div v-if="selectedQuestion" class="p-4 bg-purple-50 rounded-lg border border-purple-200 mb-4">
            <p class="text-gray-800 font-medium">{{ selectedQuestion.question }}</p>
            <span class="text-sm text-purple-600 mt-1 block">
              {{ getCategoryName(selectedQuestion.category) }}
            </span>
            <button
              type="button"
              @click="clearQuestion"
              class="text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              重新选择问题
            </button>
          </div>

          <div v-else>
            <div class="grid md:grid-cols-2 gap-4 mb-4">
              <div
                v-for="category in categories"
                :key="category.key"
                class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
                @click="selectedCategory = category.key"
                :class="{ 'border-purple-500 bg-purple-50': selectedCategory === category.key }"
              >
                <h3 class="font-medium text-gray-900 mb-2">{{ category.name }}</h3>
                <p class="text-sm text-gray-600">{{ category.description }}</p>
              </div>
            </div>

            <div v-if="selectedCategory && categoryQuestions.length > 0" class="space-y-3">
              <h3 class="font-medium text-gray-900">选择一个问题：</h3>
              <div
                v-for="question in categoryQuestions"
                :key="question.id"
                class="p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
                @click="selectQuestion(question)"
              >
                <p class="text-gray-800">{{ question.question }}</p>
              </div>
            </div>

            <div class="mt-4">
              <button
                type="button"
                @click="showCustomQuestion = !showCustomQuestion"
                class="text-purple-600 hover:text-purple-500 text-sm"
              >
                或者自定义问题
              </button>
              
              <div v-if="showCustomQuestion" class="mt-3">
                <input
                  v-model="customQuestion"
                  type="text"
                  class="input-field"
                  placeholder="输入你想回应的问题..."
                />
                <button
                  type="button"
                  @click="useCustomQuestion"
                  :disabled="!customQuestion.trim()"
                  class="btn-secondary mt-2 disabled:opacity-50"
                >
                  使用这个问题
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 回响内容 -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">你的回响</h2>
          
          <textarea
            v-model="form.response"
            rows="8"
            class="input-field resize-none"
            placeholder="写下你的感悟、思考或故事..."
            required
          ></textarea>
        </div>

        <!-- 心情评分 -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">心情评分</h2>
          
          <div class="space-y-4">
            <p class="text-gray-600">此刻的心情如何？（1-10分）</p>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">1</span>
              <div class="flex space-x-1">
                <button
                  v-for="i in 10"
                  :key="i"
                  type="button"
                  @click="form.mood_score = i"
                  :class="[
                    'w-8 h-8 rounded-full border-2 transition-colors',
                    i <= form.mood_score 
                      ? 'bg-yellow-400 border-yellow-400' 
                      : 'bg-gray-100 border-gray-300 hover:border-yellow-300'
                  ]"
                ></button>
              </div>
              <span class="text-sm text-gray-500">10</span>
            </div>
            <p v-if="form.mood_score" class="text-sm text-gray-600">
              当前评分: {{ form.mood_score }}/10
            </p>
          </div>
        </div>

        <!-- 标签 -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">标签</h2>
          
          <div class="space-y-4">
            <input
              v-model="tagInput"
              type="text"
              class="input-field"
              placeholder="添加标签，用逗号分隔..."
              @blur="updateTags"
              @keydown.enter.prevent="updateTags"
            />
            
            <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in form.tags"
                :key="index"
                class="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full flex items-center"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(index)"
                  class="ml-2 text-purple-400 hover:text-purple-600"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.back()"
            class="btn-secondary"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="loading || !selectedQuestion || !form.response.trim()"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">保存中...</span>
            <span v-else>保存回响</span>
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const selectedQuestion = ref(null)
const selectedCategory = ref('')
const categoryQuestions = ref([])
const showCustomQuestion = ref(false)
const customQuestion = ref('')
const tagInput = ref('')
const loading = ref(false)

const form = reactive({
  response: '',
  mood_score: 5,
  tags: []
})

const categories = [
  {
    key: 'reflection',
    name: '自我反思',
    description: '回顾过去，思考当下'
  },
  {
    key: 'growth',
    name: '成长感悟',
    description: '记录成长的点点滴滴'
  },
  {
    key: 'farewell',
    name: '告别思考',
    description: '面对离别，寻找意义'
  },
  {
    key: 'future',
    name: '未来展望',
    description: '展望明天，拥抱希望'
  }
]

const categoryNames = {
  reflection: '自我反思',
  growth: '成长感悟',
  farewell: '告别思考',
  future: '未来展望'
}

const getCategoryName = (category) => {
  return categoryNames[category] || '其他'
}

const fetchCategoryQuestions = async () => {
  if (!selectedCategory.value) return

  try {
    const { data, error } = await supabase
      .from('inspiration_questions')
      .select('*')
      .eq('category', selectedCategory.value)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取问题失败:', error)
    } else {
      categoryQuestions.value = data || []
    }
  } catch (err) {
    console.error('获取问题失败:', err)
  }
}

const selectQuestion = (question) => {
  selectedQuestion.value = question
}

const clearQuestion = () => {
  selectedQuestion.value = null
  selectedCategory.value = ''
  categoryQuestions.value = []
}

const useCustomQuestion = () => {
  if (customQuestion.value.trim()) {
    selectedQuestion.value = {
      id: null,
      question: customQuestion.value.trim(),
      category: 'custom'
    }
    showCustomQuestion.value = false
    customQuestion.value = ''
  }
}

const updateTags = () => {
  if (tagInput.value.trim()) {
    const newTags = tagInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !form.tags.includes(tag))
    
    form.tags.push(...newTags)
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

const handleSubmit = async () => {
  loading.value = true

  try {
    const { data, error } = await supabase
      .from('user_echoes')
      .insert({
        user_id: user.value.id,
        question_id: selectedQuestion.value.id,
        question_text: selectedQuestion.value.question,
        response: form.response,
        mood_score: form.mood_score,
        tags: form.tags
      })
      .select()
      .single()

    if (error) {
      console.error('保存回响失败:', error)
      alert('保存失败，请重试')
    } else {
      router.push('/echoes')
    }
  } catch (err) {
    console.error('保存回响失败:', err)
    alert('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

// 监听分类变化
watch(selectedCategory, () => {
  fetchCategoryQuestions()
})

// 如果URL中有question_id参数，自动选择该问题
onMounted(async () => {
  const questionId = route.query.question_id
  if (questionId) {
    try {
      const { data, error } = await supabase
        .from('inspiration_questions')
        .select('*')
        .eq('id', questionId)
        .single()

      if (!error && data) {
        selectedQuestion.value = data
      }
    } catch (err) {
      console.error('获取指定问题失败:', err)
    }
  }
})
</script>
