<template>
  <router-view v-slot="{ Component }">
    <Suspense>
      <div>
        <component
          :is="Component"
        />
      </div>
      <template #fallback>
        正在加载...
      </template>
    </Suspense>
  </router-view>
</template>
<script lang="ts" setup>
</script>

