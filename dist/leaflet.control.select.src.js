/*
  leaflet control list plugin
  https://github.com/adammertel/Leaflet.Control.List
  Adam Mertel | univie
*/
'use strict';

L.Control.Select = L.Control.extend({
  options: {
    position: 'topright',

    iconMain: 'fa-home',
    iconChecked: 'fa-circle',
    iconUnchecked: 'fa-circle-o',
    iconGroupChecked: 'fa-caret-right',
    iconGroupUnchecked: 'fa-angle-right',

    multi: false,

    items: [], // {value: 'String', 'label': 'String', items?: [items]}
    id: '',
    nothingSelectedText: 'nothing selected',
    selectedDefault: false,
    additionalClass: '',

    onOpen: false,
    onGroupOpen: false,
    onSelect: false,
    onClose: false
  },

  _emit: function _emit(action, data) {
    var newState = {};
    switch (action) {
      case 'RADIO_CLICKED':
        newState['selected'] = data.item.value;
    }

    this._setState(newState);
    this.render();
  },

  _setState: function _setState(newState) {
    // events
    if (newState.selected !== this.state.selected) {
      this.options.onSelect(newState.selected);
    }
    this.state = Object.assign(this.state, newState);
  },

  _isGroup: function _isGroup(item) {
    return false;
  },

  _isSelected: function _isSelected(item) {
    return this.state.selected === item.value;
  },

  _isOpen: function _isOpen(item) {
    return false;
  },

  _hideMenu: function _hideMenu() {
    this.state.open = false;
    this.render();
  },

  _openMenu: function _openMenu() {
    this.state.open = true;
    this.render();
  },

  _changeSelected: function _changeSelected(newValue) {
    this.options.selected = newValue;
    this._renderMenu();
    this.options.afterChange(newValue);
  },

  _iconClicked: function _iconClicked() {
    this._openMenu();
  },

  _itemClicked: function _itemClicked(item) {
    this._emit('RADIO_CLICKED', { item: item });
  },

  initialize: function initialize(options) {
    if (this.multi) {
      this.options.iconChecked = 'fa-check-square-o';
      this.options.iconUnchecked = 'fa-square-o';
    }

    L.Util.setOptions(this, options);
    this.state = {
      selected: this.options.selectedDefault, // false || {value}
      open: false // false || 'top' || {value}
    };
  },

  onAdd: function onAdd(map) {
    this.map = map;

    this.container = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control-select');
    this.container.setAttribute('id', this.options.id);

    var icon = L.DomUtil.create('a', 'leaflet-control-button fa ' + this.options.iconMain + ' ' + this.options.additionalClass, this.container);

    map.on('click', this._hideMenu, this);

    L.DomEvent.on(icon, 'click', L.DomEvent.stop);
    L.DomEvent.on(icon, 'click', this._iconClicked, this);

    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.disableScrollPropagation(this.container);

    this.render();
    return this.container;
  },

  _renderRadioIcon: function _renderRadioIcon(selected, contentDiv) {
    L.DomUtil.create('i', 'fa ' + (selected ? this.options.iconChecked : this.options.iconUnchecked), contentDiv);
  },
  _renderGroupIcon: function _renderGroupIcon(selected, contentDiv) {
    L.DomUtil.create('i', 'fa ' + (selected ? this.options.iconGroupChecked : this.options.iconGroupUnchecked), contentDiv);
  },


  _renderItem: function _renderItem(item) {
    var _this = this;

    var selected = this._isSelected(item);

    var p = L.DomUtil.create('p', '', this.menu);
    var pContent = L.DomUtil.create('div', '', p);
    var textSpan = L.DomUtil.create('span', '', pContent);
    textSpan.innerHTML = item.label;

    this._isGroup(item) ? this._renderGroupIcon(this._isSelected(item), pContent) : this._renderRadioIcon(this._isSelected(item), pContent);

    L.DomEvent.addListener(p, 'click', function (e) {
      _this._itemClicked(item);
    });

    return p;
  },

  _renderMenu: function _renderMenu() {
    var _this2 = this;

    this.menu = L.DomUtil.create('div', 'leaflet-control-select-menu leaflet-bar', this.container);
    this.options.items.map(function (item) {
      _this2._renderItem(item);
    });
    return false;
  },


  render: function render() {
    this.menu ? this.menu.remove() : false;
    this.state.open ? this._renderMenu() : false;
  }
});

L.control.select = function (options) {
  return new L.Control.Select(options);
};
