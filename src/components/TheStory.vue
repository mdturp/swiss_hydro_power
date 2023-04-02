<script setup>
import MainHeader from '@/components/MainHeader.vue'
import MainTimeline from '@/components/MainTimeline.vue'
import MainMessage from '@/components/MainMessage.vue'
import MainMap from '@/components/MainMap.vue'
import MainFooter from '@/components/MainFooter.vue'
import { useCentralStore } from '@/stores/central'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { onMounted, ref } from 'vue'

const centralStore = useCentralStore()
const imageLoaded = ref(false)

onMounted(async () => {
  window.scrollTo(0, 0)

  await loadImage(centralStore.switzerlandRasterUrl)
  imageLoaded.value = true

  gsap.registerPlugin(ScrollTrigger)

  ScrollTrigger.create({
    trigger: '#message-1',
    start: 'top 500px',
    end: 'bottom 750px',
    markers: { startColor: 'black', endColor: 'black' },
    scrub: true,
    onEnter: () => transform('onEnter', 1),
    onLeaveBack: () => transform('onLeaveBack', 0)
  })
  ScrollTrigger.create({
    trigger: '#message-2',
    start: 'top 500px',
    end: 'bottom 750px',
    markers: { startColor: 'black', endColor: 'black' },
    scrub: true,
    onEnter: () => transform('onEnter', 2),
    onLeaveBack: () => transform('onLeaveBack', 1)
  })
  ScrollTrigger.create({
    trigger: '#message-3',
    start: 'top 500px',
    end: 'bottom 750px',
    markers: { startColor: 'black', endColor: 'black' },
    scrub: true,
    onEnter: () => transform('onEnter', 3),
    onLeaveBack: () => transform('onLeaveBack', 2)
  })

  ScrollTrigger.create({
    trigger: '#message-4',
    start: 'top 500px',
    end: 'bottom 750px',
    markers: { startColor: 'black', endColor: 'black' },
    scrub: true,
    onEnter: () => transform('onEnter', 4),
    onLeaveBack: () => transform('onLeaveBack', 3)
  })

  ScrollTrigger.create({
    trigger: '#message-5',
    start: 'top 500px',
    end: 'bottom 750px',
    markers: { startColor: 'black', endColor: 'black' },
    scrub: true,
    onEnter: () => transform('onEnter', 5),
    onLeaveBack: () => transform('onLeaveBack', 4)
  })

  ScrollTrigger.create({
    trigger: '#message-6',
    start: 'top 500px',
    end: 'bottom 750px',
    markers: { startColor: 'black', endColor: 'black' },
    scrub: true,
    onEnter: () => transform('onEnter', 6),
    onLeaveBack: () => transform('onLeaveBack', 5)
  })
})

function transform(m, message) {
  if (m === 'onEnter') {
    centralStore.selectedMessage = message
  } else if (m === 'onLeaveBack') {
    centralStore.selectedMessage = message
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = (error) => reject(error)
  })
}
</script>

<template>
  <div v-show="imageLoaded">
    <div
      id="parentContainer"
      class="relative font-serif mx-auto max-w-lg lg:max-w-3xl xl:max-w-4xl"
    >
      <MainHeader />
      <MainTimeline class="z-30" />
      <MainMap class="sticky z-10 pt-20 top-0 overflow-y-auto sm:overflow-visible" />
      <MainMessage
        class="relative z-20"
        v-for="m in centralStore.messages"
        :message="m"
        :key="m.id"
      />
    </div>
    <p class="font-serif mx-auto max-w-lg lg:max-w-xl xl:max-w-2xl p-5">
      Today ~57% of all electricity produced in Switzerland comes from hydropower. Of this, 48.3% is
      produced in run-of-river power plants, 47.5% in storage power plants, and approximately 4.2%
      in pumped storage power plants. The mountainous cantons of Uri, Grisons, Ticino, and Valais
      are responsible for around 63% of the total hydroelectricity produced. Despite the success of
      the Swiss hydropower, challenges remain. Climate change and its impact on water availability
      pose a significant threat to the sector. In recent years, the country has experienced lower
      water levels in rivers and receding glaciers, which has affected hydropower generation. To
      address these challenges, Switzerland is investing in research and development to improve the
      efficiency of its hydropower infrastructure and explore new technologies.
    </p>
    <div class="pb-[30vh]"></div>
    <MainFooter></MainFooter>
  </div>
</template>
