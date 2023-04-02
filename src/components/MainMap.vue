<script setup>
import * as d3 from 'd3'

import { onMounted, watch } from 'vue'
import { useCentralStore } from '@/stores/central'
import { storeToRefs } from 'pinia'

import { getWidthHeight } from '@/utils/utils'

const centralStore = useCentralStore()

const { messages, selectedMessage } = storeToRefs(centralStore)

var switzerland_cantons_url = 'https://raw.githubusercontent.com/mdturp/qgis/main/cantons3.geojson'
var switzerland_hydro_url = 'https://raw.githubusercontent.com/mdturp/qgis/main/HydroPowerData.csv'

var specialCoordinates = {
  stMoritz: [9.8355, 46.4908],
  geneva: [6.13732, 46.20467],
  zurich: [8.53301, 47.38702],
  sihlsee: [8.7801, 47.137],
  innerthal: [8.921, 47.075],
  grande: [7.3939, 46.0575]
}

if (window.innerWidth > 1024 && window.innerWidth < 1280) {
  var referenceWidth = 768
} else if (window.innerWidth <= 1024) {
  var referenceWidth = 512
} else {
  var referenceWidth = 900
}
const w = Math.min(window.innerWidth, referenceWidth)

const hAddition = w >= 600 ? 0 : 200
const widthRatio = w / 900

const maxNrCircles = w >= 600 ? 1000 : 200
const maxCircleSize = 50 * widthRatio
const circleOpacity = 0.6
const specialCirclesSize = 10 * widthRatio

const maxBarWidth = 400 * widthRatio

var mapTranslations = {
  reset: [0, 0, 1.0],
  stMoritz: [-800 * widthRatio, (-600 + 4 * hAddition) * widthRatio, 4.0],
  cities: [0, 0, 1.0],
  firstDams: [-150 * widthRatio, 20 * widthRatio + 2 * hAddition, 4.0],
  grande: [1100 * widthRatio, -800 * widthRatio + 2 * hAddition, 4.0]
}

function handleZoom(e) {
  d3.select('svg').attr('transform', e.transform)
}
let zoom = d3.zoom().on('zoom', handleZoom)

async function initStory() {
  var hydroData = await d3.csv(switzerland_hydro_url)
  var maxProduction = d3.max(hydroData, function (d) {
    return +d.production
  })

  await d3.json(switzerland_cantons_url).then(async function (data) {
    var rasterSize = await getWidthHeight(centralStore.switzerlandRasterUrl)
    const h = rasterSize['height'] * (w / rasterSize['width'])

    var svg = d3
      .select('#mapContainer')
      .append('svg')
      .attr('id', 'map')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('width', w)
      .attr('height', h + hAddition)
      .classed('svg-content', true)

    const projection = d3.geoMercator().translate([0, 0]).scale(1)
    const path = d3.geoPath().projection(projection)

    const b = path.bounds(data)

    const s = 0.9 / Math.min((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h)
    const t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2]

    projection.scale(s).translate(t)
    hydroData.forEach(function (d) {
      d.projection = projection([d.x, d.y])
    })

    const raster_width = (b[1][0] - b[0][0]) * s
    const raster_height = (b[1][1] - b[0][1]) * s

    const translate_x = (w - raster_width) / 2
    const translate_y = (h - raster_height) / 2
    console.log(centralStore.switzerlandRasterUrl)
    svg
      .append('image')
      .attr('id', 'Raster')
      .attr('xlink:href', centralStore.switzerlandRasterUrl)
      .attr('width', raster_width)
      .attr('height', raster_height)
      .attr('class', 'svg-content')
      .attr('transform', 'translate(' + translate_x + ', ' + translate_y + ')')

    svg
      .append('g')
      .attr('id', 'border')
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
      .data(hydroData.slice(0, maxNrCircles))
      .enter()
      .append('circle')
      .attr('class', 'hydroCircle')
      .attr('fill', '#C69696')
      .attr('opacity', circleOpacity)
      .attr('stroke', '#970D0D')
      .attr('cx', function (d) {
        return projection([d.x, d.y])[0]
      })
      .attr('cy', function (d) {
        return projection([d.x, d.y])[1]
      })
      .attr('r', 0)
      .transition()
      .duration(1000)
      .attr('r', function (d) {
        return (d.production / maxProduction) * maxCircleSize
      })

    for (var key in specialCoordinates) {
      svg
        .append('circle')
        .attr('fill', '#C69696')
        .attr('id', key)
        .attr('opacity', 0.0)
        .attr('stroke', '#970D0D')
        .attr('cx', projection(specialCoordinates[key])[0])
        .attr('cy', projection(specialCoordinates[key])[1])
        .attr('r', 0)
    }
  })
}

