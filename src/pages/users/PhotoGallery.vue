<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Dialog from 'primevue/dialog'
import Galleria from 'primevue/galleria'
import type { Photo } from '@/store/modules/photos'
import Tag from "primevue/tag";
const store = useStore()
const route = useRoute()

const userId = route.params.id
const galleryTitle = ref('')
const albums = ref<{ id: number; title: string }[]>([])

const isModalVisible = ref(false)
const selectedAlbumId = ref<number | null>(null)
const galleryPhotos = ref([])

const responsiveOptions = [
  { breakpoint: '1300px', numVisible: 4 },
  { breakpoint: '575px', numVisible: 1 }
]

const photosFromStore = computed(() => store.getters['photos/getPhotos'])
const isLoading = computed(() => store.getters['photos/isLoading'])

async function loadAlbums() {
  const response = await fetch(https://jsonplaceholder.typicode.com/albums?userId=${userId})
  albums.value = await response.json()
}

async function openGallery(albumId: number) {
  selectedAlbumId.value = albumId

  const selectedAlbum = albums.value.find((a) => a.id === albumId)
  galleryTitle.value = selectedAlbum ? ${selectedAlbum.title} – Fotoğraflar : 'Albüm Fotoğrafları'

  await store.dispatch('photos/fetchPhotos', albumId)

  const originalPhotos = photosFromStore.value

  const fakePhotos = originalPhotos.map((photo: Photo, index: number) => ({
    title: photo.title,
    url: https://picsum.photos/600/400?random=${albumId}_${index},
    thumbnailUrl: https://picsum.photos/150/100?random=${albumId}_${index}
  }))

  galleryPhotos.value = fakePhotos
  isModalVisible.value = true
}

function closeGallery() {
  isModalVisible.value = false
  selectedAlbumId.value = null
  galleryPhotos.value = []
}

watch(isModalVisible, (visible) => {
  if (!visible) {
    closeGallery()
  }
})

onMounted(() => {
  loadAlbums()
})
</script>


<template>
    <div class="p-4 max-w-6xl mx-auto ">
      <div class="flex items-center gap-3 mt-5 mb-5 ml-2">
        <i class="pi pi-images text-2xl text-primary mt-1"></i>
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold text-gray-800 m-0">Albüm Kartları</h2>
          <Tag :value="albums.length.toString()" severity="info" />
        </div>
      </div>

      <div class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
        <div
            v-for="album in albums"
            :key="album.id"
            @click="openGallery(album.id)"
            class="transition-all duration-200 hover:shadow-xl hover:scale-[1.02] hover:border-blue-400 border border-gray-200 rounded-lg cursor-pointer"
        >
          <Card style="overflow: hidden">
            <template #header>
              <div class="w-full h-20 overflow-hidden">
                <img
                    :src="https://picsum.photos/350/200?random=${album.id}"
                    class="w-full h-full object-cover"
                    alt="Albüm kapak"
                />
              </div>
            </template>

            <template #title>
              <h3 class="text-base font-semibold text-gray-800 break-words whitespace-normal overflow-hidden">
                {{ album.title }}
              </h3>
            </template>


            <template #content>
              <p class="m-0 text-gray-600">
                Bu albüme ait fotoğrafları görmek için karta tıklayın.
              </p>
            </template>
          </Card>
        </div>
      </div>

      <Dialog
        v-model:visible="isModalVisible"
        :header="galleryTitle"
        :modal="true"
        :closable="true"
        :dismissableMask="true"
        :style="{ width: '70vw' }"
    >
    <div v-if="isLoading" class="text-center py-10">Yükleniyor...</div>

      <Galleria
          v-else-if="galleryPhotos.length"
          :value="galleryPhotos"
          :responsiveOptions="responsiveOptions"
          :numVisible="5"
          containerStyle="max-width: 100%; width: 100%"
          style="min-height: 300px; width: 100%;"
      >
        <template #item="slotProps">
          <div style="text-align:center; width: 100%;">
            <img
                :src="slotProps.item.url"
                :alt="slotProps.item.title"
                style="width: 100%; object-fit: contain; max-height: 400px"
            />
            <p style="margin-top: 8px; font-weight: 600;">{{ slotProps.item.title }}</p>
          </div>
        </template>

        <template #thumbnail="slotProps">
          <div style="width: 100%;">
            <img
                :src="slotProps.item.thumbnailUrl"
                :alt="slotProps.item.title"
                style="width: 100%; height: 60px; object-fit: cover"
            />
          </div>
        </template>
      </Galleria>

    </Dialog>
  </div>
</template>