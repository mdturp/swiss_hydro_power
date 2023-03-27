import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import stMoritzImgUrl from '@/assets/imgs/StMoritzKulm.jpg'
import genevaImgUrl from '@/assets/imgs/Geneva.jpg'
import zurichImgUrl from '@/assets/imgs/Zurich.jpg'
import innerthalOldImgUrl from '@/assets/imgs/Innerthal_old.jpg'
import innerthalNewImgUrl from '@/assets/imgs/Innerthal_new.jpg'

export const useMessageStore = defineStore('message', () => {
  const messages = ref([
    { text: '', id: 0, imgUrl: [] },
    {
      text: `The story of using water to produce electricity began 1879 
        when hotelier Johannes Badrutt installed the first  hydroelectric power plant
        generating 7 kW to illuminate the dining hall at the Kulm Hotel in St. Moritz.`,
      id: 1,
      imgUrl: [stMoritzImgUrl]
    },
    {
      text: `As cities increasingly electrified, new and larger hydroelectric
      power plants were constructed in Swiss rivers, such as the Letten plant
      on the Limmat in Zurich (produced electricity in 1893) 
      and the La Coulouvrenière plant in Geneva (built in 1886).`,
      id: 2,
      imgUrl: [zurichImgUrl, genevaImgUrl]
    },
    {
      text: `In 1916, Switzerland enacted the federal law on the utilization of 
    water resources, leading to the construction of larger dams and the 
    subsequent flooding of settlements and small villages. As a result, 
    lakes such as Sihlsee and Wägitalersee were formed. The development 
    necessitated the relocation of several villages, with Willerzell and
    Innerthal serving as notable examples.`,
      id: 3,
      imgUrl: [innerthalOldImgUrl, innerthalNewImgUrl]
    },
    {
      text: ``,
      id: 4,
      imgUrl: ''
    }
  ])

  const selectedMessage = ref(0)

  return { messages, selectedMessage }
})
