var map = L.map('map').setView([50.966819, -114.068019], 13);

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(map);

/*var pointA = new L.LatLng(50.970643, -114.071388);
var pointB = new L.LatLng(50.959292, -114.071388);
var pointList = [pointA, pointB];

var firstpolyline = new L.Polyline(pointList, {
    color: 'red',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1
}); 
firstpolyline.addTo(map);


var circle = L.circle([50.970643, -114.071388], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 10
}).bindTooltip("My Label", {permanent: true, className: "my-label", offset: [0, 0] }).addTo(map).bindPopup('I am a circle.'); */

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