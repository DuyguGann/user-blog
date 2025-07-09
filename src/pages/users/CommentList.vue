<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.dispatch('comments/fetchComments')
})

const comments = computed(() => store.getters['comments/getComments'])
const isLoading = computed(() => store.getters['comments/isLoading'])
const error = computed(() => store.getters['comments/getError'])
</script>

<template>
  <div class="">
    <h2 class="text-xl font-bold mb-2">Yorumlar ({{ comments.length }})</h2>

    <div v-if="isLoading" class="text-gray-600">Yükleniyor...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <ul v-if="!isLoading && !error" class="space-y-4">
      <li v-for="comment in comments" :key="comment.id" class="border p-4 rounded-md shadow-sm">
        <p class="text-sm text-gray-500">{{ comment.email }}</p>
        <h3 class="text-md font-semibold">{{ comment.name }}</h3>
        <p>{{ comment.body }}</p>
      </li>
    </ul>
  </div>
</template>
