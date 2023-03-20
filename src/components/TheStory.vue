<script setup>
import MainHeader from '@/components/MainHeader.vue'
import MainTimeline from '@/components/MainTimeline.vue'
import MainMessage from '@/components/MainMessage.vue'
import MainMap from '@/components/MainMap.vue'
import { useMessageStore } from '@/stores/messages'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { onMounted, ref } from 'vue'

const messagesStore = useMessageStore()

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  ScrollTrigger.create({
    trigger: '#message-1',
    start: 'top 250px',
    end: 'bottom 350px',
    markers: { startColor: 'black', endColor: 'black' },
    scrub: true,
    onEnter: () => transform('onEnter'),
    onLeaveBack: () => transform('onLeaveBack')
    //   onUpdate: (self) => rollCircleRoll(self.progress.toFixed(2))
  })
})

function transform(m) {
  if (m === 'onEnter') {
    messagesStore.selectedMessage = 1
  } else if (m === 'onLeaveBack') {
    messagesStore.selectedMessage = 0
  }
}
</script>

<template>
  <div id="parentContainer" class="relative font-serif mx-auto max-w-lg lg:max-w-3xl xl:max-w-4xl">
    <MainHeader />
    <MainTimeline class="z-30" />
    <MainMap class="sticky z-10 top-20" />
    <MainMessage
      class="relative z-20"
      v-for="m in messagesStore.messages"
      :message="m"
      :key="m.id"
    />
  </div>
</template>
