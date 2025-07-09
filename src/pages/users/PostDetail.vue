<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

interface CommentData {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

export default defineComponent({
  name: 'PostDetail',
  setup() {
    const route = useRoute()
    const store = useStore()
    const postId = Number(route.params.id)

    const post = ref<Post | null>(null)
    const isPostLoading = ref(true)
    const postError = ref<string | null>(null)

    const comments = computed<CommentData[]>(() => store.getters['comments/getComments'])
    const isLoading = computed<boolean>(() => store.getters['comments/isLoading'])
    const error = computed<string | null>(() => store.getters['comments/getError'])

    onMounted(async () => {
      try {
        isPostLoading.value = true
        const response = await axios.get<Post>(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        post.value = response.data
      } catch (err) {
        if (err instanceof Error) {
          postError.value = err.message
        } else {
          postError.value = 'Gönderi alınamadı.'
        }
      } finally {
        isPostLoading.value = false
      }

      store.dispatch('comments/fetchComments', postId)
    })

    return {
      post,
      isPostLoading,
      postError,
      comments,
      isLoading,
      error
    }
  }
})
</script>


<template>
  <div class="max-w-4xl mx-auto px-6 py-10 bg-gray-50 min-h-screen rounded-lg shadow-lg ">

    <div v-if="isPostLoading" class="text-center text-gray-500">Gönderi yükleniyor...</div>

    <div v-else-if="postError" class="text-center text-red-500">Hata: {{ postError }}</div>

    <div v-else-if="!post" class="text-center text-gray-500">Gönderi bulunamadı.</div>

    <div v-else>
      <div class="mb-10">
        <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>
          <p class="text-gray-700 text-base whitespace-pre-line leading-relaxed">
            {{ post.body }}
          </p>
        </div>
      </div>

      <h2 class="text-2xl font-semibold text-gray-800 mb-4">💬 Yorumlar ({{ comments.length }})</h2>

      <div v-if="isLoading" class="text-center text-gray-500">Yorumlar yükleniyor...</div>
      <div v-else-if="error" class="text-center text-red-500">Hata: {{ error }}</div>

      <div v-else class="w-full space-y-4">
        <Fieldset
            v-for="comment in comments"
            :key="comment.id"
            :legend="comment.email"
            toggleable
            class="w-full border border-gray-300 shadow-sm hover:shadow-md transition mb-2"
        >
          <div class="mb-2">
            <span class="text-lg font-bold text-gray-800 italic">{{ comment.name }}</span>
          </div>
          <p class="text-sm text-gray-700">
            {{ comment.body }}
          </p>
        </Fieldset>
      </div>
    </div>
  </div>
</template>
