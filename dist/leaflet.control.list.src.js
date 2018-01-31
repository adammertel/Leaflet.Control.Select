/*
  leaflet control list plugin
  https://github.com/adammertel/Leaflet.Control.List
  Adam Mertel | univie
*/
'use strict';

L.Control.List = L.Control.extend({
  state: {
    menuOpen: false
  },
  options: {
    position: 'topright',
    icon: '',
    id: '',
    choices: [],
    selected: false,
    additionalClass: '',
    afterChange: function afterChange() {
      return this.options.selected;
    }
  },
  constructor: function constructor() {
    this.list = this;
  },
  _createRadio: function _createRadio(value, selected) {
    var _this = this;

    var line = L.DomUtil.create('p', 'leaflet-control-select-choise', this.menu);

    if (selected) {
      L.DomUtil.create('i', 'leaflet-control-select-choise-checker fa fa-check-square', line);
    } else {
      L.DomUtil.create('i', 'leaflet-control-select-choise-checker fa fa-square-o', line);
    }
    var lineLabel = L.DomUtil.create('span', 'leaflet-control-select-choise-label', line);

    lineLabel.innerHTML = value;

    L.DomEvent.addListener(line, 'click', function (e) {
      _this._changeSelected(value);
      _this._openMenu();
    });

    return line;
  },

  onAdd: function onAdd(map) {
    this.map = map;

    this.map.options.selectControls ? this.map.options.selectControls.push(this) : this.map.options.selectControls = [this];

    this.map._hideAllSelectControls = function () {
      map.options.selectControls.map(function (selectControl) {
        return selectControl._hideMenu();
      });
    };

    this.container = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control-select');
    this.container.setAttribute('id', this.options.id);
    var icon = L.DomUtil.create('a', 'leaflet-control-button fa ' + this.options.icon + ' ' + this.options.additionalClass, this.container);
    this.menu = L.DomUtil.create('div', 'leaflet-bar leaflet-control-select-menu', this.container);

    if (!this.state.menuOpen) {
      map.on('click', this._hideMenu, this);

      if (!L.Browser.mobile) {
        L.DomEvent.on(this.container, {
          mouseenter: this._openMenu,
          mouseleave: this._hideMenu
        }, this);
      }
    }

    if (L.Browser.touch) {
      L.DomEvent.on(icon, 'click', L.DomEvent.stop);
      L.DomEvent.on(icon, 'click', this._openMenu, this);
    } else {
      L.DomEvent.on(icon, 'focus', this._hideMenu, this);
    }

    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.disableScrollPropagation(this.container);

    this._renderMenu();
    return this.container;
  },
  _renderMenu: function _renderMenu() {
    var _this2 = this;

    this.menu.innerHTML = '';

    if (this.state.menuOpen) {
      this.options.choices.map(function (option) {
        _this2._createRadio(option, option === _this2.options.selected);
      });
      this.menu.className = 'leaflet-bar leaflet-control-select-menu open';
    } else {
      this.menu.className = 'leaflet-bar leaflet-control-select-menu closed';
    }
  },

  _hideMenu: function _hideMenu() {
    this.state.menuOpen = false;
    L.DomUtil.removeClass(this.container, 'leaflet-control-select-expanded');
    this._renderMenu();
  },

  _openMenu: function _openMenu() {
    this.map._hideAllSelectControls();
    L.DomUtil.addClass(this.container, 'leaflet-control-select-expanded');
    this.state.menuOpen = true;
    this._renderMenu();
  },

  _changeSelected: function _changeSelected(newValue) {
    this.options.selected = newValue;
    this._renderMenu();
    this.options.afterChange(newValue);
  }
});

L.control.list = function (options) {
  return new L.Control.List(options);
};
