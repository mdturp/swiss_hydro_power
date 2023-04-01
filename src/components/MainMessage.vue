<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div :id="'message-' + message.id" class="max-w-[400px] pb-[70vh]">
    <p v-if="message.text !== ''" class=" bg-gray-200 px-[16px] py-[10px]">
      {{ message.text }}
    </p>
    <img v-for="m in message.imgUrl" :src="m" alt="image"  :key="m" />
  </div>
</template>