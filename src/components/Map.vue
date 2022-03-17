<template>
  <div id="map"  style="width: 600px; height: 400px;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

onMounted(() => {
  
  var map = L.map('map').setView([50.966819, -114.068019], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let circle1 = null;
let point1 = null;
let circle2 = null;
let point2 = null;

function onMapClick(e) {
  
  console.log("Circle 1: " + circle1);
  console.log("Circle 2: " + circle2);

  if(circle1 == null)
  {
    point1 = e.latlng
    circle1 = L.circle(point1, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 10
    }).bindTooltip("My Label", {permanent: true, className: "my-label", offset: [0, 0] }).addTo(map);
  }
  else if(circle2 == null)
  {
    point2 = e.latlng;
    circle2 =  L.circle(point2, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 10
    }).bindTooltip("My Label", {permanent: true, className: "my-label", offset: [0, 0] }).addTo(map);
   
    var polyLine = new L.Polyline([point1, point2], {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    }); 
    polyLine.addTo(map);
  }
} 

map.on('click', onMapClick);

})

</script>

<script>
export default {

  name: 'HelloWorld',
  props: {
    msg: String
  },

  methods: {
    
    async button_click(){
     const filePath = await window.electronAPI.openFile()
      console.log("hello: " + filePath);
    }

  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
