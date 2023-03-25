import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import stMoritzImgUrl from '@/assets/imgs/StMoritzKulm.jpg'
import genevaImgUrl from '@/assets/imgs/Geneva.jpg'
import zurichImgUrl from '@/assets/imgs/Zurich.jpg'

export const useMessageStore = defineStore('message', () => {
  const messages = ref([
    { text: '', id: 0, imgUrl: '' },
    {
      text: `The story of using water to produce electricity began 1879 
        when hotelier Johannes Badrutt installed the first  hydroelectric power plant
        generating 7 kW to illuminate the dining hall at the Kulm Hotel in St. Moritz.`,
      id: 1,
      imgUrl: stMoritzImgUrl
    },
    {
      text: `As cities increasingly electrified, new and larger hydroelectric
      power plants were constructed in Swiss rivers, such as the Letten plant
      on the Limmat in Zurich (produced electricity in 1893) 
      and the La Coulouvrenière plant in Geneva (built in 1886).`,
      id: 2,
      imgUrl: zurichImgUrl
    },
    {
      text: `In St. Moritz wurde im Sommer 1879 die erste 
    Gleichstrom-Lichtbogen-Beleuchtungsanlage der 
    Schweiz und das erste kleine Wasserkraftwerk mit 
    7 kW zur Beleuchtung des Speisesaals im Kulm 
    Hotel St. Moritz des Hoteliers Johannes Badrutt 
    in Betrieb genommen.`,
      id: 3,
      imgUrl: ''
    },
    { text: '', id: 4, imgUrl: '' }
  ])

  const selectedMessage = ref(0)

  return { messages, selectedMessage }
})
