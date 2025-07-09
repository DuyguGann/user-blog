<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Checkbox from 'primevue/checkbox'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

const store = useStore()
const route = useRoute()
const userId = Number(route.params.id)
const toast = useToast()

onMounted(() => {
  store.dispatch('todos/fetchTodos', userId)
})

const todos = computed(() => store.getters['todos/getTodos'] as Todo[])
const isLoading = computed(() => store.getters['todos/isLoading'])
const error = computed(() => store.getters['todos/getError'])

const toggleTodoStatus = async (todo: Todo, newStatus: boolean) => {
  const updatedTodo = { ...todo, completed: newStatus }
  try {
    await store.dispatch('todos/updateTodo', updatedTodo)
    toast.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Görev durumu güncellendi',
      life: 2000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Hata',
      detail: 'Güncelleme sırasında bir hata oluştu',
      life: 3000
    })
  }
}
</script>

<template>
  <div class="">
    <Toast />
    <Card class="shadow-lg border-0">
      <template #header>
        <div class="flex items-center gap-3 mt-5">
          <i class="pi pi-list text-2xl text-primary ml-2 "></i>
          <h2 class="text-2xl font-bold text-gray-800 m-0">
            Yapılacaklar
            <Tag :value="todos.length.toString()" severity="info" class="ml-2" />
          </h2>
        </div>
      </template>

      <template #content>
        <div v-if="isLoading" class="flex justify-center py-8">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
        </div>

        <div v-else-if="error" class="flex justify-center py-8">
          <Message severity="error" :closable="false" class="w-full">
            <template #messageicon>
              <i class="pi pi-exclamation-triangle"></i>
            </template>
            Hata: {{ error }}
          </Message>
        </div>

        <div v-else-if="todos.length === 0" class="flex flex-col items-center py-8 text-gray-500">
          <i class="pi pi-inbox text-4xl mb-2"></i>
          <p>Henüz yapılacak görev bulunmuyor</p>
        </div>

        <ul v-else class="space-y-3 p-0 m-0 list-none">
          <li
              v-for="todo in todos"
              :key="todo.id"
              class="border rounded-lg transition-all duration-200 hover:shadow-md"
              :class="todo.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'"
          >
            <div class="p-4 flex items-start gap-4">
              <Checkbox
                  :modelValue="todo.completed"
                  @update:modelValue="(value) => toggleTodoStatus(todo, value)"
                  :binary="true"
                  class="mt-1"
              />
              <div class="flex-1">
                <p
                    class="text-lg leading-relaxed break-words m-0 transition-all duration-200"
                    :class="todo.completed ? 'line-through text-gray-500' : 'text-gray-800'"
                >
                  {{ todo.title }}
                </p>
                <div class="flex items-center gap-2 mt-2">
                  <Tag
                      :value="todo.completed ? 'Tamamlandı' : 'Bekliyor'"
                      :severity="todo.completed ? 'success' : 'warning'"
                      class="text-xs"
                  />

                </div>
              </div>
            </div>
          </li>
        </ul>
      </template>
    </Card>
  </div>
</template>
