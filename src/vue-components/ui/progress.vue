<template>
  <div class="relative h-4 w-full overflow-hidden rounded-full bg-gray-100">
    <div
      class="h-full w-full flex-1 bg-[#2b7fff] transition-all"
      :style="{ transform: `translateX(-${100 - (value || 0)}%)` }"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  value?: number;
}

withDefaults(defineProps<Props>(), {
  value: 0
});
</script>
