<template>
  <div id="map"  style="width: 600px; height: 400px;"></div>
</template>

<script>

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {

  name: 'VueMap',
  props: {
    route: Array
  },

  data(){
    return {
      circles: [],
      map: null
    }
  },

  methods: {
    
    onMapClick(e){
      console.log("Clicked:" + e.latlng);
      this.drawPoints();
    },

    /* 
      Draws the complete
      set of points from the props.
      Draws a circle for one point and line segments for two or more points.
    */
    drawPoints(){
    
      if(this.map == null)
        return null;

      for(let i = 0; i < this.route.length; i++){
        const p = this.route[i];
        const circle = this.createCircle(L.latLng(p.lat, p.lng));
        circle.addTo(this.map);
        this.circles.push(circle);
      }

    },

    /**
     * Creates an unselected
     * circle with the default colors.
     * point - is the point LatLng in leaflet at which the circle will exist. Needs to be 
     * in the leaflet type.
     */
    createCircle(point){
      return   L.circle(point, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 10
              });
    }
  },


 

  mounted(){
     this.map = L.map('map').setView([50.966819, -114.068019], 13);
     this.map.on('click', this.onMapClick);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.drawPoints();

/*let circle1 = null;
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

 */

  }

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
