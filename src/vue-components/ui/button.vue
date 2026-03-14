<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variantClasses,
      sizeClasses,
      $attrs.class
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  type: 'button',
  disabled: false
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const variantClasses = computed(() => {
  const variants = {
    default: 'bg-gray-900 text-gray-50 hover:bg-gray-900/90',
    outline: 'border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    destructive: 'bg-red-500 text-gray-50 hover:bg-red-500/90',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-100/80',
    link: 'text-gray-900 underline-offset-4 hover:underline',
  };
  return variants[props.variant];
});

const sizeClasses = computed(() => {
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };
  return sizes[props.size];
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>
