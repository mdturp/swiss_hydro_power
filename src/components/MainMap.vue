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

async function draw_switzerland() {
  //   var switzerland_url =
  //     'https://gist.githubusercontent.com/mdturp/1f18119dbf08c2abe2592ef67df153da/raw/93dd0939115b7eb97b4c0ff1daec892bdd65fb5e/switzerland_and_cantons.topojson'
  // var switzerland_url = 'https://gist.githubusercontent.com/mdturp/5c24a29c7bdd3b8952ca12077d09db7a/raw/bfb63abb1c525eff02f6cabbf9d1670e225a4aeb/landesgebiet.topojson';
  // Use the topojson url to create a map using d3.
  var switzerland_url =
    'https://gist.githubusercontent.com/mdturp/022135d5cb1647d6f9b26943f6b20f15/raw/d61234c441b71fff755f8f5763d369b4c845e958/borders.geojson'
  await d3.json(switzerland_url).then(function (data) {
    // var switzerland = topojson.feature(data, data.objects.object_name)

    var fixed = data.features.map(function (f) {
      return turf.rewind(f, { reverse: true })
    })
    // var fixed = data;

    // Create a projection.
    var startProjection = d3.geoMercator().translate([0, 0]).scale(1)
    // .scale(5500).translate([-500, 5400])
    // var endProjection = d3.geoMercator().scale(9900).translate([-1300, 9400])

    // Create a path generator.
    var path = d3.geoPath().projection(startProjection)
    var w = 1000 / 2
    var h = 1000 / 2

    const b = path.bounds(data)
    console.log(b)
    // scale
    const s = 1 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h)

    // transform
    const t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2]

    console.log(s, t)

    var imgURL =
      'https://raw.githubusercontent.com/mdturp/solar_roof_detection/main/clipped_hillshade.png'

    // Create a svg element with black borders.
    var svg = d3
      .select('#mapContainer')
      .append('svg')
      .attr('id', 'map')
      .attr('width', w)
      .attr('height', h)
      .style('border', '1px solid black')
    startProjection.scale(s).translate(t)

    var imageGroup = svg.append('g')

    const raster_width = (b[1][0] - b[0][0]) * s
    const raster_height = (b[1][1] - b[0][1]) * s

    const rtranslate_x = (w - raster_width) / 2
    const rtranslate_y = (h - raster_height) / 2

    // Append the image to the image group
    imageGroup
      .append('image')
      .attr('xlink:href', imgURL)
      .attr('width', raster_width)
      .attr('height', raster_height)
      .attr('transform', 'translate(' + rtranslate_x + ', ' + rtranslate_y + ')')

    // Create a group for the paths
    var pathGroup = svg.append('g')

    // Draw the paths in the path group
    pathGroup
      .selectAll('path')
      .data(fixed)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#ECD8D8')
      .style('stroke', '#998D8D')
      .style('')
      .attr('opacity', 0.3)

    // var svg = d3
    //   .select('#mapContainer')
    //   .append('svg')
    //   .attr('id', 'map')
    //   .attr('width', 600)
    //   .attr('height', 600)
    //   .append("image")
    //   .attr("xlink:href", imgURL)
    //   .attr('width', 600)
    //   .attr('height', 600)
    //   .style('border', '1px solid black')

    // // Draw the path
    // svg
    //   .selectAll('path')
    //   .data(fixed)
    //   .enter()
    //   .append('path')
    //   .attr('d', path)
    //   .attr('fill', '#ECD8D8')
    //   .style('stroke', '#998D8D')
    //   .on('click', clicked)

    // function clicked(event, d) {
    //   const [[x0, y0], [x1, y1]] = path.bounds(d)
    //   event.stopPropagation()
    //   d3.select(this).transition().style('fill', 'red')
    //   svg.transition().duration(750).attr(
    //     'transform',
    //     `translate(${svg.attr('width') / 2},${svg.attr('height') / 2})`)
    // }
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

onMounted(async () => {
  await draw_switzerland()
})
</script>

<template>
  <div class="overflow-visible" id="mapContainer"></div>
</template>