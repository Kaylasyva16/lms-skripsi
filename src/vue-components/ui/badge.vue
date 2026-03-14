<template>
  <span
    :class="[
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2',
      variantClasses,
      $attrs.class
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
});

const variantClasses = computed(() => {
  const variants = {
    default: 'border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80',
    outline: 'text-gray-950',
    secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80',
    destructive: 'border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80',
  };
  return variants[props.variant];
});
</script>
