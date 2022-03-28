<template>
  <div id="map"  style="width: 100%; height: 100%;"></div>
</template>

<script>

import L from 'leaflet'
import RouteParameters from '../data/RouteParameters'
import Distance from '../data/Distance'
import 'leaflet/dist/leaflet.css'

/**
 * TopologicalPoints hold 
 * connectivity information
 * about the route.
 * 
 * I.e. which lines they are connected to
 */
class TopologicalPoint{

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

  /**
   * Builds a Topological route given a set of points, that is on the route.
   */
  constructor(){
      this.points = [];
  }

  get length(){
    return this.points.length - 1;
  }

  get distance(){

    let distance = 0;

    for(let i = 1; i < this.points.length; i++){
      distance = distance + this.pointWiseDistance(this.points[i - 1].point, this.points[i].point);
    }

    return distance;
  }

  /**
   * Adds a Point to
   * the end of the route
   * 
   * Returns the circle created from the point
   */
  addPoint(point){
    const c = this.createCircle(point);

    let previousLine = null;
    if(this.points.length > 0)
    {
      previousLine = this.createPolyLine(this.points[this.points.length - 1].point, point);
      this.points[this.points.length - 1].nextLine = previousLine;
    }
    
    const topologicalP = new TopologicalPoint(point, c, null, previousLine);
    this.points.push(topologicalP);
  }

  /**
   * Returns true if the given
   * latitude and longitude are withing the given
   * points.
   */
  isContainedInPoint(latLng){
    return this.points.find(p => {
      const bounds = p.circle.getBounds();
      return bounds.contains(latLng);
    });
  }

  previousPoint(latLng){
    const pointIndex = this.findPointIndex(latLng);
    if(pointIndex >= 1)
      return this.points[pointIndex - 1];
    
    return null;
  }

  nextPoint(latLng){
    const pointIndex = this.findPointIndex(latLng);
    if(pointIndex < this.points.length - 1)
      return this.points[pointIndex + 1];
    
    return null;
  }

  /**
   * Given a latLng of a circle selects the previous 
   * line segment.
   */
  previousLineSegment(latLng){
    const point = this.findPoint(latLng);
    if(point == null)
      return null;
    
    return point.previousLine;
  }

  /*
    Given a latLng gets the next segment in the route
  */
  nextLineSegment(latLng){
    const point = this.findPoint(latLng);
    if(point == null)
      return null;
    
    return point.nextLine;
  }

  findPoint(latLng){
    const index = this.findPointIndex(latLng);
    if(index >= 0)
      return this.points[index];
    return null;
  }

  findPointIndex(latLng){
    return this.points.findIndex(p => p.point.equals(latLng));
  }

  createCircle(point){
    const c =   L.circle(point, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 10,
                isdraggable: true
              });
    
      
      return c;
  }

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
  }

  /**
   * The point wise distance between two 
   * points on the route map.
   * 
   * p1, p2 are Leaflet points.
   * Returns the distance in meters
   */
  pointWiseDistance(p1, p2){


    /* 
      Distance of the earth in Meters.
     */
    const r = 6371000

    const phi_1 = this.degrees_to_radians(p1.lat);
    const phi_2 = this.degrees_to_radians(p2.lat);

    const lambda_1 = this.degrees_to_radians(p1.lng);
    const lambda_2 = this.degrees_to_radians(p2.lng);

    const sin_squared_phi = Math.pow(Math.sin((phi_2 - phi_1)/2.0), 2);
    const sin_squared_lambda = Math.pow(Math.sin((lambda_2 - lambda_1)/2.0), 2);
    const cos_phi_1 = Math.cos(phi_1);
    const cos_phi_2 = Math.cos(phi_2);

    const norm = Math.sqrt(sin_squared_phi + cos_phi_1*cos_phi_2*sin_squared_lambda);
    const arcSin = Math.asin(norm);

    return 2.0*r*arcSin;
  }


 degrees_to_radians(degrees){
    var pi = Math.PI;
    return degrees * (pi/180);
}

}

