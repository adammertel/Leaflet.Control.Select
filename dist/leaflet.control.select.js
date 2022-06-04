/*
  leaflet control list plugin
  https://github.com/adammertel/Leaflet.Control.List
  Adam Mertel | univie
*/
"use strict";L.Control.Select=L.Control.extend({options:{position:"topright",iconMain:"\u2261",iconChecked:"\u25C9",// "☑"
iconUnchecked:"\u2D54",//"❒",
iconGroupChecked:"\u25B6",iconGroupUnchecked:"\u22B3",multi:false,items:[],// {value: 'String', 'label': 'String', items?: [items]}
id:"",selectedDefault:false,additionalClass:"",onOpen:function a(){},onClose:function a(){},onGroupOpen:function b(a){},onSelect:function b(a){}},initialize:function b(a){var c=this;this.menus=[];L.Util.setOptions(this,a);var d=this.options;this.options.items.forEach(function(a){if(!a.label){a.label=a.value}});if(d.multi){d.selectedDefault=d.selectedDefault instanceof Array?d.selectedDefault:[]}else{d.selectedDefault=d.selectedDefault||(d.items instanceof Array&&d.items.length>0?d.items[0].value:false)}this.state={selected:d.selectedDefault,// false || multi ? {value} : [{value}]
open:false// false || 'top' || {value}
};// assigning parents to items
var e=function b(a){if(c._isGroup(a)){a.items.map(function(c){c.parent=a.value;b(c)})}};this.options.items.map(function(a){a.parent="top";e(a)});// assigning children to items
var f=function b(a){var d=[];if(c._isGroup(a)){a.items.map(function(a){d.push(a.value);d=d.concat(b(a))})}return d};var g=function b(a){a.children=f(a);if(c._isGroup(a)){a.items.map(function(a){b(a)})}};this.options.items.map(function(a){g(a)})},onAdd:function b(a){this.map=a;var c=this.options;this.container=L.DomUtil.create("div","leaflet-control leaflet-bar leaflet-control-select");this.container.setAttribute("id",c.id);var d=L.DomUtil.create("a","leaflet-control-button ",this.container);d.innerHTML=c.iconMain;a.on("click",this._hideMenu,this);L.DomEvent.on(d,"click",L.DomEvent.stop);L.DomEvent.on(d,"click",this._iconClicked,this);L.DomEvent.disableClickPropagation(this.container);L.DomEvent.disableScrollPropagation(this.container);this.render();return this.container},_emit:function c(a,b){var d={};switch(a){case"ITEM_SELECT":if(this.options.multi){d.selected=this.state.selected.slice();if(this.state.selected.includes(b.item.value)){d.selected=d.selected.filter(function(a){return a!==b.item.value})}else{d.selected.push(b.item.value)}}else{d.selected=b.item.value}d.open=b.item.parent;break;case"GROUP_OPEN":d.open=b.item.value;break;case"GROUP_CLOSE":d.open=b.item.parent;break;case"MENU_OPEN":d.open="top";break;case"MENU_CLOSE":d.open=false;break;}this._setState(d);this.render()},_setState:function b(a){// events
if(this.options.onSelect&&a.selected&&(this.options.multi&&a.selected.length!==this.state.selected.length||!this.options.multi&&a.selected!==this.state.selected)){this.options.onSelect(a.selected)}if(this.options.onGroupOpen&&a.open&&a.open!==this.state.open){this.options.onGroupOpen(a.open)}if(this.options.onOpen&&a.open==="top"){this.options.onOpen()}if(this.options.onClose&&!a.open){this.options.onClose()}this.state=Object.assign(this.state,a)},_isGroup:function b(a){return"items"in a},_isSelected:function b(a){var c=this.state.selected;if(c){if(this._isGroup(a)){if("children"in a){return this.options.multi?c.find(function(b){return a.children.includes(b)}):a.children.includes(c)}else{return false}}return this.options.multi?c.indexOf(a.value)>-1:c===a.value}else{return false}},_isOpen:function b(a){var c=this.state.open;return c&&(c===a.value||a.children.includes(c))},_hideMenu:function a(){this._emit("MENU_CLOSE",{})},_iconClicked:function a(){this._emit("MENU_OPEN",{})},_itemClicked:function b(a){if(this._isGroup(a)){this.state.open===a.value?this._emit("GROUP_CLOSE",{item:a}):this._emit("GROUP_OPEN",{item:a})}else{this._emit("ITEM_SELECT",{item:a})}},_renderRadioIcon:function c(a,b){var d=L.DomUtil.create("span","radio icon",b);d.innerHTML=a?this.options.iconChecked:this.options.iconUnchecked},_renderGroupIcon:function c(a,b){var d=L.DomUtil.create("span","group icon",b);d.innerHTML=a?this.options.iconGroupChecked:this.options.iconGroupUnchecked},_renderItem:function c(a,b){var d=this;var e=this._isSelected(a);var f=L.DomUtil.create("div","leaflet-control-select-menu-line",b);var g=L.DomUtil.create("div","leaflet-control-select-menu-line-content",f);var h=L.DomUtil.create("span","text",g);h.innerHTML=a.label;if(this._isGroup(a)){this._renderGroupIcon(e,g);// adding classes to groups and opened group
L.DomUtil.addClass(f,"group");this._isOpen(a)&&L.DomUtil.addClass(f,"group-opened");this._isOpen(a)&&this._renderMenu(f,a.items)}else{this._renderRadioIcon(e,g)}L.DomEvent.addListener(g,"click",function(b){d._itemClicked(a)});return f},_renderMenu:function c(a,b){var d=this;var e=L.DomUtil.create("div","leaflet-control-select-menu leaflet-bar ",a);this.menus.push(e);b.map(function(a){d._renderItem(a,e)})},_clearMenus:function a(){this.menus.map(function(a){return a.remove()});this.meus=[]},render:function a(){this._clearMenus();if(this.state.open){this._renderMenu(this.container,this.options.items)}},/* public methods */close:function a(){this._hideMenu()}});L.control.select=function(a){return new L.Control.Select(a)};
