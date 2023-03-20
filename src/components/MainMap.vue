<script setup>
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import * as turf from '@turf/turf'

import { onMounted, watch } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { storeToRefs } from 'pinia'

const messagesStore = useMessageStore()

const { messages, selectedMessage } = storeToRefs(messagesStore)

watch(selectedMessage, (newSelectedMessage, oldSelectedMessage) => {
  console.log('newMessages', newSelectedMessage)
  console.log('oldMessages', oldSelectedMessage)

  if (newSelectedMessage === 1) {
    translateMap()
  }
  if (newSelectedMessage === 0) {
    resetMap()
  }
})
var switzerland_raster_url = 'https://github.com/mdturp/qgis/raw/main/switzerland3.png'
var switzerland_cantons_url = 'https://raw.githubusercontent.com/mdturp/qgis/main/cantons3.geojson'
var switzerland_hydro_url = 'https://raw.githubusercontent.com/mdturp/qgis/main/HydroPowerData.csv'

const maxsize = 20
const topHydroCount = 100

async function draw_switzerland() {
  var hydroData = await d3.csv(switzerland_hydro_url)
  var maxProduction = d3.max(hydroData, function (d) {
    return +d.production
  })

  await d3.json(switzerland_cantons_url).then(function (data) {
    const w_orig = 2525
    const h_orig = 1619

    const w = 900
    const h = h_orig * (w / w_orig)

    var svg = d3
      .select('#mapContainer')
      .append('svg')
      .attr('id', 'map')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('width', w)
      .attr('height', h)
      .classed('svg-content', true)

    const projection = d3.geoMercator().translate([0, 0]).scale(1)
    const path = d3.geoPath().projection(projection)

    const b = path.bounds(data)

    const s = 0.9 / Math.min((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h)

    // transform
    const t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2]

    projection.scale(s).translate(t)

    const raster_width = (b[1][0] - b[0][0]) * s
    const raster_height = (b[1][1] - b[0][1]) * s

    const rtranslate_x = (w - raster_width) / 2
    const rtranslate_y = (h - raster_height) / 2

    svg
      .append('image')
      .attr('id', 'Raster')
      .attr('xlink:href', switzerland_raster_url)
      .attr('width', raster_width)
      .attr('height', raster_height)
      .attr('class', 'svg-content')
      .attr('transform', 'translate(' + rtranslate_x + ', ' + rtranslate_y + ')')

    svg
      .selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('fill', 'none')

      .attr('stroke', '#434141')
      .attr('stroke-width', 0.1)
      .attr('d', path)

    svg
      .selectAll('circle')
      .data(hydroData.slice(0, topHydroCount))
      .enter()
      .append('circle')
      .attr('fill', '#C69696')
      .attr('opacity', 0.6)
      .attr('stroke', '#970D0D')
      .attr('cx', function (d) {
        console.log(d.x, d.y)
        return projection([d.x, d.y])[0]
      })
      .attr('cy', function (d) {
        return projection([d.x, d.y])[1]
      })
      .attr('r', function (d) {return maxsize*(d.production/maxProduction)})
  })
}

// Select svg element and add zoom event on click.

let zoom = d3.zoom().on('zoom', handleZoom)

function handleZoom(e) {
  d3.select('svg').attr('transform', e.transform)
}

function translateMap() {
  var svg = d3.selectAll('#map')
  svg
    .transition()
    .duration(750)
    .ease(d3.easeSinIn)
    .call(zoom.transform, d3.zoomIdentity.translate(-50, 100).scale(3.0).translate(-50, 50))
}

function resetMap() {
  var svg = d3.selectAll('#map')
  svg
    .transition()
    .duration(750)
    .ease(d3.easeSinIn)
    .call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1.0))
}

const loadImage = (path) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    // img.crossOrigin = 'Anonymous' // to avoid CORS if used with Canvas
    img.src = path
    img.onload = () => {
      resolve(img)
    }
    img.onerror = (e) => {
      reject(e)
    }
  })
}

onMounted(async () => {
  await loadImage(switzerland_raster_url)
  await draw_switzerland()
})
</script>

<template>
  <div class="overflow-visible" id="mapContainer"></div>
</template>

<style scoped>
.continent {
  fill: #ecf3f4;
  stroke: #434141;
  stroke-width: 0.01;
  border-radius: 25px;
}
.svg-content {
  background-color: #ecf3f4;
}

</style>