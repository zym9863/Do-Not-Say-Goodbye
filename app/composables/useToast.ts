export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // 简单的toast实现，可以后续集成更完善的toast库
    const toast = document.createElement('div')
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 transform translate-x-full`
    
    switch (type) {
      case 'success':
        toast.className += ' bg-green-500'
        break
      case 'error':
        toast.className += ' bg-red-500'
        break
      default:
        toast.className += ' bg-blue-500'
    }
    
    toast.textContent = message
    document.body.appendChild(toast)
    
    // 显示动画
    setTimeout(() => {
      toast.classList.remove('translate-x-full')
    }, 100)
    
    // 自动隐藏
    setTimeout(() => {
      toast.classList.add('translate-x-full')
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }
  
  return {
    showToast,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info')
  }
}
