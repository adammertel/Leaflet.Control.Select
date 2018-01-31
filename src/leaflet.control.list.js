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
    const pContent = L.DomUtil.create('div', p);
    const textSpan = L.DomUtil.create('span', '', pContent);
    textSpan.innerHTML = item.label;

    this._group
      ? this._renderGroupIcon(item, pContent)
      : this._renderRadioIcon(item, pContent);

    L.DomEvent.addListener(line, 'click', e => {
      this._changeSelected(value);
      this._openMenu();
    });

    return p;
  },

  onAdd: function(map) {
    this.map = map;

    this.map.options.selectControls
      ? this.map.options.selectControls.push(this)
      : (this.map.options.selectControls = [this]);

    this.map._hideAllSelectControls = () => {
      map.options.selectControls.map(selectControl =>
        selectControl._hideMenu()
      );
    };

    this.container = L.DomUtil.create(
      'div',
      'leaflet-control leaflet-bar leaflet-control-select'
    );
    this.container.setAttribute('id', this.options.id);
    const icon = L.DomUtil.create(
      'a',
      'leaflet-control-button fa ' +
        this.options.icon +
        ' ' +
        this.options.additionalClass,
      this.container
    );
    this.menu = L.DomUtil.create(
      'div',
      'leaflet-bar leaflet-control-select-menu',
      this.container
    );

    if (!this.state.menuOpen) {
      map.on('click', this._hideMenu, this);

      if (!L.Browser.mobile) {
        L.DomEvent.on(
          this.container,
          {
            mouseenter: this._openMenu,
            mouseleave: this._hideMenu
          },
          this
        );
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
  _renderMenu: function() {
    this.menu.innerHTML = '';

    if (this.state.menuOpen) {
      this.options.choices.map(option => {
        this._createRadio(option, option === this.options.selected);
      });
      this.menu.className = 'leaflet-bar leaflet-control-select-menu open';
    } else {
      this.menu.className = 'leaflet-bar leaflet-control-select-menu closed';
    }
  },

  _hideMenu: function() {
    this.state.menuOpen = false;
    L.DomUtil.removeClass(this.container, 'leaflet-control-select-expanded');
    this._renderMenu();
  },

  _openMenu: function() {
    this.map._hideAllSelectControls();
    L.DomUtil.addClass(this.container, 'leaflet-control-select-expanded');
    this.state.menuOpen = true;
    this._renderMenu();
  },

  _changeSelected: function(newValue) {
    this.options.selected = newValue;
    this._renderMenu();
    this.options.afterChange(newValue);
  }
});

L.control.list = options => new L.Control.List(options);
