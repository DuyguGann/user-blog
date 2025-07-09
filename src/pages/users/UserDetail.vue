<script lang="ts" setup>
import 'primeflex/primeflex.css';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { computed, onMounted, watch, ref } from 'vue';
import router from "@/router";
import Card from 'primevue/card';
import Button from 'primevue/button';

const route = useRoute();
const store = useStore();
const userId = Number(route.params.id);

const lat = ref(41.015137);
const lng = ref(28.979530);

onMounted(() => store.dispatch('users/fetchUserDetail', userId));

const user = computed(() => store.getters['users/getUser']);
const isLoading = computed(() => store.state.users.isLoading);
const error = computed(() => store.state.users.error);

watch(user, (u) => {
  if (u?.address?.geo) {
    lat.value = Number(u.address.geo.lat);
    lng.value = Number(u.address.geo.lng);
  }
});

const goToGallery = () => router.push(`/users/${userId}/gallery`);
const gotoPost = () => router.push(`/users/${userId}/post`);
const gotoTodo = () => router.push(`/users/${userId}/todo`);
</script>

<template>
  <div class="min-h-screen surface-ground p-4 md:p-10">
    <div v-if="isLoading" class="flex justify-content-center align-items-center min-h-6rem">
      <i class="pi pi-spin pi-spinner text-4xl"/>
    </div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-if="user" class="grid">
      <div class="col-12 md:col-6">
        <Card class="mb-3">
          <template #title>
            <div class="flex align-items-center gap-2 text-lg font-bold text-gray-800">
              <i class="pi pi-user text-blue-500"></i>
              Kişisel Bilgiler
            </div>
          </template>
          <template #content>
            <ul class="list-none p-0 m-0">
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-id-card text-blue-400"></i>
                <strong>Ad Soyad:</strong> {{ user.name }}
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-at text-blue-400"></i>
                <strong>Kullanıcı Adı:</strong> {{ user.username }}
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-envelope text-blue-400"></i>
                <strong>E-Posta:</strong> {{ user.email }}
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-phone text-blue-400"></i>
                <strong>Telefon:</strong> {{ user.phone }}
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-globe text-blue-400"></i>
                <strong>Website:</strong> {{ user.website }}
              </li>
            </ul>
          </template>
        </Card>

        <Card class="mb-3">
          <template #title>
            <div class="flex align-items-center gap-2 text-lg font-bold text-gray-800">
              <i class="pi pi-building text-purple-500"></i>
              Şirket Bilgileri
            </div>
          </template>
          <template #content>
            <ul class="list-none p-0 m-0">
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-building text-purple-400"></i>
                <strong>Şirket:</strong> {{ user.company?.name }}
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-quote-right text-purple-400"></i>
                <strong>Slogan:</strong> {{ user.company?.catchPhrase }}
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-briefcase text-purple-400"></i>
                <strong>Alan:</strong> {{ user.company?.bs }}
              </li>
            </ul>
          </template>
        </Card>

        <Card class="mb-3">
          <template #title>
            <div class="flex align-items-center gap-2 text-lg font-bold text-gray-800">
              <i class="pi pi-map-marker text-green-500"></i>
              Adres Bilgileri
            </div>
          </template>
          <template #content>
            <ul class="list-none p-0 m-0">
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-map-marker text-green-400"></i>
                <strong>Sokak:</strong> {{ user.address?.street }}
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-home text-green-400"></i>
                <strong>Bina:</strong> {{ user.address?.suite }}
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-map text-green-400"></i>
                <strong>Şehir:</strong> {{ user.address?.city }}
              </li>
              <li class="mb-2 flex align-items-center gap-2">
                <i class="pi pi-inbox text-green-400"></i>
                <strong>Posta Kodu:</strong> {{ user.address?.zipcode }}
              </li>
            </ul>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6">
        <Card class="mb-3">
          <template #title>
            <div class="flex align-items-center gap-2 text-lg font-bold text-gray-800">
              <i class="pi pi-map text-red-500"></i>
              Konum
            </div>
          </template>
          <template #content>
            <iframe
                :src="`https://www.google.com/maps?q=${lat},${lng}&hl=tr&z=14&output=embed`"
                class="w-full h-20rem border-1 border-300 border-round"
                loading="lazy"
            ></iframe>
          </template>
        </Card>

        <Card>
          <template #title>
            <div class="flex align-items-center gap-2 text-lg font-bold text-gray-800">
              <i class="pi pi-bolt text-yellow-500"></i>
              Hızlı Erişim
            </div>
          </template>
          <template #content>
            <div class="flex flex-column sm:flex-row gap-2">
              <Button label="Fotoğraf Galerisi" icon="pi pi-images" class="p-button-info w-full sm:w-auto" @click="goToGallery" />
              <Button label="Gönderilerim" icon="pi pi-send" class="p-button-success w-full sm:w-auto" @click="gotoPost" />
              <Button label="Görevlerim" icon="pi pi-check-square" class="p-button-warning w-full sm:w-auto" @click="gotoTodo" />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
