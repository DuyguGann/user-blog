<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { FilterMatchMode } from '@primevue/core/api'

const store = useStore()
const router = useRouter()

const users = computed(() => store.getters['users/getUsers'])
const isLoading = computed(() => store.getters['users/isLoading'])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'address.city': { value: null, matchMode: FilterMatchMode.CONTAINS },
})

onMounted(() => {
  store.dispatch('users/fetchUsers')
})

const goToDetail = (userId: number) => {
  router.push(`/users/${userId}`)
}
</script>
<style scoped>
.p-datatable .p-datatable-tbody > tr > td {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 1rem;
  padding: 1rem;
}
</style>

<template>
  <div class=" mx-auto">
    <div class="">
      <div class="block md:hidden mb-4">
          <span class="p-input-icon-left w-full">
               <InputText v-model="filters.global.value" placeholder="Genel arama..." class="w-full"/>
          </span>
      </div>
      <DataTable
          v-model:filters="filters"
          :value="users"
          paginator
          :rows="6"
          dataKey="id"
          filterDisplay="row"
          :loading="isLoading"
          :globalFilterFields="['name', 'email', 'address.city']"
          responsiveLayout="stack"
      breakpoint="960px"
      >

      <template #loading> Kullanıcılar yükleniyor... </template>

        <Column field="name" header="Ad" style="min-width: 12rem; hover-text:red ">
          <template #body="{ data }">
    <span
        @click="goToDetail(data.id)"
        class="cursor-pointer text-blue-600 hover:bg-gray-500 hover:text-red  px-2 py-1 rounded inline-block transition-colors duration-200"
    >
      {{ data.name }}
    </span>
          </template>

          <template #filter="{ filterModel, filterCallback }">
            <InputText
                v-model="filterModel.value"
                type="text"
                @input="filterCallback()"
                placeholder="Ada göre ara"
            />
          </template>
        </Column>

        <Column field="email" header="E-Posta" style="min-width: 14rem">
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                  v-model="filterModel.value"
                  type="text"
                  @input="filterCallback()"
                  placeholder="E-posta ara"
              />
            </template>
          </Column>

          <Column header="Şehir" :field="'address.city'" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.address.city }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                  v-model="filterModel.value"
                  type="text"
                  @input="filterCallback()"
                  placeholder="Şehre göre ara"
              />
            </template>
          </Column>

          <Column header="İşlem" style="min-width: 8rem">
            <template #body="{ data }">
              <Button
                  label="Detay"
                  icon="pi pi-user"
                  class="p-button-sm"
                  @click="goToDetail(data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
</template>


