<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          创建账户
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          开始你的回忆之旅
        </p>
      </div>
      
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              邮箱地址
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field mt-1"
              placeholder="请输入邮箱地址"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="input-field mt-1"
              placeholder="请输入密码（至少6位）"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              确认密码
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="input-field mt-1"
              placeholder="请再次输入密码"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div v-if="success" class="text-green-600 text-sm text-center">
          {{ success }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">注册中...</span>
            <span v-else>注册</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            已有账户？
            <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-500 font-medium">
              立即登录
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
  auth: false
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// 如果已登录，重定向到首页
watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  // 验证密码
  if (form.password !== form.confirmPassword) {
    error.value = '两次输入的密码不一致'
    loading.value = false
    return
  }

  if (form.password.length < 6) {
    error.value = '密码长度至少为6位'
    loading.value = false
    return
  }

  try {
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    })

    if (authError) {
      error.value = authError.message
    } else {
      success.value = '注册成功！请检查邮箱并点击确认链接。'
      // 清空表单
      form.email = ''
      form.password = ''
      form.confirmPassword = ''
    }
  } catch (err) {
    error.value = '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
