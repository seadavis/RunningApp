import 'ol/ol.css';
import Map from 'ol/Map';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Point} from 'ol/geom';
import View from 'ol/View';

const source = new VectorSource({wrapX: false});
const vectorLayer = new VectorLayer({
  source: source
});

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer
  ],
  target: 'map',
  view: new View({
    center: [-12697623.442109834, 6628955.677910388],
    zoom: 12,
  }),
});

map.on('click', function(event){

  const markerGeometry = new ol.geom.Point(ol.proj.transform(event.coordinate, 'EPSG:4326','EPSG:4326'));
  const markerFeature = new ol.Feature({
    geometry: markerGeometry
} );
  vectorLayer.source.features.add(markerFeature)
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