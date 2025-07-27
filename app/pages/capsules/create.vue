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
          <h1 class="text-3xl font-bold text-gray-900">创建瞬间胶囊</h1>
        </div>
        <p class="text-gray-600">记录这个美好的瞬间，让它成为永恒的回忆</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- 基本信息 -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">基本信息</h2>
          
          <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                标题 *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="input-field"
                placeholder="给这个瞬间起个名字..."
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="input-field resize-none"
                placeholder="描述这个瞬间的故事..."
              ></textarea>
            </div>

            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <input
                id="tags"
                v-model="tagInput"
                type="text"
                class="input-field"
                placeholder="输入标签，用逗号分隔..."
                @blur="updateTags"
                @keydown.enter.prevent="updateTags"
              />
              <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="(tag, index) in form.tags"
                  :key="index"
                  class="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full flex items-center"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-2 text-blue-400 hover:text-blue-600"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 照片上传 -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">照片</h2>
          
          <div class="space-y-4">
            <div
              @drop="handleDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
            >
              <PhotoIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-600 mb-2">拖拽照片到这里，或者</p>
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
              />
              <button
                type="button"
                @click="$refs.fileInput.click()"
                class="btn-secondary"
              >
                选择照片
              </button>
            </div>

            <!-- 照片预览 -->
            <div v-if="selectedFiles.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  :src="file.preview"
                  :alt="`预览 ${index + 1}`"
                  class="w-full h-full object-cover"
                />
                <button
                  type="button"
                  @click="removeFile(index)"
                  class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 音乐关联 -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">音乐</h2>
          
          <div class="space-y-4">
            <div>
              <label for="musicTitle" class="block text-sm font-medium text-gray-700 mb-2">
                歌曲名称
              </label>
              <input
                id="musicTitle"
                v-model="form.music_title"
                type="text"
                class="input-field"
                placeholder="这个瞬间的背景音乐..."
              />
            </div>

            <div>
              <label for="musicArtist" class="block text-sm font-medium text-gray-700 mb-2">
                艺术家
              </label>
              <input
                id="musicArtist"
                v-model="form.music_artist"
                type="text"
                class="input-field"
                placeholder="演唱者或作者..."
              />
            </div>

            <div>
              <label for="musicUrl" class="block text-sm font-medium text-gray-700 mb-2">
                音乐链接
              </label>
              <input
                id="musicUrl"
                v-model="form.music_url"
                type="url"
                class="input-field"
                placeholder="音乐的网络链接（可选）..."
              />
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
            :disabled="loading || !form.title"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">创建中...</span>
            <span v-else>创建胶囊</span>
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const form = reactive({
  title: '',
  description: '',
  tags: [],
  music_title: '',
  music_artist: '',
  music_url: ''
})

const tagInput = ref('')
const selectedFiles = ref([])
const loading = ref(false)

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

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  addFiles(files)
}

const handleDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  addFiles(files)
}

const addFiles = (files) => {
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedFiles.value.push({
          file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const uploadPhotos = async () => {
  const photoUrls = []
  
  for (const fileObj of selectedFiles.value) {
    try {
      // 方案1：尝试上传到 Supabase 存储桶
      const bucketNames = ['photos', 'capsule-photos', 'images', 'uploads']
      let uploadSuccess = false
      
      for (const bucketName of bucketNames) {
        try {
          const fileName = `capsules/${user.value.id}/${Date.now()}-${fileObj.file.name}`
          
          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, fileObj.file, {
              cacheControl: '3600',
              upsert: false
            })
          
          if (!error) {
            const { data: { publicUrl } } = supabase.storage
              .from(bucketName)
              .getPublicUrl(fileName)
            
            photoUrls.push(publicUrl)
            uploadSuccess = true
            console.log(`照片上传成功到存储桶: ${bucketName}`)
            break
          }
        } catch (bucketError) {
          continue
        }
      }
      
      // 方案2：如果存储桶上传失败，转换为 base64 保存到数据库
      if (!uploadSuccess) {
        console.log('存储桶上传失败，使用 base64 备用方案')
        const reader = new FileReader()
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(fileObj.file)
        })
        
        const base64Data = await base64Promise
        photoUrls.push(base64Data)
        console.log('照片转换为 base64 成功')
      }
    } catch (err) {
      console.error('处理照片时出错:', err)
      throw new Error(`照片处理失败: ${err.message}`)
    }
  }
  
  return photoUrls
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // 上传照片
    let photoUrls = []
    if (selectedFiles.value.length > 0) {
      photoUrls = await uploadPhotos()
    }
    
    // 创建胶囊
    const { data, error } = await supabase
      .from('moment_capsules')
      .insert({
        user_id: user.value.id,
        title: form.title,
        description: form.description,
        photos: photoUrls,
        tags: form.tags,
        music_title: form.music_title || null,
        music_artist: form.music_artist || null,
        music_url: form.music_url || null
      })
      .select()
      .single()
    
    if (error) {
      console.error('创建胶囊失败:', error)
      alert(`创建失败: ${error.message}`)
    } else {
      router.push('/capsules')
    }
  } catch (err) {
    console.error('创建胶囊失败:', err)
    alert(`创建失败: ${err.message || '未知错误，请重试'}`)
  } finally {
    loading.value = false
  }
}
</script>
