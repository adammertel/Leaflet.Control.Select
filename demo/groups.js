var map;
var marker;
var mapZoom = 13;
var mapPosition = [48.945548, 18.12225];

var places = [
  {
    label: 'towns',
    value: 'town group',
    items: [
      { label: 'Nová Dubnica', value: [[48.936649, 18.141319], 16] },
      { label: 'Dubnica nad Váhom', value: [[48.959672, 18.170311], 16] },
      { label: 'Nemšová', value: [[48.965817, 18.121432], 16] }
    ]
  },
  {
    label: 'villages',
    value: 'villages group',
    items: [
      {
        label: 'north',
        value: 'north-villages-group',
        items: [
          { label: 'Bolešov', value: [[48.987006, 18.15625], 16] },
          { label: 'Borčice', value: [[48.979288, 18.137024], 16] },
          { label: 'Kameničany', value: [[48.991538, 18.170283], 16] }
        ]
      },
      {
        label: 'west',
        value: 'west-villages-group',
        items: [
          { label: 'Dolná Súča', value: [[48.957633, 18.031684], 16] },
          { label: 'Skalka nad Váhom', value: [[48.92652, 18.071181], 16] }
        ]
      },
      {
        label: 'south',
        value: 'south-villages-group',
        items: [
          { label: 'Kolačín', value: [[48.936836, 18.16759], 16] },
          { label: 'Trenčianska Teplá', value: [[48.93461, 18.120773], 16] }
        ]
      }
    ]
  },
  {
    label: 'region',
    value: [[48.945548, 18.12225], 13]
  }
];

document.addEventListener('DOMContentLoaded', function() {
  map = L.map('map', { maxZoom: 20 }).setView(mapPosition, mapZoom);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.control
    .select({
      position: 'topleft',
      id: 'image-selector',
      selectedDefault: false,
      items: places,
      iconMain: 'fa fa-building',
      onSelect: function(newPosition) {
        console.log('on select');
        drawMarker(newPosition[0], newPosition[1]);
      },
      onGroupOpen: function(groupOpened) {
        // console.log(groupOpened)
      }
    })
    .addTo(map);
});
var drawMarker = function(newCenter, newZoom) {
  map.setView(newCenter, newZoom);
};