function shiftMap(c, addition = [50, 50]) {
  var svg = d3.selectAll('#map')
  svg
    .transition()
    .duration(750)
    .ease(d3.easeSinIn)
    .call(
      zoom.transform,
      d3.zoomIdentity
        .translate(c[0], c[1])
        .scale(c[2])
        .translate(-addition[0] * widthRatio, addition[0] * widthRatio)
    )
}

function resetHydro(op = circleOpacity) {
  d3.selectAll('.hydroCircle').transition().duration(1000).style('opacity', op)
}

function drawSpecialPoint(name) {
  var svg = d3.selectAll('#' + name)
  svg.transition().duration(1000).style('opacity', circleOpacity).attr('r', specialCirclesSize)
}
function resetSpecialPoint(name) {
  var svg = d3.selectAll('#' + name)
  svg.transition().duration(1000).style('opacity', 0).attr('r', 0)
}

async function reorderToBarChart() {
  fadeOutBackground()
  fadeOutBorder()
  moveAndDrawBarChart()
}

async function reorderToMap() {
  fadeInBackground()
  fadeInBorder()
  moveAndDrawMap()
}

function moveAndDrawMap() {
  d3.selectAll('#bars').remove()
  d3.selectAll('#barLabels').remove()

  var circles = d3.selectAll('.hydroCircle')

  // Move the circles to their new positions
  circles
    .transition()
    .duration(1000)
    .attr('cx', function (d) {
      return d.projection[0]
    })
    .attr('cy', function (d) {
      return d.projection[1]
    })
    .style('opacity', circleOpacity)
}

async function fadeOutBackground() {
  var svg = d3.selectAll('#Raster')
  svg.transition().duration(1000).style('opacity', 0.0)
}

async function fadeOutBorder() {
  var svg = d3.selectAll('#border')
  svg.transition().duration(1000).style('opacity', 0.0)
}

async function fadeInBackground() {
  var svg = d3.selectAll('#Raster')
  svg.transition().duration(1000).style('opacity', 1.0)
}

async function fadeInBorder() {
  var svg = d3.selectAll('#border')
  svg.transition().duration(1000).style('opacity', 1.0)
}

