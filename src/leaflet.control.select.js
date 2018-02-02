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

  _emit: function(action, data) {
    const newState = {};

    switch (action) {
      case 'RADIO_SELECT':
        newState['selected'] = data.item.value;
        newState['open'] = data.item.parent;
        break;

      case 'GROUP_OPEN':
        newState['open'] = data.item.value;
        break;

      case 'GROUP_CLOSE':
        newState['open'] = data.item.parent;
        break;

      case 'MENU_OPEN':
        newState['open'] = 'top';
        break;

      case 'MENU_CLOSE':
        newState['open'] = false;
        break;
    }

    this._setState(newState);
    this.render();
  },

  _setState: function(newState) {
    // events
    if (
      this.options.onSelect &&
      newState.selected &&
      newState.selected !== this.state.selected
    ) {
      this.options.onSelect(newState.selected);
    }

    if (
      this.options.onGroupOpen &&
      newState.open &&
      newState.open !== this.state.open
    ) {
      this.options.onGroupOpen(newState.open);
    }

    if (this.options.onOpen && newState.open === 'top') {
      this.options.onOpen();
    }

    if (this.options.onClose && !newState.open) {
      this.options.onClose();
    }

    this.state = Object.assign(this.state, newState);
  },

  _isGroup: function(item) {
    return 'items' in item;
  },

  _isSelected: function(item) {
    const sel = this.state.selected;
    if (sel) {
      return this._isGroup(item)
        ? 'children' in item && item.children.includes(sel)
        : sel === item.value;
    } else {
      return false;
    }
  },

  _isOpen: function(item) {
    const open = this.state.open;
    return open && (open === item.value || item.children.includes(open));
  },

  _hideMenu: function() {
    this._emit('MENU_CLOSE', {});
  },

  _iconClicked: function() {
    this._emit('MENU_OPEN', {});
  },

  _itemClicked: function(item) {
    if (this._isGroup(item)) {
      if (this.state.open === item.value) {
        this._emit('GROUP_CLOSE', { item: item });
      } else {
        this._emit('GROUP_OPEN', { item: item });
      }
    } else {
      this._emit('RADIO_SELECT', { item: item });
    }
  },

  initialize: function(options) {
    this.menus = [];
    const opts = this.options;
    if (this.multi) {
      opts.iconChecked = 'fa-check-square-o';
      opts.iconUnchecked = 'fa-square-o';
    }

    L.Util.setOptions(this, options);
    this.state = {
      selected: opts.selectedDefault, // false || {value}
      open: false // false || 'top' || {value}
    };

    // assigning parents to items
    const assignParent = item => {
      if (this._isGroup(item)) {
        item.items.map(item2 => {
          item2.parent = item.value;
          assignParent(item2);
        });
      }
    };

    this.options.items.map(item => {
      item.parent = 'top';
      assignParent(item);
    });

    // assigning children to items

    const getChildren = item => {
      let children = [];
      if (this._isGroup(item)) {
        item.items.map(item2 => {
          children.push(item2.value);
          children = children.concat(getChildren(item2));
        });
      }
      return children;
    };

    const assignChildrens = item => {
      item.children = getChildren(item);

      if (this._isGroup(item)) {
        item.items.map(item2 => {
          assignChildrens(item2);
        });
      }
    };

    this.options.items.map(item => {
      assignChildrens(item);
    });

    console.log(this.options.items);
  },

  onAdd: function(map) {
    this.map = map;
    const opts = this.options;

    this.container = L.DomUtil.create(
      'div',
      'leaflet-control leaflet-bar leaflet-control-select'
    );
    this.container.setAttribute('id', this.options.id);

    const icon = L.DomUtil.create(
      'a',
      opts.iconMain + ' leaflet-control-button fa ',
      this.container
    );

    map.on('click', this._hideMenu, this);

    L.DomEvent.on(icon, 'click', L.DomEvent.stop);
    L.DomEvent.on(icon, 'click', this._iconClicked, this);

    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.disableScrollPropagation(this.container);

    this.render();
    return this.container;
  },

  _renderRadioIcon(selected, contentDiv) {
    L.DomUtil.create(
      'i',
      'fa ' +
        (selected ? this.options.iconChecked : this.options.iconUnchecked),
      contentDiv
    );
  },

  _renderGroupIcon(selected, contentDiv) {
    L.DomUtil.create(
      'i',
      'fa ' +
        (selected
          ? this.options.iconGroupChecked
          : this.options.iconGroupUnchecked),
      contentDiv
    );
  },

  _renderItem: function(item, menu) {
    const selected = this._isSelected(item);

    const p = L.DomUtil.create('p', '', menu);
    const pContent = L.DomUtil.create('div', '', p);
    const textSpan = L.DomUtil.create('span', '', pContent);

    textSpan.innerHTML = item.label;

    if (this._isGroup(item)) {
      this._renderGroupIcon(selected, pContent);
      if (this._isOpen(item)) {
        this._renderMenu(p, item.items);
      }
    } else {
      this._renderRadioIcon(selected, pContent);
    }

    L.DomEvent.addListener(pContent, 'click', e => {
      this._itemClicked(item);
    });

    return p;
  },

  _renderMenu(parent, items) {
    const menu = L.DomUtil.create(
      'div',
      'leaflet-control-select-menu leaflet-bar ',
      parent
    );
    this.menus.push(menu);
    items.map(item => {
      this._renderItem(item, menu);
    });
  },

  _clearMenus: function() {
    this.menus.map(menu => menu.remove());
    this.meus = [];
  },

  render: function() {
    this._clearMenus();
    this.state.open
      ? this._renderMenu(this.container, this.options.items)
      : false;
  }
});

L.control.select = options => new L.Control.Select(options);