export default {

  name: 'VueMap',
  props: {
    initialRoute: Array
  },

  data(){
    return {
      route: new TopologicalRoute(),
      selectedPoint: null,
      selectedPointInitialLocation: null,
      map: null
    }
  },

  methods: {
    
    onMapClick(e){
      if(!this.route.isContainedInPoint(e.latlng))
      {
        this.route.addPoint(e.latlng);
        this.drawRoute(this.route.length);
        this.routeUpdated();
      }
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
        return;

      let points = this.route.points;

      for(let i = startIndex; i < points.length; i++)
      {
        const circle = points[i].circle;
        circle.addTo(this.map);
        circle.on({
          mousedown: function(){
              this.selectPoint(circle);
          }.bind(this)
        });

        if(points[i].previousLine != null){
          points[i].previousLine.addTo(this.map);
        }
      }

    },

    mapMouseMoveEvent(e){
        if(this.selectedPoint != null){
          this.selectedPoint.setLatLng(e.latlng);
        }
    },

    moveSelectedPoint(){

      const selectedLatLng = this.selectedPoint.getLatLng();
      const previousPoint = this.route.previousPoint(this.selectedPointInitialLocation);
      const previousLine = this.route.previousLineSegment(this.selectedPointInitialLocation);
      const nextLine = this.route.nextLineSegment(this.selectedPointInitialLocation);
      const nextPoint = this.route.nextPoint(this.selectedPointInitialLocation);

      if(previousLine != null  && previousPoint != null){
        previousLine.setLatLngs([previousPoint.point, selectedLatLng])
      }

      console.log(`Next Line: ${nextLine}, Previous Line: ${previousLine}`)
      if(nextLine != null && nextPoint != null){
        nextLine.setLatLngs([selectedLatLng, nextPoint.point]);
      }

    },

    mouseDownSelectedPoint(circle){

      const selectedLatLng = this.selectedPoint.getLatLng();
      this.selectedPoint.remove();

      console.log(`Removing: ${this.selectedPoint}, Adding: ${circle} `)
      circle.setLatLng(selectedLatLng);
      circle.addTo(this.map);
    
      const topologicalPoint = this.route.findPoint(this.selectedPointInitialLocation);
      if(topologicalPoint != null)
        topologicalPoint.point = this.selectedPoint.getLatLng();


      this.selectedPointInitialLocation = null;
      this.selectedPoint = null;

      this.routeUpdated();
    },

    /**
     * Selects the given circle
     */
    selectPoint(circle){

      console.log(`Selected Point: ${circle}`)
      circle.remove();
      this.selectedPointInitialLocation = circle.getLatLng();
      const moveablePoint = L.circle(this.selectedPointInitialLocation, {
                color: 'blue',
                fillColor: '#3477eb',
                fillOpacity: 0.5,
                radius: 10,
                isdraggable: true
              });

      moveablePoint.addTo(this.map);
      this.selectedPoint = moveablePoint;

      moveablePoint.on({

        move: this.moveSelectedPoint,
        mousedown: () => this.mouseDownSelectedPoint(circle)
      });
    },

  
    /**
     * Converts this point into a point
     * as represented by leaflet
     */
    convertToLeafletPoint(p){
      return L.latLng(p.lat, p.lng);
    },
    
    /***
     * Method for internal use
     * by our Running App program.
     * 
     * Called whenever the route in question is
     * updated.
     */
    routeUpdated(){
        const distance = Distance.fromMeters(this.route.distance)
        const params = new RouteParameters(distance);
        this.$emit('routeChanged', params);
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

    for(let i = 0; i < this.initialRoute.length; i++){
      let p = this.convertToLeafletPoint(this.initialRoute[i]);
      this.route.addPoint(p);
    }
    this.routeUpdated();
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
