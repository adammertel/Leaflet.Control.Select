var map;
var marker;
var mapZoom = 11;
var mapPosition = [49, 18];

var places = [
  {
    label: 'towns',
    value: 'towns',
    items: [
      { label: 'Nová Dubnica', value: [10, 13] },
      { label: 'Dubnica nad Váhom', value: [10, 15] },
      { label: 'Nemšová', value: [10, 16] }
    ]
  },
  {
    label: 'villages',
    value: 'villages',
    items: [
      { label: 'group 1', value: 'group 1', items: [] },
      { label: 'group 2', value: 'group 2', items: [] },
      { label: 'group 3', value: 'group 3', items: [] }
    ]
  },
  {
    label: 'region',
    value: [12, 12]
  }
];

document.addEventListener('DOMContentLoaded', function() {
  map = L.map('map', { maxZoom: 14 }).setView(mapPosition, mapZoom);
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
      icons: {
        checked: 'fa-home'
      },
      onSelect: function(newIcon) {
        // console.log('on select')
        drawMarker(newIcon);
      },
      onGroupOpen: function(groupOpened) {
        // console.log(groupOpened)
      }
    })
    .addTo(map);

  marker = L.marker([49, 18]).addTo(map);
});
var drawMarker = function(icon) {
  marker.setIcon(
    L.divIcon({ className: 'marker-icon fa fa-' + icon, iconSize: [40, 40] })
  );
};