function moveAndDrawBarChart() {
  var circles = d3.selectAll('.hydroCircle').data()

  // Sort the circles by size (radius)
  circles.sort(function (a, b) {
    return d3.descending(parseFloat(a.production), parseFloat(b.production))
  })
  var other_production = 0
  for (var i = 10; i < circles.length; i++) {
    other_production += parseFloat(circles[i].production)
  }
  circles = circles.slice(0, 10)
  circles.push({ name: 'All Other', production: other_production })

  var maxProduction = d3.max(circles, function (d) {
    return +parseFloat(d.production)
  })

  var barHeight = 15
  var barPadding = 15
  var bars = d3
    .select('svg')
    .append('g')
    .attr('id', 'bars')
    .selectAll('rect')
    .data(circles)
    .enter()
    .append('rect')
    .attr('y', function (d, i) {
      return i * (barHeight + barPadding) + 100 * widthRatio
    })
    .attr('height', barHeight)
    .style('fill', '#C69696')
    .style('fill-opacity', 1)
    .attr('x', 200 * widthRatio)
    .attr('width', 0)

  d3.selectAll('.hydroCircle')
    .transition()
    .duration(1000)
    .attr('cy', function (d, i) {
      if (i >= 10) {
        i = 10
      }
      return i * (barHeight + barPadding) + barHeight / 2 + 100 * widthRatio
    })
    .attr('cx', function (d) {
      return 200 * widthRatio
    })
    .end()
    .then(function () {
      d3.selectAll('.hydroCircle').transition().duration(500).style('opacity', 0)
      bars
        .transition()
        .duration(500)
        .attr('width', function (d) {
          return (parseFloat(d.production) / maxProduction) * maxBarWidth
        })
      var labels = d3
        .select('svg')
        .append('g')
        .attr('id', 'barLabels')
        .selectAll('text')
        .data(circles)
        .enter()
        .append('text')
        .text(function (d) {
          return d.name + ' (' + Number(d.production).toFixed(2) + ' GWh/a)'
        })
        .attr('y', function (d, i) {
          return i * (barHeight + barPadding) + 100 * widthRatio - 3
        })
        .attr('x', 200 * widthRatio)
        .attr('font-size', '12px')
        .attr('fill', 'black')
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .attr('opacity', 1)
    })
}

onMounted(async () => {
  await initStory()
})

watch(selectedMessage, (newId, oldId) => {
  if (newId === 0 && oldId === 1) {
    resetSpecialPoint('stMoritz')
    shiftMap(mapTranslations.reset, [0, 0])
    resetHydro()
  } else if (newId === 1 && oldId === 0) {
    resetHydro(0.0)
    shiftMap(mapTranslations.stMoritz)
    drawSpecialPoint('stMoritz')
  } else if (newId === 1 && oldId === 2) {
    resetSpecialPoint('geneva')
    resetSpecialPoint('zurich')
    shiftMap(mapTranslations.stMoritz)
    drawSpecialPoint('stMoritz')
  } else if (newId === 2 && oldId === 1) {
    resetSpecialPoint('stMoritz')
    shiftMap(mapTranslations.cities, [0, 0])
    drawSpecialPoint('geneva')
    drawSpecialPoint('zurich')
  } else if (newId === 2 && oldId === 3) {
    resetSpecialPoint('sihlsee')
    resetSpecialPoint('innerthal')
    shiftMap(mapTranslations.cities, [0, 0])
    drawSpecialPoint('geneva')
    drawSpecialPoint('zurich')
  } else if (newId === 3 && oldId === 2) {
    resetSpecialPoint('geneva')
    resetSpecialPoint('zurich')
    shiftMap(mapTranslations.firstDams)
    drawSpecialPoint('sihlsee')
    drawSpecialPoint('innerthal')
  } else if (newId === 3 && oldId === 4) {
    resetSpecialPoint('grande')
    shiftMap(mapTranslations.firstDams)
    drawSpecialPoint('sihlsee')
    drawSpecialPoint('innerthal')
  } else if (newId === 4 && oldId === 3) {
    resetSpecialPoint('sihlsee')
    resetSpecialPoint('innerthal')
    shiftMap(mapTranslations.grande)
    drawSpecialPoint('grande')
  } else if (newId === 4 && oldId === 5) {
    resetHydro(0.0)
    shiftMap(mapTranslations.grande)
    drawSpecialPoint('grande')
  } else if (newId === 5 && oldId === 4) {
    resetSpecialPoint('grande')
    shiftMap(mapTranslations.reset, [0, 0])
    resetHydro()
  } else if (newId === 5 && oldId === 6) {
    reorderToMap()
  } else if (newId === 6) {
    reorderToBarChart()
  }
})
</script>

<template>
  <div id="mapContainer"></div>
</template>

<style scoped>
.svg-content {
  background-color: #ecf3f4;
}

#mapContainer {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
}
#mapContainer::-webkit-scrollbar {
  display: none;
}
</style>