/* global google */
var cdb = require('cdb');
var LeafletLayerViewFactory = require('./leaflet/leaflet-layer-view-factory');
var GMapsLayerViewFactory = require('./gmaps/gmaps-layer-view-factory');

var MapViewFactory = function (options) {
  this._vector = options.vector;
};

MapViewFactory.prototype.createMapView = function (provider, mapModel, el) {
  var MapViewClass;
  var LayerViewFactoryClass;

  if (provider === 'leaflet') {
    MapViewClass = cdb.geo.LeafletMapView;
    LayerViewFactoryClass = LeafletLayerViewFactory;
  } else if (provider === 'googlemaps') {
    if (typeof (google) !== 'undefined' && typeof (google.maps) !== 'undefined') {
      MapViewClass = cdb.geo.GoogleMapsMapView;
      LayerViewFactoryClass = GMapsLayerViewFactory;
    } else {
      throw new Error('Google maps library should be included');
    }
  } else {
    throw new Error(provider + ' provider is not supported');
  }

  return new MapViewClass({
    el: el,
    map: mapModel,
    layerViewFactory: new LayerViewFactoryClass({
      vector: this._vector
    })
  });
};

module.exports = MapViewFactory;
