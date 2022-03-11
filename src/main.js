import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {Point} from 'ol/geom';
import View from 'ol/View';

const place = [51.0447, 114.0719];

const point = new Point(place);

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: 'map',
  view: new View({
    center: [-12697623.442109834, 6628955.677910388],
    zoom: 12,
  }),
});

map.on('click', function(event){

  console.log("Click Coordinate: (" + event.coordinate[0] + ", " + event.coordinate[1] + ")")

});

document.getElementById('zoom-out').onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom - 1);
};

document.getElementById('zoom-in').onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom + 1);
};