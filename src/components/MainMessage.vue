<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div :id="'message-' + message.id" class="pb-[70vh]">
    <p v-if="message.text !== ''" class="max-w-[400px] bg-gray-200 px-[16px] py-[10px]">
      {{ message.text }}
    </p>

    <img v-if="message.imgUrl" :src="message.imgUrl" alt="image" class="max-w-[400px] " />
  </div>
</template>