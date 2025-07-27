export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // 对于明确设置了 auth: false 的页面（如登录、注册），直接通过
  if (to.meta.auth === false) {
    return
  }

  // 对于显式要求认证的页面（middleware: 'auth'），检查用户是否已登录
  if (!user.value) {
    return navigateTo('/auth/login')
  }
})
