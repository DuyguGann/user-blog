<script lang="ts" setup>
import {ref, onMounted, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import Sidebar from 'primevue/sidebar'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'

const visible = ref(false)
const store = useStore()
const route = useRoute()
const router = useRouter()

const items = ref([
  {
    label: 'Anasayfa',
    icon: 'pi pi-home',
    command: () => router.push('/'),
  },
  {
    label: 'Kullanıcılar',
    icon: 'pi pi-user',
    command: () => router.push('/users'),
  }
])

const crumbs = ref<{ text: string; route: string }[]>([])

// Breadcrumb’ı route'a göre güncelle
function updateCrumbs() {
  const paths = route.path.split('/').filter(Boolean)
  const routes = paths.map((segment, index) => {
    return {
      text: segment.charAt(0).toUpperCase() + segment.slice(1),
      route: '/' + paths.slice(0, index + 1).join('/'),
    }
  })
  crumbs.value = routes
}

onMounted(() => {
  store.dispatch('dashboard/fetchDashboardData')
  updateCrumbs()
})

watch(() => route.path, updateCrumbs)
</script>

<template>
  <div class="p-4">
    <div class="card m-1 p-1 sm:m-2 sm:p-2 md:m-4 md:p-4 lg:ml-6 lg:mr-6 xl:ml-8 xl:mr-8 xl:p-4 2xl:mr-10 2xl:ml-10 2xl:p-4">
      <Menubar :model="items">
        <template #start>
          <Button icon="pi pi-bars" @click="visible = true" class="mr-2" text />
        </template>
      </Menubar>
    </div>

    <Sidebar v-model:visible="visible" position="left">
      <template #container="{ closeCallback }">
        <div class="flex flex-column h-full">
          <div class="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                <span class="inline-flex align-items-center gap-2">
                    <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="..." fill="var(--primary-color-color)" />
                        <path d="..." fill="var(--text-color)" />
                    </svg>
                    <span class="font-semibold text-2xl text-primary">Sidebar</span>
                </span>
            <span>
                    <Button type="button" @click="closeCallback" icon="pi pi-times" rounded outlined class="h-2rem w-2rem"></Button>
                </span>
          </div>

         <div class="overflow-y-auto">
            <ul class="list-none p-3 m-0">
              <li>
                <router-link
                    to="/"
                    class="no-underline flex items-center cursor-pointer p-3 rounded text-gray-700 hover:bg-gray-100 transition"
                >
                  <i class="pi pi-home mr-2"></i>
                  <span class="font-medium">Dashboard</span>
                </router-link>
              </li>
              <li>
                <router-link
                    to="/users"
                    class="no-underline flex items-center cursor-pointer p-3 rounded text-gray-700 hover:bg-gray-100 transition"
                >
                  <i class="pi pi-user mr-2"></i>
                  <span class="font-medium">Kullanıcılar</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </Sidebar>

    <main class="flex-1 m-1 p-1 sm:m-2 sm:p-2 md:m-4 md:p-4 md:pt-0 lg:mx-6 xl:mx-8 xl:p-4 xl:pt-0 2xl:mx-10 2xl:p-4 2xl:pt-0">
      <div v-if="route.path !== '/home'" class="text-m ml-4 dark:text-white flex gap-2">
        <router-link to="/" class="text-blue-600 hover:underline"><strong>Anasayfa</strong></router-link>
        <span v-for="(crumb, index) in crumbs" :key="index" class="flex items-center gap-2">
          <span>/</span>
          <router-link :to="crumb.route" class="text-blue-600 hover:underline">
            <strong>{{ crumb.text }}</strong>
          </router-link>
        </span>
      </div>

      <router-view />
    </main>
  </div>
</template>
