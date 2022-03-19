<template>
  <div id="map"  style="width: 100%; height: 100%;"></div>
</template>

<script>

import L from 'leaflet'
import Point from '../data/Point'
import 'leaflet/dist/leaflet.css'

/**
 * TopologicalPoints hold 
 * connectivity information
 * about the route.
 * 
 * I.e. which lines they are connected to
 */
/* eslint-disable */
class TopolgicalPoint{

  /**
   * point - the point in the points array this is added to
   * circle - the circle theb point is connected to
   * nextLine - the line at which this point is a start point,
   *  may be null
   * 
   * previousLine - the line at which this point is an endpoint.
   *  only null if there is one point
   */
  constructor(point, circle, nextLine, previousLine){
    this.point = point;
    this.circle = circle;
    this.nextLine = nextLine;
    this.previousLine = previousLine;
  }

}


class TopologicalRoute{

  constructor(topologicalPoints){

  }

  /**
   * Adds a Point to
   * the end of the route
   * 
   * Returns the circle created from the point
   */
  addPoint(point){

  }

  /**
   * Given a circle selects the previous 
   * line segment.
   */
  previousLineSegmnet(circle){

  }

  /*
    Given a circle gets the next segment in the route
  */
  nextLineSegment(circle){

  }

}
/* eslint-enable */

export default {

  name: 'VueMap',
  props: {
    initialRoute: Array
  },

  data(){
    return {
      route: this.initialRoute,
      selectedPoint: null,
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

      let circles = [];
      let lines = [];

      for(let i = startIndex; i < this.route.length; i++){
      
        const p = this.convertToLeafletPoint(this.route[i]);
        const circle = this.createCircle(p);
        circles.push(circle);
        //circle.addTo(this.map);

        if(i > 0)
        {
            const p2 = this.convertToLeafletPoint(this.route[i - 1]);
            const polyLine = this.createPolyLine(p, p2);
            lines.push(polyLine);
            //polyLine.addTo(this.map);
        }
      }

      for(let i = startIndex; i < circles.length; i++)
      {
        circles[i].addTo(this.map);
        const circle = circles[i];
        circles[i].on({
          mousedown: function(){
              this.selectPoint(circle);
          }.bind(this)
        });
      }

      for(let i = startIndex; i < lines.length; i++)
      {
          lines[i].addTo(this.map)
      }

    },

    mapMouseMoveEvent(e){
        if(this.selectedPoint != null){
          this.selectedPoint.setLatLng(e.latlng);
        }
    },

    /**
     * Selects the given circle
     */
    selectPoint(circle){

      circle.remove();
      const moveablePoint = L.circle(circle.getLatLng(), {
                color: 'blue',
                fillColor: '#3477eb',
                fillOpacity: 0.5,
                radius: 10,
                isdraggable: true
              });

      moveablePoint.addTo(this.map);
      this.selectedPoint = moveablePoint;

      moveablePoint.on({

        mousedown: function(){
          
          moveablePoint.remove();
          circle.addTo(this.map);
          circle.setLatLng(moveablePoint.getLatLng());
          this.selectedPoint = null;

        }.bind(this)
      });
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
     this.map.on({
       mousemove: this.mapMouseMoveEvent
     })

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
