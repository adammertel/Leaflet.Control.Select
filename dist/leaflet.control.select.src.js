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
    selectedDefault: false,
    additionalClass: '',

    onOpen: function onOpen() {},
    onClose: function onClose() {},
    onGroupOpen: function onGroupOpen(itemGroup) {},
    onSelect: function onSelect(item) {}
  },

  _emit: function _emit(action, data) {
    var newState = {};

    switch (action) {
      case 'ITEM_SELECT':
        if (this.options.multi) {
          newState['selected'] = this.state.selected.slice();

          if (this.state.selected.includes(data.item.value)) {
            newState['selected'] = newState['selected'].filter(function (s) {
              return s !== data.item.value;
            });
          } else {
            newState['selected'].push(data.item.value);
          }
        } else {
          newState['selected'] = data.item.value;
        }
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

  _setState: function _setState(newState) {
    // events
    if (this.options.onSelect && newState.selected && (this.options.multi && newState.selected.length !== this.state.selected.length || !this.options.multi && newState.selected !== this.state.selected)) {
      this.options.onSelect(newState.selected);
    }

    if (this.options.onGroupOpen && newState.open && newState.open !== this.state.open) {
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

  _isGroup: function _isGroup(item) {
    return 'items' in item;
  },

  _isSelected: function _isSelected(item) {
    var sel = this.state.selected;
    if (sel) {
      if (this._isGroup(item)) {
        if ('children' in item) {
          return this.options.multi ? sel.find(function (s) {
            return item.children.includes(s);
          }) : item.children.includes(sel);
        } else {
          return false;
        }
      }
      return this.options.multi ? sel.indexOf(item.value) > -1 : sel === item.value;
    } else {
      return false;
    }
  },

  _isOpen: function _isOpen(item) {
    var open = this.state.open;
    return open && (open === item.value || item.children.includes(open));
  },

  _hideMenu: function _hideMenu() {
    this._emit('MENU_CLOSE', {});
  },

  _iconClicked: function _iconClicked() {
    this._emit('MENU_OPEN', {});
  },

  _itemClicked: function _itemClicked(item) {
    if (this._isGroup(item)) {
      if (this.state.open === item.value) {
        this._emit('GROUP_CLOSE', { item: item });
      } else {
        this._emit('GROUP_OPEN', { item: item });
      }
    } else {
      this._emit('ITEM_SELECT', { item: item });
    }
  },

  initialize: function initialize(options) {
    var _this = this;

    this.menus = [];
    L.Util.setOptions(this, options);
    var opts = this.options;

    if (opts.multi) {
      opts.iconChecked = 'fa-check-square-o';
      opts.iconUnchecked = 'fa-square-o';
    }

    if (opts.multi) {
      opts.selectedDefault = opts.selectedDefault instanceof Array ? opts.selectedDefault : [];
    }

    this.state = {
      selected: opts.selectedDefault, // false || {value}multi
      open: false // false || 'top' || {value}
    };

    // assigning parents to items
    var assignParent = function assignParent(item) {
      if (_this._isGroup(item)) {
        item.items.map(function (item2) {
          item2.parent = item.value;
          assignParent(item2);
        });
      }
    };

    this.options.items.map(function (item) {
      item.parent = 'top';
      assignParent(item);
    });

    // assigning children to items
    var getChildren = function getChildren(item) {
      var children = [];
      if (_this._isGroup(item)) {
        item.items.map(function (item2) {
          children.push(item2.value);
          children = children.concat(getChildren(item2));
        });
      }
      return children;
    };

    var assignChildrens = function assignChildrens(item) {
      item.children = getChildren(item);

      if (_this._isGroup(item)) {
        item.items.map(function (item2) {
          assignChildrens(item2);
        });
      }
    };

    this.options.items.map(function (item) {
      assignChildrens(item);
    });
  },

  onAdd: function onAdd(map) {
    this.map = map;
    var opts = this.options;

    this.container = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control-select');
    this.container.setAttribute('id', this.options.id);

    var icon = L.DomUtil.create('a', opts.iconMain + ' leaflet-control-button ', this.container);

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


  _renderItem: function _renderItem(item, menu) {
    var _this2 = this;

    var selected = this._isSelected(item);

    var p = L.DomUtil.create('div', 'leaflet-control-select-menu-line', menu);
    var pContent = L.DomUtil.create('div', 'leaflet-control-select-menu-line-content', p);
    var textSpan = L.DomUtil.create('span', '', pContent);

    textSpan.innerHTML = item.label;

    if (this._isGroup(item)) {
      this._renderGroupIcon(selected, pContent);
      if (this._isOpen(item)) {
        this._renderMenu(p, item.items);
      }
    } else {
      this._renderRadioIcon(selected, pContent);
    }

    L.DomEvent.addListener(pContent, 'click', function (e) {
      _this2._itemClicked(item);
    });

    return p;
  },

  _renderMenu: function _renderMenu(parent, items) {
    var _this3 = this;

    var menu = L.DomUtil.create('div', 'leaflet-control-select-menu leaflet-bar ', parent);
    this.menus.push(menu);
    items.map(function (item) {
      _this3._renderItem(item, menu);
    });
  },


  _clearMenus: function _clearMenus() {
    this.menus.map(function (menu) {
      return menu.remove();
    });
    this.meus = [];
  },

  render: function render() {
    this._clearMenus();
    this.state.open ? this._renderMenu(this.container, this.options.items) : false;
  },

  /* public methods */
  close: function close() {
    this._hideMenu();
  }
});

L.control.select = function (options) {
  return new L.Control.Select(options);
};
