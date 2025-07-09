<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Card from 'primevue/card'
import PrimeButton from 'primevue/button'
import InputText from 'primevue/inputtext'
import PrimeTextarea from 'primevue/textarea'
import PrimeDialog from 'primevue/dialog'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import type { Comment } from '@/store/modules/comments'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import Paginator from 'primevue/paginator'

import Accordion from 'primevue/accordion'
interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export default defineComponent({
  name: 'PostList',
  components: {
    Card, PrimeButton, InputText, PrimeTextarea, PrimeDialog,
    Accordion, TabView, TabPanel, ConfirmDialog, Paginator
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const userId = route.params.id

    const isDialogVisible = ref(false)
    const isEditMode = ref(false)
    const currentPostId = ref<number | null>(null)

    const newPostTitle = ref('')
    const newPostBody = ref('')

    const toast = useToast()
    const confirm = useConfirm()

    const posts = computed(() => store.getters['postList/getPosts'])
    const isLoading = computed(() => store.getters['postList/isLoading'])
    const error = computed(() => store.getters['postList/getError'])

    const comments = computed(() => store.getters['comments/getComments'])
    const commentsLoading = computed(() => store.getters['comments/isLoading'])
    const commentsError = computed(() => store.getters['comments/getError'])

    const loadComments = (postId: number) => {
      store.dispatch('comments/fetchComments', postId)
    }

    const filteredComments = (postId: number): Comment[] => {
      return comments.value.filter((comment: Comment) => comment.postId === postId)
    }

    const openNewPostDialog = () => {
      isEditMode.value = false
      currentPostId.value = null
      newPostTitle.value = ''
      newPostBody.value = ''
      isDialogVisible.value = true
    }

    const openEditDialog = (post: Post) => {
      isEditMode.value = true
      currentPostId.value = post.id
      newPostTitle.value = post.title
      newPostBody.value = post.body
      isDialogVisible.value = true
    }

    const savePost = async () => {
      if (!newPostTitle.value.trim() || !newPostBody.value.trim()) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Başlık ve içerik boş bırakılamaz', life: 3000 })
        return
      }

      const payload = {
        userId: 1,
        title: newPostTitle.value,
        body: newPostBody.value
      }

      if (isEditMode.value && currentPostId.value !== null) {
        await store.dispatch('postList/updatePost', { ...payload, id: currentPostId.value })
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Gönderi güncellendi', life: 3000 })
      } else {
        await store.dispatch('postList/createPost', payload)
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Gönderi oluşturuldu', life: 3000 })
      }

      isDialogVisible.value = false
    }

    const deletePost = (id: number) => {
      confirm.require({
        message: 'Bu gönderiyi silmek istediğinize emin misiniz?',
        header: 'Silme Onayı',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sil',
        rejectLabel: 'İptal',
        accept: async () => {
          await store.dispatch('postList/deletePost', id)
          toast.add({ severity: 'warn', summary: 'Silindi', detail: 'Gönderi silindi', life: 3000 })
        },
        reject: () => {
          toast.add({ severity: 'info', summary: 'İptal Edildi', detail: 'Silme işlemi iptal edildi', life: 3000 })
        }
      })
    }

    const currentPage = ref(0)
    const rowsPerPage = 3

    const paginatedPosts = computed(() => {
      const start = currentPage.value * rowsPerPage
      return posts.value.slice(start, start + rowsPerPage)
    })

    const onPageChange = (event: any) => {
      currentPage.value = event.page
    }

    onMounted(() => {
      store.dispatch('postList/fetchPosts', userId)
    })

    return {
      posts,
      isLoading,
      error,
      isDialogVisible,
      newPostTitle,
      newPostBody,
      savePost,
      openNewPostDialog,
      openEditDialog,
      deletePost,
      toast,
      loadComments,
      filteredComments,
      commentsLoading,
      commentsError,
      paginatedPosts,
      rowsPerPage,
      currentPage,
      onPageChange
    }
  }
})
</script>

