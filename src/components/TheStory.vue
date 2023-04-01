<script setup>
import MainHeader from '@/components/MainHeader.vue'
import MainTimeline from '@/components/MainTimeline.vue'
import MainMessage from '@/components/MainMessage.vue'
import MainMap from '@/components/MainMap.vue'
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
  ScrollTrigger.create({
    trigger: '#message-7',
    start: 'top 500px',
    end: 'bottom 750px',
    markers: { startColor: 'black', endColor: 'black' },
    scrub: true,
    onEnter: () => transform('onEnter', 7),
    onLeaveBack: () => transform('onLeaveBack', 6)
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
    <div id="parentContainer"
      class="relative font-serif mx-auto max-w-lg lg:max-w-3xl xl:max-w-4xl"
    >
      <MainHeader />
      <MainTimeline class="z-30" />
      <MainMap class="sticky z-10 top-20" />
      <MainMessage
        class="relative z-20"
        v-for="m in centralStore.messages"
        :message="m"
        :key="m.id"
      />
    </div>
    <p class="font-serif mx-auto max-w-lg lg:max-w-xl xl:max-w-2xl">
      A common need for data binding is manipulating an element's class list and inline styles.
      Since class and style are both attributes, we can use v-bind to assign them a string value
      dynamically, much like with other attributes. However, trying to generate those values using
      string concatenation can be annoying and error-prone. For this reason, Vue provides special
      enhancements when v-bind is used with class and style. In addition to strings, the expressions
      can also evaluate to objects or arrays. A common need for data binding is manipulating an
      element's class list and inline styles. Since class and style are both attributes, we can use
      v-bind to assign them a string value dynamically, much like with other attributes. However,
      trying to generate those values using string concatenation can be annoying and error-prone.
      For this reason, Vue provides special enhancements when v-bind is used with class and style.
      In addition to strings, the expressions can also evaluate to objects or arrays.
    </p>
    <div class="pb-[90vh]"></div>
  </div>
</template>
