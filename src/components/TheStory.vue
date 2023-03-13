<script setup>
import MainHeader from '@/components/MainHeader.vue'
import MainTimeline from '@/components/MainTimeline.vue'
import MainMessage from '@/components/MainMessage.vue'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, ref } from 'vue'

// const timeLineFixed = ref(false)

// onMounted(() => {
//   gsap.registerPlugin(ScrollTrigger)

//   ScrollTrigger.create({
//     trigger: '#MyContainer',
//     start: 'top 200px',
//     end: 'bottom 250px',
//     endTrigger: '#timeLine',
//     markers: { startColor: 'black', endColor: 'black' },
//     scrub: true,
//     onEnter: () => logRed('onEnter'),
//     onLeave: () => fixLine('onLeave'),
//     onEnterBack: () => fixLine('onLeave'),
//     onLeaveBack: () => logRed('onLeaveBack'),
//     onRefresh: () => logRed('onRefresh')
//     //   onUpdate: (self) => rollCircleRoll(self.progress.toFixed(2))
//   })
// })

function logRed(m) {
  console.log(m)
}

function fixLine(m) {
    console.log(m)
    timeLineFixed.value = !timeLineFixed.value

}
</script>

<template>
  <div id="parentContainer" class="relative font-serif mx-auto max-w-2xl">
    <MainHeader />
    <MainTimeline/>
    <MainMessage />
    <MainMessage />
  </div>
</template>