<template>
  <div class="">
    <Toast />
    <ConfirmDialog />

    <div class="flex justify-between items-center mb-6 flex-wrap">
      <h2 class="text-2xl font-bold  flex items-center gap-2">
        📝 Gönderi Listesi <Tag :value="posts.length.toString()" severity="info" />
      </h2>

      <div class="ml-auto">
        <PrimeButton label="Yeni Gönderi" icon="pi pi-plus" @click="openNewPostDialog" />
      </div>
    </div>

    <div v-if="isLoading" class="text-gray-500">Yükleniyor...</div>
    <div v-else-if="error" class="text-red-500">Hata: {{ error }}</div>

    <div v-else>
      <!-- Kartlar -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        <Card
            v-for="post in paginatedPosts"
            :key="post.id"
            class="shadow-sm hover:shadow-md transition duration-200 w-full"
        >
          <template #title>
            <h2 class="text-base font-semibold text-gray-800 break-words line-clamp-2 m-1">
              {{ post.title }}
            </h2>
          </template>

          <template #content>
            <p class="text-sm text-gray-700 leading-snug ">{{ post.body }}</p>

            <Accordion
                :activeIndex="null"
                @tab-open="() => loadComments(post.id)"
                class="w-full border-none shadow-none bg-transparent"
            >
              <AccordionTab
                  header="Yorumları Göster"
                  class="!bg-transparent !border-none !shadow-none"
                  headerClass="!bg-transparent !text-gray-700 !text-sm !font-medium"
                  contentClass="!bg-transparent !p-0"
              >
                <div v-if="commentsLoading" class="text-gray-500 text-sm">Yorumlar yükleniyor...</div>
                <div v-else-if="commentsError" class="text-red-500 text-sm">Hata: {{ commentsError }}</div>

                <div v-else class="space-y-2">
                  <div
                      v-for="comment in filteredComments(post.id).slice(0, 2)"
                      :key="comment.id"
                      class="bg-gray-50 border border-gray-200 rounded p-3"
                  >
                    <div class="font-medium text-sm text-gray-800 mb-1">
                      {{ comment.name }}
                      <span class="text-gray-400 text-xs ml-2">&lt;{{ comment.email }}&gt;</span>
                    </div>
                    <div class="text-sm text-gray-700 leading-tight">{{ comment.body }}</div>
                  </div>

                  <div v-if="filteredComments(post.id).length > 2" class="flex justify-end">
                    <PrimeButton label="Tüm Yorumları Gör" icon="pi pi-angle-right" class="p-button-sm p-button-text text-blue-600" @click="$router.push(`/posts/${post.id}/comments`)"/>
                  </div>
                </div>
              </AccordionTab>
            </Accordion>

            <div class="w-full">
              <div class="flex justify-end gap-2 pt-4">
                <PrimeButton label="Düzenle" icon="pi pi-pencil" class="p-button-sm" @click="openEditDialog(post)"/>
                <PrimeButton label="Sil" icon="pi pi-trash" class="p-button-sm p-button-danger" @click="deletePost(post.id)"/>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <Paginator
          :rows="rowsPerPage"
          :totalRecords="posts.length"
          :first="currentPage * rowsPerPage"
          @page="onPageChange"
          class="mt-6"
      />
    </div>

    <PrimeDialog v-model:visible="isDialogVisible" modal header="Gönderi Formu" :style="{ width: '600px' }">
      <TabView class="mb-4">
        <TabPanel header="Başlık">
          <div class="mb-4">
            <label class="block text-sm mb-1">Başlık</label>
            <InputText
                v-model="newPostTitle"
                :class="['w-full', newPostTitle.trim() === '' && attemptedSubmit ? 'border-red-500' : '']"
            />
            <p v-if="newPostTitle.trim() === '' && attemptedSubmit" class="text-red-500 text-sm mt-1">
              Başlık boş olamaz.
            </p>
          </div>
        </TabPanel>

        <TabPanel header="İçerik">
          <div class="mb-4">
            <label class="block text-sm mb-1">İçerik</label>
            <PrimeTextarea
                v-model="newPostBody"
                autoResize
                rows="6"
                class="w-full"
                :class="newPostBody.trim() === '' && attemptedSubmit ? 'border-red-500' : ''"
            />
            <p v-if="newPostBody.trim() === '' && attemptedSubmit" class="text-red-500 text-sm mt-1">
              İçerik boş olamaz.
            </p>
          </div>
        </TabPanel>

      </TabView>
      <template #footer>
        <PrimeButton label="İptal" icon="pi pi-times" class="p-button-text" @click="isDialogVisible = false"/>
        <PrimeButton label="Kaydet" icon="pi pi-check" @click="savePost"/>
      </template>
    </PrimeDialog>
  </div>
</template>
