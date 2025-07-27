<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          欢迎回来
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          登录到你的账户
        </p>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
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
              class="input-field mt-1"
              placeholder="请输入密码"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">登录中...</span>
            <span v-else>登录</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            还没有账户？
            <NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-500 font-medium">
              立即注册
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
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    if (authError) {
      error.value = authError.message
    } else {
      await navigateTo('/')
    }
  } catch (err) {
    error.value = '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
