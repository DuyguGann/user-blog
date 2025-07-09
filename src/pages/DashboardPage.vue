<script lang="ts">
import { defineComponent } from 'vue'
import Card from 'primevue/card'

export default defineComponent({
  name: "DashboardPage",
  components: { Card }
})
</script>

<template>
  <div class="flex items-center justify-center max-h-screen bg-gray-100 p-4">
    <Card class="w-full max-w-4xl text-center shadow-md">
      <template #title>
        <h1 class="text-2xl font-bold">Homepage</h1>
      </template>
    </Card>
  </div>
</template>

<style scoped lang="scss">
</style>
