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
    afterChange: function() {
      return this.options.selected;
    }
  },
  constructor: function() {
    this.list = this;
  },
  _createRadio: function(value, selected) {
    const line = L.DomUtil.create(
      'p',
      'leaflet-control-select-choise',
      this.menu
    );

    if (selected) {
      L.DomUtil.create(
        'i',
        'leaflet-control-select-choise-checker fa fa-check-square',
        line
      );
    } else {
      L.DomUtil.create(
        'i',
        'leaflet-control-select-choise-checker fa fa-square-o',
        line
      );
    }
    const lineLabel = L.DomUtil.create(
      'span',
      'leaflet-control-select-choise-label',
      line
    );

    lineLabel.innerHTML = value;

    L.DomEvent.addListener(line, 'click', e => {
      this._changeSelected(value);
      this._openMenu();
    });

    return line;
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
