(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Datepicker"] = factory();
	else
		root["Datepicker"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// export default object globally
	module.exports = __webpack_require__(1).default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _helpers = __webpack_require__(2);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _options = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Datepicker
	 */
	var Datepicker = function () {

	  /**
	   * @constructor
	   *
	   * @param {(string|HTMLElement)} elem - DOM element to attach to
	   * @param {Object} [opts] - Instance configuration
	   *
	   * @param {string} [opts.class=''] - Additional classes for theming
	   * @param {(string|Date)} [opts.openOn='start'] - Open the datepicker to 'first' or 'last' date in selection, or a specific Date
	   * @param {boolean} [opts.multiple=false] - Allow multiple dates to be selected
	   * @param {boolean} [opts.inline=false] - Supress show & hide functionality
	   * @param {(string|Date)} [opts.min=false] - Minimum date allowed
	   * @param {(string|Date)} [opts.max=false] - Maximum date allowed
	   * @param {(string[]|Date[])} [opts.within=false] - Only allow dates within this array
	   * @param {(string[]|Date[])} [opts.without=false] - Disallow dates within this array
	   * @param {integer} [opts.yearRange=5] - Range of year picker
	   * @param {integer} [opts.weekStart=0] - Day to start week on; 0 = Sunday, 1 = Monday, etc...
	   * @param {integer} [opts.calendars=1] - Number of calendars to draw
	   * @param {integer} [opts.paginate=1] - How many months to skip when using next/prev (useful for multiple calendars)
	   * @param {integer} [opts.index=0] - Index of main calendar when using multiple calendars
	   * @param {string} [opts.separator=','] - Separator between values when `multple` is true
	     * @param {callback} [opts.serialize(date)] - Callback to transform Date to string value
	   * @param {callback} [opts.deserialize(str)] - Callback to transform string into Date object
	   * @param {callback} [opts.onInit(elem)] - Called on initialization
	   * @param {callback} [opts.onUpdate(value)] - Called when datepicker is updated
	   */
	  function Datepicker(elem, opts) {
	    var _this = this;

	    _classCallCheck(this, Datepicker);

	    // we have a selector
	    if (typeof elem === 'string') {

	      // id selector
	      if ('#' == elem.substr(0, 1)) {
	        elem = document.getElementById(elem.substr(1));

	        // class/tag selector
	      } else {
	        return (0, _helpers.$$)(elem).map(function (el) {
	          return new _this.constructor(el, opts);
	        });
	      }
	    }

	    // no element?
	    if (!elem) {
	      elem = document.createElement('input');
	    }

	    // make sure it's a valid input type
	    if ('input' === elem.tagName.toLowerCase() && !/input|hidden/i.test(elem.type)) {
	      elem.type = 'text';
	    }

	    // initialize the dom
	    this._initDOM(elem);

	    // initialize options
	    this._initOptions(opts);

	    // initialize event listeners
	    this._initEvents();

	    // set the initial value
	    this.setValue(elem.value || elem.dataset.value || '');

	    // callback option
	    if (this._opts.onInit) {
	      this._opts.onInit(elem);
	    }
	  }

	  /**
	   * Initialize options
	   *
	   * @param  {Object} opts Options to initialize this instance with
	   */


	  /**
	   * Default options
	   */


	  _createClass(Datepicker, [{
	    key: '_initOptions',
	    value: function _initOptions() {
	      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this._opts = {};

	      // options pass through here before being set
	      var inline = _options.updateInline.bind(this);
	      var minMax = _options.deserializeMinMax.bind(this);
	      var withInOut = _options.deserializeWithinWithout.bind(this);
	      var openOn = _options.deserializeOpenOn.bind(this);
	      var weekstart = _options.constrainWeekstart.bind(this);
	      var classNames = _options.updateClassNames.bind(this);
	      var templates = _options.createTemplateRenderers.bind(this);

	      this._setters = {
	        inline: inline,
	        min: minMax,
	        max: minMax,
	        within: withInOut,
	        without: withInOut,
	        openOn: openOn,
	        weekstart: weekstart,
	        classNames: classNames,
	        templates: templates
	      };

	      // setup renderers
	      this._renderers = {
	        select: (0, _helpers.tmpl)(['<span style="position:relative"><%= o[c] %>', '<select data-<%= t %>="<%= c %>" data-index="<%= i %>"', 'style="position:absolute;top:0;left:0;width:100%;height:100%;margin:0;opacity:0.005;">', '<% for (var v in o) { %>', '<option value="<%= v %>"<%= (v === c) ? " selected" : "" %>><%= o[v] %></option>', '<% } %>', '</select>', '</span>'].join(''))
	      };

	      // set all the options
	      this.set((0, _helpers.deepExtend)({}, this.constructor.defaults, (0, _helpers.getDataAttributes)(this._el), opts));
	    }

	    /**
	     * Initialize DOM
	     */

	  }, {
	    key: '_initDOM',
	    value: function _initDOM(elem) {

	      // already initialized dom
	      if (this.node) return;

	      // save this
	      this._el = elem;

	      // create the datepicker element
	      this.node = document.createElement('div');
	      this.node.style.position = 'relative';

	      // create the wrapping element
	      this.wrapper = document.createElement('div');
	      this.wrapper.style.zIndex = 9999;

	      // insert our element into the dom
	      if (elem.parentNode) {
	        elem.parentNode.insertBefore(this.node, elem);
	      }

	      // put stuff in our element
	      this.node.appendChild(elem);
	      this.node.appendChild(this.wrapper);
	    }

	    /**
	     * Initialize event listeners
	     */

	  }, {
	    key: '_initEvents',
	    value: function _initEvents() {
	      var _this2 = this;

	      // already initialized
	      if (this._isInitialized) return;

	      // this will help with click & drag selecting
	      this._highlighted = [];

	      // bind context
	      this._onmousedown = this._onmousedown.bind(this);
	      this._onmousemove = this._onmousemove.bind(this);
	      this._onmouseup = this._onmouseup.bind(this);
	      this._onclick = this._onclick.bind(this);

	      // on focus (or click), open the datepicker
	      if ('input' !== this._el.tagName.toLowerCase()) {
	        this._el.addEventListener('click', function () {
	          return _this2.toggle();
	        });
	      } else {
	        this._el.addEventListener('focus', function () {
	          return _this2.open();
	        });
	      }

	      // if we click outside of our element, hide it
	      document.addEventListener('mousedown', function (e) {
	        if (!_this2.node.contains(e.target)) _this2.hide();
	      });

	      // don't actually select text, please
	      this.node.onselectstart = function () {
	        return false;
	      };

	      // add necessary events
	      this.node.addEventListener('mousedown', this._onmousedown);
	      this.node.addEventListener('mousemove', this._onmousemove);
	      this.node.addEventListener('mouseup', this._onmouseup);
	      this.node.addEventListener('click', this._onclick);

	      // flag as initialized
	      this._isInitialized = true;
	    }

	    /**
	     * When we mousedown on a "date node," highlight it and start the selection
	     */

	  }, {
	    key: '_onmousedown',
	    value: function _onmousedown(e) {
	      var _opts = this._opts;
	      var multiple = _opts.multiple;
	      var deserialize = _opts.deserialize;
	      var _opts$classNames = _opts.classNames;
	      var selectedClass = _opts$classNames.selected;
	      var highlightedClass = _opts$classNames.highlighted;


	      var dateNode = (0, _helpers.closest)(e.target, '[data-day]', this.wrapper);

	      if (dateNode) {
	        this._highlighted = [];
	        this._isDragging = true;
	        this._dragDate = deserialize(dateNode.dataset.day);

	        if (!multiple) {
	          (0, _helpers.$$)('[data-day].' + selectedClass, this.wrapper).forEach(function (el) {
	            (0, _helpers.removeClass)(el, selectedClass);
	          });
	        }

	        (0, _helpers.toggleClass)(dateNode, selectedClass, !this.hasDate(this._dragDate));
	        (0, _helpers.addClass)(dateNode, highlightedClass);
	      }
	    }

	    /**
	     * We're making a selection, and we're allowed to highlight them
	     */

	  }, {
	    key: '_onmousemove',
	    value: function _onmousemove(e) {
	      var _this3 = this;

	      var _opts2 = this._opts;
	      var multiple = _opts2.multiple;
	      var serialize = _opts2.serialize;
	      var deserialize = _opts2.deserialize;
	      var _opts2$classNames = _opts2.classNames;
	      var selectedClass = _opts2$classNames.selected;
	      var highlightedClass = _opts2$classNames.highlighted;


	      if (!multiple) return;

	      var dateNode = (0, _helpers.closest)(e.target, '[data-day]', this.wrapper);
	      var date = dateNode ? deserialize(dateNode.dataset.day) : null;
	      var doSelect = !this.hasDate(this._dragDate);

	      if (this._isDragging && date) {
	        this._highlighted = (0, _helpers.dateRange)(this._dragDate, date);

	        (0, _helpers.$$)('[data-day].' + highlightedClass, this.wrapper).forEach(function (el) {
	          (0, _helpers.toggleClass)(el, selectedClass, _this3.hasDate(el.dataset.day));
	          (0, _helpers.removeClass)(el, highlightedClass);
	        });

	        this._highlighted.forEach(function (d) {
	          (0, _helpers.$$)('[data-day="' + serialize(d) + '"]', _this3.wrapper).forEach(function (el) {
	            (0, _helpers.toggleClass)(el, selectedClass, doSelect);
	            (0, _helpers.addClass)(el, highlightedClass);
	          });
	        });
	      }
	    }

	    /**
	     * We've finished the potential selection
	     */

	  }, {
	    key: '_onmouseup',
	    value: function _onmouseup(e) {
	      var _this4 = this;

	      var _opts3 = this._opts;
	      var multiple = _opts3.multiple;
	      var serialize = _opts3.serialize;
	      var _opts3$classNames = _opts3.classNames;
	      var selectedClass = _opts3$classNames.selected;
	      var highlightedClass = _opts3$classNames.highlighted;

	      // remove the highlighting

	      (0, _helpers.$$)('[data-day].' + highlightedClass, this.wrapper).forEach(function (el) {
	        (0, _helpers.removeClass)(el, highlightedClass);
	      });

	      // make sure we've got at least one
	      if (!this._highlighted.length) {
	        this._highlighted.push(this._dragDate);
	      }

	      // only do this stuff if we've made a selection
	      if (this._isDragging && (0, _helpers.closest)(e.target, '[data-day]', this.node)) {

	        // actually make the selection
	        this.toggleDate(this._highlighted, !this.hasDate(this._dragDate));

	        // update the elements without refreshing the calendar
	        this._highlighted.map(serialize).forEach(function (d) {
	          (0, _helpers.$$)('[data-day="' + d + '"]', _this4.wrapper).forEach(function (el) {
	            (0, _helpers.toggleClass)(el, selectedClass, _this4.hasDate(d));
	          });
	        });

	        // you can't select multiple, hide the calendar
	        if (!multiple) {
	          (0, _helpers.$$)('[data-day].' + selectedClass, this.wrapper).forEach(function (el) {
	            (0, _helpers.toggleClass)(el, selectedClass, _this4.hasDate(el.dataset.day));
	          });

	          this.hide();
	        }
	      }

	      // reset this stuff
	      this._isDragging = false;
	      this._highlighted = [];
	    }

	    /**
	     * What did you click?
	     */

	  }, {
	    key: '_onclick',
	    value: function _onclick(e) {
	      var _this5 = this;

	      // previous month
	      if (e.target.hasAttribute('data-prev')) {
	        this.prev(e.target.dataset.prev);

	        // next month
	      } else if (e.target.hasAttribute('data-next')) {
	        this.next(e.target.dataset.next);

	        // clicked the year select but it hasn't been bound
	      } else if (e.target.hasAttribute('data-year') && !e.target.onchange) {
	        e.target.onchange = function () {
	          var c = e.target.dataset.year;
	          var y = _this5._month.getFullYear();
	          _this5._month.setFullYear(parseInt(e.target.value) - (c - y));
	          _this5.render();
	        };

	        // clicked the month select but it hasn't been bound
	      } else if (e.target.hasAttribute('data-month') && !e.target.onchange) {
	        e.target.onchange = function () {
	          _this5._month.setMonth(e.target.value - e.target.dataset.index);
	          _this5.render();
	        };
	      }
	    }

	    /**
	     * Set options
	     *
	     * @param {(string|Object)} prop - Option key, or object of properties
	     * @param {mixed} [value] - Value of option (not used if object present)
	     * @param {boolean} [noRedraw] - Do not redraw the calendar afterwards
	     */

	  }, {
	    key: 'set',
	    value: function set(key, val) {
	      var k = key;

	      if (!key) return;

	      // iterate over the object
	      if ((0, _helpers.isPlainObject)(key)) {

	        // don't render yet
	        this._noRender = true;

	        // prioritize serialize & deserialize
	        if (key.serialize) {
	          this.set('serialize', key.serialize);
	          delete key.serialize;
	        }
	        if (key.deserialize) {
	          this.set('deserialize', key.deserialize);
	          delete key.deserialize;
	        }

	        // set remaining options
	        for (var _k in key) {
	          this.set(_k, key[_k]);
	        } // rerender
	        this._noRender = false;

	        if (this._isOpen && this.wrapper) {
	          this.render();
	        }

	        // return all options
	        return this._opts;
	      }

	      // setting part of object
	      if (key.indexOf('.') > 0) {
	        var p = key.split('.');
	        var v = val;

	        key = p.unshift();
	        val = {};

	        p.reduce(function (r, o) {
	          return val[o] = {};
	        }, val);
	        val[p[p.length - 1]] = v;
	      }

	      // default opts to pass to setters
	      var opts = (0, _helpers.deepExtend)({}, this.constructor.defaults, this._opts);

	      // fix the value
	      if (key in this._setters) {
	        val = this._setters[key](val, opts);
	      }

	      if ((0, _helpers.isPlainObject)(val)) {
	        val = (0, _helpers.deepExtend)({}, opts[key], val);
	      }

	      // actually set the value
	      this._opts[key] = val;

	      // rerender
	      if (this._isOpen && this.wrapper) {
	        this.render();
	      }

	      // return value
	      return this.get(k);
	    }

	    /**
	     * Get an option
	     *
	     * @param {string} key - Option key
	     */

	  }, {
	    key: 'get',
	    value: function get(key) {
	      return key.split('.').reduce(function (v, k) {
	        return v[k];
	      }, this._opts);
	    }

	    /**
	     * Open the calendar to a specific date (or `openOn` date);
	     *
	     * @param {string|Date} [date=openOn] - The date to open to
	     */

	  }, {
	    key: 'open',
	    value: function open(date) {
	      var selected = [].concat(this.getDate());
	      date = date || this._opts.openOn || this._month;

	      // we have a string
	      if (typeof date === 'string') {
	        date = date.toLowerCase();

	        // first, last, or deserialize
	        if (date === 'first' && selected.length) {
	          date = selected[0];
	        } else if (date === 'last' && selected.length) {
	          date = selected[selected.length - 1];
	        } else if (date !== 'today') {
	          date = this._opts.deserialize(date);
	        }
	      }

	      // still not valid? then open to today
	      if (!(0, _helpers.isValidDate)(date)) {
	        date = new Date();
	      }

	      // set calendar to date and show it
	      this.goToDate(date);
	      this.render();
	      this.show();
	    }

	    /**
	     * Show the datepicker and position it
	     */

	  }, {
	    key: 'show',
	    value: function show() {
	      if (!this._opts.inline) {
	        this.wrapper.style.display = 'block';
	        this.wrapper.style.top = '100%';
	        this.wrapper.style.left = 0;

	        var rect = this.wrapper.getBoundingClientRect();
	        var posRight = rect.right > window.innerWidth;
	        var posTop = rect.bottom > window.innerHeight;

	        this.wrapper.style.top = posTop ? '' : '100%';
	        this.wrapper.style.right = posRight ? 0 : '';
	        this.wrapper.style.bottom = posTop ? '100%' : '';
	        this.wrapper.style.left = posRight ? '' : 0;

	        rect = this.wrapper.getBoundingClientRect();
	        var fitLeft = rect.right >= rect.width;
	        var fitTop = rect.bottom > rect.height;

	        this.wrapper.style.top = posTop && fitTop ? '' : '100%';
	        this.wrapper.style.right = posRight && fitLeft ? 0 : '';
	        this.wrapper.style.bottom = posTop && fitTop ? '100%' : '';
	        this.wrapper.style.left = posRight && fitLeft ? '' : 0;

	        this._isOpen = true;
	      }
	    }

	    /**
	     * Hide the datepicker
	     */

	  }, {
	    key: 'hide',
	    value: function hide() {
	      if (!this._opts.inline) {
	        this.wrapper.style.display = 'none';
	        this._isOpen = false;
	      }
	    }

	    /**
	     * Toggle the datepicker
	     */

	  }, {
	    key: 'toggle',
	    value: function toggle() {
	      if (this._isOpen) {
	        this.hide();
	      } else {
	        this.open();
	      }
	    }

	    /**
	     * Go to the next month
	     *
	     * @param {integer} [skip] - How many months to skip
	     */

	  }, {
	    key: 'next',
	    value: function next(skip) {
	      var date = new Date(this._month.getTime());
	      skip = Math.max(skip || 1, 1);
	      date.setMonth(date.getMonth() + skip);
	      this.goToDate(date);
	    }

	    /**
	     * Go to the previous month
	     *
	     * @param {integer} [skip] - How many months to skip
	     */

	  }, {
	    key: 'prev',
	    value: function prev(skip) {
	      var date = new Date(this._month.getTime());
	      skip = Math.max(skip || 1, 1);
	      date.setMonth(date.getMonth() - skip);
	      this.goToDate(date);
	    }

	    /**
	     * Go to a specific date
	     *
	     * @param {(string|Date)} date - Date to set the calendar to
	     */

	  }, {
	    key: 'goToDate',
	    value: function goToDate(date) {
	      date = (0, _helpers.setToStart)(this._opts.deserialize(date));
	      date.setDate(1);

	      this._month = date;

	      if (this._isOpen) {
	        this.render();
	      }
	    }

	    /**
	     * Check the value for a specific date
	     *
	     * @param {(string|Date)} date - The date to check for
	     */

	  }, {
	    key: 'hasDate',
	    value: function hasDate(date) {
	      date = (0, _helpers.setToStart)(this._opts.deserialize(date));
	      return !!this._selected && !!this._selected[date.getTime()];
	    }

	    /**
	     * Add a date to the value
	     *
	     * @param {(string|Date)} date - The date to add
	     */

	  }, {
	    key: 'addDate',
	    value: function addDate(date) {
	      this.toggleDate(date, true);
	    }

	    /**
	     * Remove a date from the value
	     *
	     * @param {(string|Date)} date - The date to remove
	     */

	  }, {
	    key: 'removeDate',
	    value: function removeDate(date) {
	      this.toggleDate(date, false);
	    }

	    /**
	     * Toggle a date selection
	     *
	     * @param {(string|Date)} date - Date to toggle
	     * @param {boolean} [force] - Force to selected/deselected
	     */

	  }, {
	    key: 'toggleDate',
	    value: function toggleDate(dates, force) {
	      var _this6 = this;

	      var _opts4 = this._opts;
	      var multiple = _opts4.multiple;
	      var deserialize = _opts4.deserialize;
	      var onChange = _opts4.onChange;

	      dates = [].concat(dates).filter(function (d) {
	        return !!d && _this6.dateAllowed(d);
	      });

	      dates.forEach(function (d) {
	        d = (0, _helpers.setToStart)(deserialize(d));
	        var t = d.getTime();

	        // add the date
	        if (!_this6._selected[t] && (force === undefined || !!force)) {

	          // clear old value
	          if (!multiple) _this6._selected = {};

	          _this6._selected[t] = d;

	          // remove the date
	        } else if (_this6._selected[t] && !force) {
	          delete _this6._selected[t];
	        }
	      });

	      // update the element
	      if (this._el.nodeName.toLowerCase() === 'input') {
	        this._el.value = this.getValue();
	      } else {
	        this._el.dataset.value = this.getValue();
	      }

	      // callback
	      if (onChange) onChange(this.getDate());
	    }

	    /**
	     * Get the selected dates
	     */

	  }, {
	    key: 'getDate',
	    value: function getDate() {
	      var selected = [];
	      for (var t in this._selected) {
	        selected.push(this._selected[t]);
	      }return this._opts.multiple ? selected.sort(_helpers.compareDates) : selected[0];
	    }

	    /**
	     * Set the date
	     *
	     * @param {Date} date [description]
	     */

	  }, {
	    key: 'setDate',
	    value: function setDate(date) {
	      if (this.dateAllowed(date)) {
	        this._selected = _defineProperty({}, date.getTime(), new Date(date));
	      }
	    }

	    /**
	     * Get the value
	     */

	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      var selected = (0, _helpers.transform)(this.getDate() || [], this._opts.serialize, this);
	      return [].concat(selected).join(this._opts.separator);
	    }

	    /**
	     * Set the value to a specific date
	     *
	     * @param {string} value - The date value
	     */

	  }, {
	    key: 'setValue',
	    value: function setValue(val) {
	      this._selected = {};
	      this.addDate(val.split(this._opts.separator));
	    }

	    /**
	     * Check if a date is allowed in the datepicker
	     *
	     * @param {(string|Date)} date - The date to check
	     * @param {string} [dim] - The dimension to check ('year' or 'month')
	     */

	  }, {
	    key: 'dateAllowed',
	    value: function dateAllowed(date, dim) {
	      var _opts5 = this._opts;
	      var min = _opts5.min;
	      var max = _opts5.max;
	      var within = _opts5.within;
	      var without = _opts5.without;
	      var deserialize = _opts5.deserialize;

	      var belowMax = void 0,
	          aboveMin = belowMax = true;

	      date = (0, _helpers.setToStart)(deserialize(date));

	      if (dim == 'month') {
	        aboveMin = !min || date.getMonth() >= min.getMonth();
	        belowMax = !max || date.getMonth() <= max.getMonth();
	      } else if (dim == 'year') {
	        aboveMin = !min || date.getFullYear() >= min.getFullYear();
	        belowMax = !max || date.getFullYear() <= max.getFullYear();
	      } else {
	        aboveMin = !min || date >= min;
	        belowMax = !max || date <= max;
	      }

	      return aboveMin && belowMax && (!without || !(0, _helpers.dateInArray)(date, without, dim)) && (!within || (0, _helpers.dateInArray)(date, within, dim));
	    }

	    /**
	     * render the calendar HTML
	     */

	  }, {
	    key: 'render',
	    value: function render() {
	      var _this7 = this;

	      var _opts6 = this._opts;
	      var yearRange = _opts6.yearRange;
	      var i18n = _opts6.i18n;
	      var onRender = _opts6.onRender;

	      // don't render

	      if (this._noRender || !this._renderers) return;

	      // avoid duplicate calls to getCalendar
	      var renderCache = {};
	      var getData = function getData(i) {
	        return renderCache[i] || (renderCache[i] = _this7.getCalendar(i));
	      };

	      // generic render header
	      var _renderHeader = function _renderHeader(data) {
	        var _date = data._date;
	        var index = data.index;
	        var month = data.month;
	        var year = data.year;


	        return _this7._renderers.header(_extends({}, data, {

	          // render month select
	          renderMonthSelect: function renderMonthSelect() {
	            var i = arguments.length <= 0 || arguments[0] === undefined ? index : arguments[0];

	            var d = new Date(_date.getTime());
	            var o = {};

	            for (var m = 0; m < 12; m++) {
	              if (_this7.dateAllowed(d.setMonth(m), 'month')) {
	                o[m] = i18n.months[m];
	              }
	            }

	            return _this7._renderers.select({
	              o: o, i: i, t: 'month', c: _date.getMonth()
	            });
	          },

	          // render year select
	          renderYearSelect: function renderYearSelect() {
	            var i = arguments.length <= 0 || arguments[0] === undefined ? index : arguments[0];

	            var d = new Date(_date.getTime());
	            var y = year - yearRange;
	            var max = year + yearRange;
	            var o = {};

	            for (; y <= max; y++) {
	              if (_this7.dateAllowed(d.setFullYear(y), 'year')) {
	                o[y] = y;
	              }
	            }

	            return _this7._renderers.select({
	              o: o, i: i, t: 'year', c: year
	            });
	          }
	        }));
	      };

	      // render html
	      this.wrapper.innerHTML = this._renderers.container({

	        // render header
	        renderHeader: function renderHeader() {
	          var i = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	          return _renderHeader(getData(i));
	        },

	        // render calendar
	        renderCalendar: function renderCalendar() {
	          var i = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	          var data = getData(i);

	          return _this7._renderers.calendar(_extends({}, data, {

	            // render header within calendar
	            renderHeader: function renderHeader() {
	              return _renderHeader(data);
	            },

	            // render day
	            renderDay: function renderDay(day) {
	              return _this7._renderers.day(day);
	            }
	          }));
	        }
	      });

	      // callback
	      if (onRender) onRender(this.wrapper.firstChild);
	    }

	    /**
	     * Get an object containing data for a calendar month
	     *
	     * @param {integer} [i=0] - Offset month to render
	     */

	  }, {
	    key: 'getCalendar',
	    value: function getCalendar() {
	      var _ref;

	      var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	      var _opts7 = this._opts;
	      var i18n = _opts7.i18n;
	      var weekStart = _opts7.weekStart;
	      var serialize = _opts7.serialize;
	      var dateMin = _opts7.min;
	      var dateMax = _opts7.max;
	      var _opts7$classNames = _opts7.classNames;
	      var selectedClass = _opts7$classNames.selected;
	      var disabledClass = _opts7$classNames.disabled;
	      var otherMonthClass = _opts7$classNames.otherMonth;
	      var weekendClass = _opts7$classNames.weekend;
	      var todayClass = _opts7$classNames.today;


	      var date = new Date(this._month.getTime());
	      date.setMonth(date.getMonth() + index);

	      var month = date.getMonth();
	      var year = date.getFullYear();

	      // get next/prev month to determine if they're allowed
	      var nextMonth = new Date(date.getTime());
	      nextMonth.setMonth(nextMonth.getMonth() + 1);
	      nextMonth.setDate(1);

	      var prevMonth = new Date(date.getTime());
	      prevMonth.setMonth(prevMonth.getMonth() - 1);
	      prevMonth.setDate((0, _helpers.getDaysInMonth)(prevMonth));

	      // collect the days' data
	      var days = [];

	      // setup the start day
	      var start = date.getDay() - weekStart;
	      while (start < 0) {
	        start += 7;
	      } // number of days in the month, padded to fit a calendar
	      var dayCount = (0, _helpers.getDaysInMonth)(year, month) + start;
	      while (dayCount % 7) {
	        dayCount += 1;
	      } // today!
	      var today = (0, _helpers.setToStart)(new Date());

	      // loop through the calendar days
	      for (var i = 0; i < dayCount; i++) {
	        var day = new Date(year, month, 1 + (i - start));
	        var dayMonth = day.getMonth();
	        var weekday = day.getDay();

	        var isSelected = this.hasDate(day);
	        var isDisabled = !this.dateAllowed(day);
	        var isPrevMonth = dayMonth < month;
	        var isNextMonth = dayMonth > month;
	        var isThisMonth = !isPrevMonth && !isNextMonth;
	        var isWeekend = weekday === 0 || weekday === 6;
	        var isToday = day.getTime() === today.getTime();

	        // classNames
	        var classNames = [];
	        if (isSelected) classNames.push(selectedClass);
	        if (isDisabled) classNames.push(disabledClass);
	        if (!isThisMonth) classNames.push(otherMonthClass);
	        if (isWeekend) classNames.push(weekendClass);
	        if (isToday) classNames.push(todayClass);

	        // basic day data
	        days.push({
	          _date: day,

	          date: serialize(day),
	          daynum: day.getDate(),
	          weekday: i18n.weekdays[weekday],
	          weekdayShort: i18n.weekdays[weekday],

	          isSelected: isSelected,
	          isDisabled: isDisabled,
	          isPrevMonth: isPrevMonth,
	          isNextMonth: isNextMonth,
	          isThisMonth: isThisMonth,
	          isWeekend: isWeekend,
	          isToday: isToday,

	          classNames: classNames
	        });
	      }

	      // return the calendar data
	      return _ref = {
	        _date: date,

	        year: year,
	        month: i18n.months[month],
	        days: days,

	        weekdays: i18n.weekdays
	      }, _defineProperty(_ref, 'weekdays', i18n.weekdays), _defineProperty(_ref, 'hasNext', !dateMax || nextMonth <= dateMax), _defineProperty(_ref, 'hasPrev', !dateMin || prevMonth >= dateMin), _ref;
	    }
	  }]);

	  return Datepicker;
	}();

	Datepicker.defaults = _defaults2.default;
	exports.default = Datepicker;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.$$ = $$;
	exports.matches = matches;
	exports.closest = closest;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.hasClass = hasClass;
	exports.toggleClass = toggleClass;
	exports.getDataAttributes = getDataAttributes;
	exports.isLeapYear = isLeapYear;
	exports.getDaysInMonth = getDaysInMonth;
	exports.dateInArray = dateInArray;
	exports.compareDates = compareDates;
	exports.isValidDate = isValidDate;
	exports.setToStart = setToStart;
	exports.dateRange = dateRange;
	exports.isPlainObject = isPlainObject;
	exports.deepExtend = deepExtend;
	exports.transform = transform;
	exports.tmpl = tmpl;
	function $$(selector, ctx) {
	  var els = (ctx || document).querySelectorAll(selector);
	  return Array.prototype.slice.call(els);
	}

	function matches(el, selector) {
	  var matchesSelector = el.matches || el.matchesSelector || el.webkitMatchesSelector || el.msMatchesSelector;
	  return matchesSelector && matchesSelector.call(el, selector);
	}

	function closest(el, selector, top) {
	  var toofar = top && !top.contains(el);

	  while (el && !toofar) {
	    if (matches(el, selector)) return el;
	    toofar = top && !top.contains(el.parentNode);
	    el = el.parentNode;
	  }

	  return false;
	}

	function addClass(el, c) {
	  el.classList.add.apply(el.classList, c.split(' ').filter(Boolean));
	}

	function removeClass(el, c) {
	  el.classList.remove.apply(el.classList, c.split(' ').filter(Boolean));
	}

	function hasClass(el, c) {
	  return c && el.classList.contains(c);
	}

	function toggleClass(el, c, force) {
	  if (typeof force == 'undefined') force = !hasClass(el, c);
	  c && (!!force ? addClass(el, c) : removeClass(el, c));
	}

	function getDataAttributes(elem) {
	  var trim = function trim(s) {
	    return s.trim();
	  };
	  var obj = {};

	  if (!elem || !elem.dataset) return obj;

	  for (var key in elem.dataset) {
	    var val = elem.dataset[key];
	    if (/true|false/.test(val.toLowerCase())) {
	      val = val.toLowerCase() == 'true';
	    } else if (val[0] == '[' && val.substr(-1) == ']') {
	      val = transform(val.substr(1, val.length - 2).split(','), trim);
	    } else if (/^\d*$/.test(val)) {
	      val = parseInt(val, 10);
	    }

	    obj[key] = val;
	  }

	  return obj;
	}

	function isLeapYear(year) {
	  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
	}

	function getDaysInMonth(year, month) {
	  if (year instanceof Date) {
	    month = year.getMonth();
	    year = year.getFullYear();
	  }

	  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	}

	function dateInArray(date, array, dim) {
	  for (var i = 0; i < array.length; i++) {
	    var a = date;
	    var b = array[i];

	    if (dim == 'year') {
	      a = a.getFullYear();
	      b = b.getFullYear();
	    } else if (dim == 'month') {
	      a = a.getMonth();
	      b = b.getMonth();
	    } else {
	      a = a.getTime();
	      b = b.getTime();
	    }

	    if (a == b) {
	      return true;
	    }
	  }

	  return false;
	}

	function compareDates(a, b) {
	  return a.getTime() - b.getTime();
	}

	function isValidDate(date) {
	  return !!date && date instanceof Date && !isNaN(date.getTime());
	}

	function setToStart(date) {
	  return transform(date, function (d) {
	    if (d) d.setHours(0, 0, 0, 0);
	    return d;
	  });
	}

	function dateRange(start, end) {
	  start = new Date(start.getTime());
	  end = new Date(end.getTime());
	  var date = start;

	  if (start > end) {
	    start = end;
	    end = date;
	    date = start;
	  }

	  var dates = [new Date(date)];

	  while (date < end) {
	    date.setDate(date.getDate() + 1);
	    dates.push(new Date(date));
	  }

	  return dates;
	}

	function isPlainObject(obj) {
	  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object' && obj !== null) {
	    var proto = Object.getPrototypeOf(obj);
	    return proto === Object.prototype || proto === null;
	  }

	  return false;
	}

	function deepExtend(obj) {
	  var other = Array.prototype.slice.call(arguments, 1);

	  for (var i = 0; i < other.length; i++) {
	    for (var p in other[i]) {
	      if (obj[p] !== undefined && _typeof(other[i][p]) === 'object' && other[i][p] !== null && other[i][p].nodeName === undefined) {
	        if (other[i][p] instanceof Date) {
	          obj[p] = new Date(other[i][p].getTime());
	        }if (Array.isArray(other[i][p])) {
	          obj[p] = other[i][p].slice(0);
	        } else {
	          obj[p] = deepExtend(obj[p], other[i][p]);
	        }
	      } else {
	        obj[p] = other[i][p];
	      }
	    }
	  }

	  return obj;
	}

	function transform(obj, fn, ctx) {
	  var ret = [].concat(obj).map(fn, ctx);
	  return ret.length === 1 ? ret[0] : ret;
	}

	function tmpl(str, data) {
	  var fn = new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");

	  return data ? fn(data) : fn;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// Our default options
	exports.default = {
	  openOn: 'first',
	  inline: false,
	  multiple: false,
	  ranged: false,

	  min: false,
	  max: false,
	  within: false,
	  without: false,
	  yearRange: 5,
	  weekStart: 0,

	  separator: ',',

	  serialize: function serialize(date) {
	    return date.toLocaleDateString();
	  },
	  deserialize: function deserialize(str) {
	    return new Date(str);
	  },


	  onInit: false,
	  onChange: false,
	  onRender: false,
	  onNavigate: false,

	  i18n: {
	    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	  },

	  classNames: {
	    base: 'datepicker',
	    wrapper: 'datepicker__wrapper',
	    inline: 'is-inline',
	    selected: 'is-selected',
	    disabled: 'is-disabled',
	    highlighted: 'is-highlighted',
	    otherMonth: 'is-otherMonth',
	    weekend: 'is-weekend',
	    today: 'is-today'
	  },

	  templates: {
	    container: ['<div class="datepicker__container">', '<%= renderHeader() %>', '<%= renderCalendar() %>', '</div>'].join(''),

	    header: ['<header class="datepicker__header">', '<a class="datepicker__prev<%= (hasPrev) ? "" : " is-disabled" %>" data-prev>&lsaquo;</a>', '<span class="datepicker__title" data-title><%= renderMonthSelect() %></span>', '<span class="datepicker__title" data-title><%= renderYearSelect() %></span>', '<a class="datepicker__next<%= (hasNext) ? "" : " is-disabled" %>" data-next>&rsaquo;</a>', '</header>'].join(''),

	    calendar: ['<table class="datepicker__cal">', '<thead>', '<tr>', '<% weekdays.forEach(function(name) { %>', '<th><%= name %></th>', '<% }); %>', '</tr>', '</thead>', '<tbody>', '<% days.forEach(function(day, i) { %>', '<%= (i % 7 == 0) ? "<tr>" : "" %>', '<%= renderDay(day) %>', '<%= (i % 7 == 6) ? "</tr>" : "" %>', '<% }); %>', '</tbody>', '</table>'].join(''),

	    day: ['<% classNames.push("datepicker__day"); %>', '<td class="<%= classNames.join(" ") %>" data-day="<%= date %>"><div>', '<span class="datepicker__daynum"><%= daynum %></span>', '</div></td>'].join('')
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.updateInline = updateInline;
	exports.updateClassNames = updateClassNames;
	exports.deserializeMinMax = deserializeMinMax;
	exports.deserializeWithinWithout = deserializeWithinWithout;
	exports.deserializeOpenOn = deserializeOpenOn;
	exports.constrainWeekstart = constrainWeekstart;
	exports.bindOptionFunctions = bindOptionFunctions;
	exports.createTemplateRenderers = createTemplateRenderers;

	var _helpers = __webpack_require__(2);

	// update inline className
	function updateInline(isInline, opts) {
	  var inlineClass = opts.classNames.inline;


	  if (this.node) {
	    (0, _helpers.toggleClass)(this.node, inlineClass, isInline);
	    this.wrapper.style.position = isInline ? '' : 'absolute';
	    this.wrapper.style.display = isInline ? '' : 'none';
	  }

	  this._isOpen = isInline;
	  return isInline;
	}

	// update classNames
	function updateClassNames(classNames, opts) {
	  var baseClass = classNames.base;
	  var inlineClass = classNames.inline;
	  var wrapperClass = classNames.wrapper;
	  var isInline = opts.inline;


	  if (this.node) {
	    for (var key in classNames) {
	      switch (key) {
	        case 'base':
	        case 'inline':
	          this.node.className = baseClass + (isInline ? ' ' + inlineClass : '');
	          break;

	        case 'wrapper':
	          this.wrapper.className = wrapperClass;
	          break;
	      }
	    }
	  }

	  return classNames;
	}

	// deserialize min/max
	function deserializeMinMax(value, opts) {
	  var deserialize = opts.deserialize;

	  value = !value ? false : (0, _helpers.transform)(value, deserialize, this);
	  return (0, _helpers.isValidDate)(value) ? value : false;
	}

	// deserialze within/without
	function deserializeWithinWithout(arr, opts) {
	  var deserialize = opts.deserialize;


	  if (arr.length) {
	    arr = (0, _helpers.setToStart)((0, _helpers.transform)(arr, deserialize, this));
	    arr = [].concat(arr).filter(_helpers.isValidDate);
	  }

	  return arr.length ? arr : false;
	}

	// if needed, deserialize openOn and set the initial calendar month
	function deserializeOpenOn(openOn, opts) {
	  var deserialize = opts.deserialize;

	  // deserialize

	  if (typeof openOn == 'string' && !/^(first|last|today)$/.test(openOn)) {
	    openOn = deserialize.call(this, openOn);
	    if (!(0, _helpers.isValidDate)(openOn)) openOn = new Date();
	  }

	  // set the initial calendar date
	  if (!this._month) {
	    var date = openOn;

	    if (typeof date === 'string' || !(0, _helpers.isValidDate)(date)) date = new Date();

	    date = (0, _helpers.setToStart)(new Date(date.getTime()));
	    date.setDate(1);

	    this._month = date;
	  }

	  return openOn;
	}

	// constrain weekstart
	function constrainWeekstart(weekstart) {
	  return Math.min(Math.max(weekstart, 0), 6);
	}

	// bind option functions
	function bindOptionFunctions(fn) {
	  return typeof fn === 'function' ? fn.bind(this) : false;
	}

	// template functions
	function createTemplateRenderers(templates) {
	  this._renderers = this._renderers || {};

	  for (var name in templates) {
	    this._renderers[name] = (0, _helpers.tmpl)(templates[name]);
	  }

	  return templates;
	}

/***/ }
/******/ ])
});
;