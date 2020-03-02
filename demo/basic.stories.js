import * as L from "leaflet";
import { randomPoint } from "@turf/random";

require("./../node_modules/leaflet/dist/leaflet.css");
require("../dist/leaflet.control.select.js");
require("./../dist/leaflet.control.select.css");

require("./demo.css");

export default { title: "Basic" };

export const Simple = () => {
  const mapDiv = document.createElement("div");
  mapDiv.setAttribute("id", "map");

  setTimeout(() => {
    console.log("loaded");

    var map;
    var marker;
    var mapZoom = 11;
    var mapPosition = [49, 18];

    var items = [
      { label: "sunny", value: "☼" },
      { label: "half-sunny", value: "🌤" },
      { label: "half-raining", value: "🌦" },
      { label: "raining", value: "🌨" },
      { label: "tornado", value: "🌪" }
    ];

    var drawMarker = icon => {
      marker.setIcon(
        L.divIcon({
          html: '<div class="icon">' + icon + "</div>",
          className: "marker-icon",
          iconSize: [40, 40]
        })
      );
    };

    map = L.map("map", { maxZoom: 14 }).setView(mapPosition, mapZoom);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var defaultValue = items[0].value;

    L.control
      .select({
        position: "topleft",
        selectedDefault: defaultValue,
        items: items,
        onSelect: function(newIcon) {
          drawMarker(newIcon);
        }
      })
      .addTo(map);

    marker = L.marker([49, 18]).addTo(map);

    drawMarker(defaultValue);
  }, 0);

  return mapDiv;
};

export const Multiple = () => {
  const mapDiv = document.createElement("div");
  mapDiv.setAttribute("id", "map");

  setTimeout(() => {
    map = L.map("map", { maxZoom: 20 }).setView(mapPosition, mapZoom);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.control
      .select({
        position: "topleft",
        id: "image-selector",
        selectedDefault: false,
        items: items,
        multi: true,
        iconChecked: "☑",
        iconUnchecked: "❒",
        iconMain: "🏭",
        onSelect: function(selection) {
          console.log(selection);
          actualSelection = selection;
          redrawMap(selection);
        },
        onGroupOpen: function(groupOpened) {
          // console.log(groupOpened)
        }
      })
      .addTo(map);
  }, 0);

  var map;
  var mapZoom = 3;
  var mapPosition = [0, 0];

  var colors = ["blue", "red", "orange", "green"];

  var items = [
    {
      label: "🍺",
      value: "beer",
      items: []
    },
    {
      label: "🍷",
      value: "wine",
      items: []
    }
  ];

  colors.map(function(color) {
    items[0].items.push({
      label: color,
      value: "beer-" + color
    });
    items[1].items.push({
      label: color,
      value: "wine-" + color
    });
  });

  var beers = randomPoint(100, { bbox: [-180, -90, 180, 90] });
  var wines = randomPoint(100, { bbox: [-180, -90, 180, 90] });

  var actualSelection = [];

  var beerLayer = false;
  var wineLayer = false;

  beers.features.map(function(beer) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    beer.properties.type = "beer-" + color;
    beer.properties.color = color;
  });

  wines.features.map(function(wine) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    wine.properties.type = "wine-" + color;
    wine.properties.color = color;
  });

  var redrawMap = function() {
    beerLayer && beerLayer.clearLayers();
    wineLayer && wineLayer.clearLayers();

    console.log(map);
    beerLayer = L.geoJSON(beers, {
      style: styleFeature,
      pointToLayer: function(f, ll) {
        return featureToLayer(f, ll, "🍺");
      },
      filter: filterFeatures
    }).addTo(map);

    wineLayer = L.geoJSON(wines, {
      style: styleFeature,
      pointToLayer: function(f, ll) {
        return featureToLayer(f, ll, "🍷");
      },
      filter: filterFeatures
    }).addTo(map);
  };

  var filterFeatures = function(f) {
    return actualSelection.indexOf(f.properties.type) > -1;
  };
  var featureToLayer = function(f, ll, icon) {
    return L.marker(ll, {
      icon: L.divIcon({
        className: "beer-wine-icon",
        html:
          '<div class="icon" style="background-color: ' +
          f.properties.color +
          ' ;font-size: 20px" >' +
          icon +
          "</div>",
        iconSize: [20, 20]
      })
    });
  };

  var styleFeature = function(f) {
    return {
      color: f.properties.color
    };
  };

  return mapDiv;
};

export const Groups = () => {
  const mapDiv = document.createElement("div");
  mapDiv.setAttribute("id", "map");

  var map;
  var marker;
  var mapZoom = 13;
  var mapPosition = [48.945548, 18.12225];

  var places = [
    {
      label: "towns",
      value: "town group",
      items: [
        { label: "Nová Dubnica", value: [[48.936649, 18.141319], 16] },
        { label: "Dubnica nad Váhom", value: [[48.959672, 18.170311], 16] },
        { label: "Nemšová", value: [[48.965817, 18.121432], 16] }
      ]
    },
    {
      label: "villages",
      value: "villages group",
      items: [
        {
          label: "north",
          value: "north-villages-group",
          items: [
            { label: "Bolešov", value: [[48.987006, 18.15625], 16] },
            { label: "Borčice", value: [[48.979288, 18.137024], 16] },
            { label: "Kameničany", value: [[48.991538, 18.170283], 16] }
          ]
        },
        {
          label: "west",
          value: "west-villages-group",
          items: [
            { label: "Dolná Súča", value: [[48.957633, 18.031684], 16] },
            { label: "Skalka nad Váhom", value: [[48.92652, 18.071181], 16] }
          ]
        },
        {
          label: "south",
          value: "south-villages-group",
          items: [
            { label: "Kolačín", value: [[48.936836, 18.16759], 16] },
            { label: "Trenčianska Teplá", value: [[48.93461, 18.120773], 16] }
          ]
        }
      ]
    },
    {
      label: "region",
      value: [[48.945548, 18.12225], 13]
    }
  ];

  setTimeout(() => {
    console.log("loaded");

    map = L.map("map", { maxZoom: 20 }).setView(mapPosition, mapZoom);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.control
      .select({
        position: "topleft",
        id: "image-selector",
        selectedDefault: false,
        items: places,
        iconMain: "🏘",
        onSelect: function(newPosition) {
          drawMarker(newPosition[0], newPosition[1]);
        },
        onGroupOpen: function(groupOpened) {
          // console.log(groupOpened)
        }
      })
      .addTo(map);
  }, 0);

  var drawMarker = function(newCenter, newZoom) {
    map.setView(newCenter, newZoom);
  };

  return mapDiv;
};
