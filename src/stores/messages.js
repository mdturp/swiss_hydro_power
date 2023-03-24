import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', () => {
  const messages = ref(
    [
    { 'text': '', 'id': 0 },
    {'text': `In St. Moritz wurde im Sommer 1879 die erste 
    Gleichstrom-Lichtbogen-Beleuchtungsanlage der 
    Schweiz und das erste kleine Wasserkraftwerk mit 
    7 kW zur Beleuchtung des Speisesaals im Kulm 
    Hotel St. Moritz des Hoteliers Johannes Badrutt 
    in Betrieb genommen.`,
    'id': 1 },
    {'text':`In St. Moritz wurde im Sommer 1879 die erste 
    Gleichstrom-Lichtbogen-Beleuchtungsanlage der 
    Schweiz und das erste kleine Wasserkraftwerk mit 
    7 kW zur Beleuchtung des Speisesaals im Kulm 
    Hotel St. Moritz des Hoteliers Johannes Badrutt 
    in Betrieb genommen.`,
    'id': 2 },
    {'text':`In St. Moritz wurde im Sommer 1879 die erste 
    Gleichstrom-Lichtbogen-Beleuchtungsanlage der 
    Schweiz und das erste kleine Wasserkraftwerk mit 
    7 kW zur Beleuchtung des Speisesaals im Kulm 
    Hotel St. Moritz des Hoteliers Johannes Badrutt 
    in Betrieb genommen.`,
    'id': 3 },
    {'text':'', 'id': 4 },
  ])

  const selectedMessage = ref(0)

  return { messages, selectedMessage }
})
