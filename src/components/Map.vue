<template>
  <div id="map"  style="width: 100%; height: 100%;"></div>
</template>

<script>

import L from 'leaflet'
import Point from '../data/Point'
import 'leaflet/dist/leaflet.css'

export default {

  name: 'VueMap',
  props: {
    initialRoute: Array
  },

  data(){
    return {
      circles: [],
      lines: [],
      route: this.initialRoute,
      map: null
    }
  },

  methods: {
    
    onMapClick(e){
      
      this.route.push(new Point(e.latlng.lat, e.latlng.lng))
      this.drawRoute(this.route.length - 1)
    },

    /* 
      Draws the complete
      set of points from the props.
      Draws a circle for one point and line segments for two or more points.

      startIndex - the index at which we start drawing.
        used for when we are adding a point to the route.
        0 - based index.

      Examples:
        drawRoute(1) - starts drawing the route from the second
        point in the route
      
    */
    drawRoute(startIndex = 0){
    
      if(this.map == null)
        return null;

      for(let i = startIndex; i < this.route.length; i++){
        const p = this.convertToLeafletPoint(this.route[i]);
        const circle = this.createCircle(p);
        circle.addTo(this.map);
        this.circles.push(circle);
      }

      const firstEndPoint = startIndex == 0 ? 1 : startIndex;

      for(let i = firstEndPoint; i < this.route.length; i++){
        const p1 = this.convertToLeafletPoint(this.route[i - 1]);
        const p2 = this.convertToLeafletPoint(this.route[i]);
        const polyLine = this.createPolyLine(p1, p2);
        polyLine.addTo(this.map);
      }

    },

    /**
     * Creates an unselected
     * circle with the default colors.
     * point - is the point LatLng in leaflet at which the circle will exist. Needs to be 
     * in the leaflet type.
     */
    createCircle(point){
      const c =   L.circle(point, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 10,
                isdraggable: true
              });
     let m = this.map;
     c.on({
      mousedown: function () {
        m.on('mousemove', function (e) {
          c.setLatLng(e.latlng);
        });
      }  
    }); 
    
      return c;
    },

    /**
     * Creates a line between the 
     * two points.
     * Both points as arguments should be of a 
     * leaflet type
     */
    createPolyLine(point1, point2){
        return new L.Polyline([point1, point2], {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
      })
    },

    /**
     * Converts this point into a point
     * as represented by leaflet
     */
    convertToLeafletPoint(p){
      return L.latLng(p.lat, p.lng);
    }
  },


 

  mounted(){
     this.map = L.map('map').setView([50.966819, -114.068019], 13);
     this.map.on('click', this.onMapClick);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.drawRoute();

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
