<script setup>
import { computed, onMounted, ref, nextTick } from 'vue'

// const timeLine = ref(null)

// const data = ref([
//   { eventId: '0', date: '01/01/1920', displayText: 'Jan 1920' },
//   { eventId: '1', date: '01/01/2017', displayText: 'Jan 2017' },
//   { eventId: '2', date: '01/09/2017', displayText: 'Sep 2017' },
//   { eventId: '3', date: '01/12/2017', displayText: 'Dec 2017' },
//   { eventId: '4', date: '01/03/2018', displayText: 'Mar 2018' }
// ])

// function parseDate(date) {
//   const [month, day, year] = date.split('/')
//   return new Date(year, month - 1, day)
// }

// const offsetLeft = async () => {return await nextTick(() => {return timeLine.value.offsetLeft})}
// const offsetWidth = async () => {return await nextTick(() => {return timeLine.value.offsetWidth})}

// onMounted(() => {
//   console.log(offsetLeft())
//   console.log(offsetWidth())
// })


// const positionsEvents = computed(async () => {
//     const firstDate = parseDate(data.value[0].date)
//     const lastDate = parseDate(data.value[data.value.length - 1].date)
    
//     const timeLineLength = await offsetWidth()
//     const timeLineStart = await offsetLeft()
//     const timeLineDuration = lastDate - firstDate
//     console.log(timeLineLength, timeLineStart, timeLineDuration)
//     const positions = data.value.map((item) => {
//       const date = parseDate(item.date)
//       const timeLinePosition = (date - firstDate) / timeLineDuration
//       const position = timeLineStart + timeLinePosition * timeLineLength
//       return position
//     })
//     console.log(positions)
//     return positions;
//     })

</script>

<template>
    <span id="timeLine"  ref="timeLine" class="timeLine"/>
    <!-- <div class="red-dot" v-for="item in data" :key="item.eventId"/> -->
</template>

<style scoped>
.timeLine {
  position: sticky;
  top: 0px;
  height: 80px;
  background: white;
  display: block;
  border-bottom: 2px solid black;
  margin-bottom: 20px;
}

.red-dot {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  position: relative;
  top: -5px;

}
</style>