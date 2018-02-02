L.Control.List = L.Control.extend({
  state: {
    open: false, // false || 'top' || {value}
    selected: false // false || {value}
  },
  options: {
    position: 'topright',

    icons: {
      top: 'fa-home',
      checked: 'fa-check-square-o',
      unchecked: 'fa-square-o',
      groupChecked: 'fa-caret-right',
      groupUnchecked: 'fa-angle-right'
    },

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

  _isGroup: function(item) {
    return false;
  },

  _isSelected: function(item) {
    return false;
  },

  _isOpen: function(item) {
    return false;
  },

  _hideMenu: function() {
    this.state.open = false;
    this._render();
  },

  _openMenu: function() {
    this.state.open = true;
    this._render();
  },

  _changeSelected: function(newValue) {
    this.options.selected = newValue;
    this._renderMenu();
    this.options.afterChange(newValue);
  },

  _iconClicked: function() {
    this._openMenu();
  },

  _itemClicked: function(item) {
    console.log('item clicked', item);
  },

  onAdd: function(map) {
    this.map = map;

    this.container = L.DomUtil.create(
      'div',
      'leaflet-control leaflet-bar leaflet-control-select'
    );
    this.container.setAttribute('id', this.options.id);

    const icon = L.DomUtil.create(
      'a',
      'leaflet-control-button fa ' +
        this.options.icons.top +
        ' ' +
        this.options.additionalClass,
      this.container
    );

    map.on('click', this._hideMenu, this);

    L.DomEvent.on(icon, 'click', L.DomEvent.stop);
    L.DomEvent.on(icon, 'click', this._iconClicked, this);

    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.disableScrollPropagation(this.container);

    this._render();
    return this.container;
  },

  _renderRadioIcon(selected, contentDiv) {
    const icons = this.options.icons;
    L.DomUtil.create(
      'i',
      'fa ' + (selected ? icons.checked : icons.unchecked),
      contentDiv
    );
  },

  _renderGroupIcon(selected, contentDiv) {
    const icons = this.options.icons;
    L.DomUtil.create(
      'i',
      'fa ' + (selected ? icons.groupChecked : icons.groupUnchecked),
      contentDiv
    );
  },

  _renderItem: function(item) {
    const selected = this._isSelected(item);

    const p = L.DomUtil.create('p', '', this.menu);
    const pContent = L.DomUtil.create('div', '', p);
    const textSpan = L.DomUtil.create('span', '', pContent);
    textSpan.innerHTML = item.label;

    this._group
      ? this._renderGroupIcon(selected, pContent)
      : this._renderRadioIcon(selected, pContent);

    L.DomEvent.addListener(p, 'click', e => {
      this._itemClicked(item);
    });

    return p;
  },

  _renderMenu() {
    this.menu = L.DomUtil.create(
      'div',
      'leaflet-control-select-menu leaflet-bar',
      this.container
    );
    this.options.items.map(item => {
      this._renderItem(item);
    });
    return false;
  },

  _render: function() {
    this.menu ? this.menu.remove() : false;
    this.state.open ? this._renderMenu() : false;
  }
});

L.control.list = options => new L.Control.List(options);
