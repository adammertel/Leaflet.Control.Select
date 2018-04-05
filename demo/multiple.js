var lmap;
var marker;
var mapZoom = 3;
var mapPosition = [0, 0];

var colors = ['blue', 'red', 'orange', 'green'];

var items = [
  {
    label: 'beer',
    value: 'beer',
    items: []
  },
  {
    label: 'wine',
    value: 'wine',
    items: []
  }
];

colors.map(function(color) {
  items[0].items.push({
    label: color,
    value: 'beer-' + color
  });
  items[1].items.push({
    label: color,
    value: 'wine-' + color
  });
});

var beers = turf.randomPoint(100, { bbox: [-180, -90, 180, 90] });
var wines = turf.randomPoint(100, { bbox: [-180, -90, 180, 90] });

var geojson = false;
var actualSelection = [];

beers.features.map(function(beer) {
  const color = colors[Math.floor(Math.random() * colors.length)];
  beer.properties.type = 'beer-' + color;
  beer.properties.color = color;
});

wines.features.map(function(wine) {
  const color = colors[Math.floor(Math.random() * colors.length)];
  wine.properties.type = 'wine-' + color;
  wine.properties.color = color;
});

document.addEventListener('DOMContentLoaded', function() {
  lmap = L.map('map', { maxZoom: 20 }).setView(mapPosition, mapZoom);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(lmap);

  L.control
    .select({
      position: 'topleft',
      id: 'image-selector',
      selectedDefault: false,
      items: items,
      multi: true,
      iconMain: 'fa fa-filter',
      onSelect: function(selection) {
        console.log(selection);
        actualSelection = selection;
        redrawMap(selection);
      },
      onGroupOpen: function(groupOpened) {
        // console.log(groupOpened)
      }
    })
    .addTo(lmap);
});
var redrawMap = function() {
  if (lmap.clearLayers) {
    lmap.clearLayers();
  }
  L.geoJSON(beers, {
    style: styleFeature,
    pointToLayer: function(f, ll) {
      return featureToLayer(f, ll, 'beer');
    },
    filter: filterFeatures
  }).addTo(lmap);

  L.geoJSON(wines, {
    style: styleFeature,
    pointToLayer: function(f, ll) {
      return featureToLayer(f, ll, 'glass');
    },
    filter: filterFeatures
  }).addTo(lmap);
};

var filterFeatures = function(f) {
  return actualSelection.indexOf(f.properties.type) > -1;
};
var featureToLayer = function(f, ll, icon) {
  return L.marker(ll, {
    icon: L.divIcon({
      html:
        '<div class="fa fa-' +
        icon +
        '" style="color: ' +
        f.properties.color +
        ' ;font-size: 20px" > </div>',
      iconSize: [20, 20]
    })
  });
};
var styleFeature = function(f) {
  return {
    color: f.properties.color
  };
};
