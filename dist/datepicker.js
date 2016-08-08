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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(2);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _options = __webpack_require__(4);

	var _build = __webpack_require__(5);

	var _events = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Datepicker
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
	var Datepicker = function () {
	  function Datepicker(elem, opts) {
	    var _this = this;

	    _classCallCheck(this, Datepicker);

	    this._initOptions = _options._initOptions;
	    this._initDOM = _build._initDOM;
	    this._initEvents = _events._initEvents;
	    this._onmousedown = _events._onmousedown;
	    this._onmousemove = _events._onmousemove;
	    this._onmouseup = _events._onmouseup;
	    this._onclick = _events._onclick;


	    // we have a selector
	    if (typeof elem === 'string') {
	      return (0, _utils.transform)((0, _utils.$$)(elem), function (el) {
	        return new _this.constructor(el, opts);
	      });
	    }

	    // no element?
	    if (!elem) {
	      elem = document.createElement('input');
	    }

	    // we need to know if the elem is an input
	    var isInput = 'input' === elem.tagName.toLowerCase();
	    var inputType = !isInput ? false : elem.type.toLowerCase();

	    // make sure it's a valid input type
	    if (isInput && !(inputType === 'text' || inputType === 'hidden')) elem.type = 'text';

	    // save this
	    this._el = elem;

	    // initialize options
	    this._initOptions(opts);

	    // initialize the dom
	    this._initDOM(elem);

	    // initialize event listeners
	    this._initEvents();

	    // set the initial value
	    this.value = isInput ? elem.value : elem.dataset.value || '';

	    // callback option
	    if (this._opts.onInit) opts.onInit.call(this, elem);
	  }

	  /*
	   * Initialize options
	   */


	  /*
	   * Initialize DOM
	   */


	  /*
	   * Event methods
	   */


	  _createClass(Datepicker, [{
	    key: 'set',


	    /**
	     * Set options
	     *
	     * @param {(string|Object)} prop - Option key, or object of properties
	     * @param {mixed} [value] - Value of option (not used if object present)
	     * @param {boolean} [noRedraw] - Do not redraw the calendar afterwards
	     */
	    value: function set(key, val) {
	      if (!key) return;

	      // iterate over the object
	      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
	        var obj = (0, _utils.deepExtend)({}, this.constructor.defaults, key);
	        for (var k in obj) {
	          this.set(k, obj[k], true);
	        }if (this._isOpen) this.render();
	        return this._opts;
	      }

	      // setting part of object
	      if (key.indexOf('.') > 0) {
	        var _k = key.split('.');
	        var v = val;

	        key = _k.unshift();
	        val = {};

	        _k.reduce(function (r, o) {
	          return val[o] = {};
	        }, val);
	        val[_k[_k.length - 1]] = v;
	      }

	      // default opts to pass to setters
	      var opts = (0, _utils.deepExtend)({}, this._opts, this.constructor.defaults);

	      // fix the value
	      if (key in this._setters) {
	        val = this._setters[key](val, opts);
	      }

	      if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') val = (0, _utils.deepExtend)({}, val, this.constructor.defaults[key]);

	      // actually set the value
	      this._opts[key] = val;

	      // rerender
	      // if (!this._isOpen) this.render()

	      // return value
	      return val;
	    }

	    /**
	     * Get an option
	     *
	     * @param {string} key - Option key
	     */

	  }, {
	    key: 'get',
	    value: function get(key) {
	      return this._opts[key];
	    }

	    /**
	     * Update the bound element and trigger `onUpdate` callback
	     */

	  }, {
	    key: 'update',
	    value: function update() {
	      if (this._el.nodeName.toLowerCase() === 'input') {
	        this._el.value = this.value;
	      } else {
	        this._el.dataset.value = this.value;
	      }

	      if (typeof this._opts.onUpdate === 'function') {
	        this._opts.onUpdate.call(this, this.getSelected());
	      }
	    }

	    /**
	     * Open the calendar to a specific date (or `openOn` date);
	     *
	     * @param {string|Date} [date=openOn] - The date to open to
	     */

	  }, {
	    key: 'open',
	    value: function open(date) {
	      var selected = [].concat(this.getSelected());
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
	      if (!(0, _utils.isValidDate)(date)) {
	        date = new Date();
	      }

	      // set calendar to date and show it
	      this.goToDate(date);
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
	      date = (0, _utils.setToStart)(this._opts.deserialize(date));
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
	      date = (0, _utils.setToStart)(this._opts.deserialize(date));
	      return !!this._selected[date.getTime()];
	    }

	    /**
	     * Add a date to the value
	     *
	     * @param {(string|Date)} date - The date to add
	     */

	  }, {
	    key: 'addDate',
	    value: function addDate(date) {
	      this.toggleDates(date, true);
	    }

	    /**
	     * Remove a date from the value
	     *
	     * @param {(string|Date)} date - The date to remove
	     */

	  }, {
	    key: 'removeDate',
	    value: function removeDate(date) {
	      this.toggleDates(date, false);
	    }

	    /**
	     * Toggle a date selection
	     *
	     * @param {(string|Date)} date - Date to toggle
	     * @param {boolean} [force] - Force to selected/deselected
	     */

	  }, {
	    key: 'toggleDates',
	    value: function toggleDates(dates, force) {
	      var _this2 = this;

	      var _opts = this._opts;
	      var multiple = _opts.multiple;
	      var deserialize = _opts.deserialize;

	      dates = [].concat(dates).filter(function (d) {
	        return !!d && _this2.dateAllowed(d);
	      });

	      dates.forEach(function (d) {
	        d = (0, _utils.setToStart)(deserialize(d));
	        var t = d.getTime();

	        // add the date
	        if (!_this2._selected[t] && (force === undefined || !!force)) {

	          // clear old value
	          if (!multiple) _this2._selected = {};

	          _this2._selected[t] = d;

	          // remove the date
	        } else if (_this2._selected[t] && !force) {
	          delete _this2._selected[t];
	        }
	      });

	      this.update();
	    }

	    /**
	     * Get the selected dates
	     */

	  }, {
	    key: 'getSelected',
	    value: function getSelected() {
	      var selected = [];
	      for (var t in this._selected) {
	        selected.push(this._selected[t]);
	      }return this._opts.multiple ? selected.sort(_utils.compareDates) : selected[0];
	    }

	    /**
	     * Get the value
	     */

	  }, {
	    key: 'dateAllowed',


	    /**
	     * Check if a date is allowed in the datepicker
	     *
	     * @param {(string|Date)} date - The date to check
	     * @param {string} [dim] - The dimension to check ('year' or 'month')
	     */
	    value: function dateAllowed(date, dim) {
	      var _opts2 = this._opts;
	      var min = _opts2.min;
	      var max = _opts2.max;
	      var within = _opts2.within;
	      var without = _opts2.without;
	      var deserialize = _opts2.deserialize;

	      var belowMax = void 0,
	          aboveMin = belowMax = true;

	      date = (0, _utils.setToStart)(deserialize(date));

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

	      return aboveMin && belowMax && (!without || !(0, _utils.dateInArray)(date, without, dim)) && (!within || (0, _utils.dateInArray)(date, within, dim));
	    }

	    /**
	     * render the calendar HTML
	     */

	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      var opts = this._opts;
	      var renderCache = {};

	      // avoid duplicate calls to getCalendar
	      var getData = function getData(i) {
	        return renderCache[i] || (renderCache[i] = _this3.getCalendar(i));
	      };

	      // generic render header
	      var _renderHeader = function _renderHeader(data) {
	        var _date = data._date;
	        var index = data.index;
	        var month = data.month;
	        var year = data.year;


	        return _this3._renderers.header(_extends({}, data, {

	          // render month select
	          renderMonthSelect: function renderMonthSelect() {
	            var i = arguments.length <= 0 || arguments[0] === undefined ? index : arguments[0];

	            var d = new Date(_date.getTime());
	            var o = [];

	            for (var m = 0; m < 12; m++) {
	              if (_this3.dateAllowed(d.setMonth(m), 'month')) o.push(opts.i18n.months[m]);
	            }

	            return _this3._renderers.select({ o: o, i: i, t: 'month', c: month });
	          },

	          // render year select
	          renderYearSelect: function renderYearSelect() {
	            var i = arguments.length <= 0 || arguments[0] === undefined ? index : arguments[0];

	            var d = new Date(_date.getTime());
	            var y = year - opts.yearRange;
	            var max = year + opts.yearRange;
	            var o = [];

	            for (; y <= max; y++) {
	              if (_this3.dateAllowed(d.setFullYear(y), 'year')) o.push(y);
	            }

	            return _this3._renderers.select({ o: o, i: i, t: 'year', c: year });
	          }
	        }));
	      };

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

	          return _this3._renderers.calendar(_extends({}, data, {

	            // render header within calendar
	            renderHeader: function renderHeader() {
	              return _renderHeader(data);
	            },

	            // render day
	            renderDay: function renderDay(day) {
	              return _this3._renderers.day(day);
	            }
	          }));
	        }
	      });
	    }

	    /**
	     * Get an object containing data for a calendar month
	     *
	     * @param {integer} [i=0] - Offset month to render
	     */

	  }, {
	    key: 'getCalendar',
	    value: function getCalendar() {
	      var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	      var opts = this._opts;
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
	      prevMonth.setDate((0, _utils.getDaysInMonth)(prevMonth));

	      // collect the days' data
	      var days = [];

	      // setup the start day
	      var start = date.getDay() - opts.weekStart;
	      while (start < 0) {
	        start += 7;
	      } // number of days in the month, padded to fit a calendar
	      var dayCount = (0, _utils.getDaysInMonth)(year, month) + start;
	      while (dayCount % 7) {
	        dayCount += 1;
	      } // today!
	      var today = (0, _utils.setToStart)(new Date());

	      // loop through the calendar days
	      for (var i = 0; i < dayCount; i++) {
	        var day = new Date(year, month, 1 + (i - start));
	        var dayMonth = day.getMonth();
	        var isPrevMonth = dayMonth < month;
	        var isNextMonth = dayMonth > month;
	        var weekday = day.getDay();

	        // basic day data
	        days.push({
	          _date: day,

	          date: opts.serialize(day),
	          daynum: day.getDate(),
	          weekday: opts.i18n.weekdays[weekday],
	          weekdayShort: opts.i18n.weekdaysShort[weekday],

	          isToday: day.getTime() === today.getTime(),
	          isWeekend: weekday === 0 || weekday === 6,
	          isSelected: this.hasDate(day),
	          isDisabled: !this.dateAllowed(day),
	          isThisMonth: !isPrevMonth && !isNextMonth,
	          isPrevMonth: isPrevMonth,
	          isNextMonth: isNextMonth
	        });
	      }

	      // return the calendar data
	      return {
	        _date: date,
	        weekdays: opts.i18n.weekdays,
	        weekdaysShort: opts.i18n.weekdaysShort,
	        month: opts.i18n.months[month],
	        year: year, days: days,

	        hasNext: !opts.max || nextMonth <= opts.max,
	        hasPrev: !opts.min || prevMonth >= opts.min
	      };
	    }
	  }, {
	    key: 'value',
	    get: function get() {
	      var selected = (0, _utils.transform)(this.getSelected() || [], this._opts.serialize, this);
	      return [].concat(selected).join(this._opts.separator);
	    }

	    /**
	     * Set the value to a specific date
	     *
	     * @param {string} value - The date value
	     */
	    ,
	    set: function set(val) {
	      this._selected = {};
	      this.addDate(val.split(this._opts.separator));
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

	exports.$ = $;
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
	exports.deepExtend = deepExtend;
	exports.transform = transform;
	exports.tmpl = tmpl;
	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector);
	}

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
	    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	  },

	  classNames: {
	    base: 'datepicker',
	    wrapper: 'datepicker__wrapper',
	    inline: 'is-inline',
	    selected: 'is-selected',
	    highlight: 'is-highlighted'
	  },

	  templates: {
	    container: ['<div class="datepicker__container">', '<%= renderHeader() %>', '<%= renderCalendar() %>', '</div>'].join(''),

	    header: ['<header class="datepicker__header">', '<a class="datepicker__prev<%= (hasPrev) ? "" : " is-disabled" %>" data-prev>&lsaquo;</a>', '<span class="datepicker__title" data-title><%= month %><%= renderMonthSelect() %></span>', '<span class="datepicker__title" data-title><%= year %><%= renderYearSelect() %></span>', '<a class="datepicker__next<%= (hasNext) ? "" : " is-disabled" %>" data-next>&rsaquo;</a>', '</header>'].join(''),

	    calendar: ['<table class="datepicker__cal">', '<thead>', '<tr>', '<% weekdaysShort.forEach(function(name) { %>', '<th><%= name %></th>', '<% }); %>', '</tr>', '</thead>', '<tbody>', '<% days.forEach(function(day, i) { %>', '<%= (i % 7 == 0) ? "<tr>" : "" %>', '<%= renderDay(day) %>', '<%= (i % 7 == 6) ? "</tr>" : "" %>', '<% }); %>', '</tbody>', '</table>'].join(''),

	    day: ['<% var cls = ["datepicker__day"]; %>', '<% if (isSelected) cls.push("is-selected"); %>', '<% if (isDisabled) cls.push("is-disabled"); %>', '<% if (!isThisMonth) cls.push("is-otherMonth"); %>', '<% if (isToday) cls.push("is-today"); %>', '<td class="<%= cls.join(" ") %>" data-day="<%= date %>"><div>', '<span class="datepicker__daynum"><%= daynum %></span>', '</div></td>'].join('')
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports._initOptions = _initOptions;

	var _utils = __webpack_require__(2);

	// update inline className
	function updateInline(isInline, opts) {
	  var inlineClass = opts.classNames.inline;

	  if (this.node) (0, _utils.toggleClass)(this.node, inlineClass, isInline);
	  return isInline;
	}

	// deserialize min/max
	function deserializeMinMax(value, opts) {
	  var deserialize = opts.deserialize;

	  value = !value ? false : (0, _utils.transform)(value, deserialize, this);
	  return (0, _utils.isValidDate)(value) ? value : false;
	}

	// deserialze within/without
	function deserializeWithinWithout(arr, opts) {
	  var deserialize = opts.deserialize;


	  if (arr.length) {
	    arr = (0, _utils.setToStart)((0, _utils.transform)(arr, deserialize, this));
	    arr = [].concat(arr).filter(_utils.isValidDate);
	  }

	  return arr.length ? arr : false;
	}

	// if needed, deserialize openOn and set the initial calendar month
	function deserializeOpenOn(openOn, opts) {
	  var deserialize = opts.deserialize;

	  // deserialize

	  if (typeof openOn == 'string' && !/^(first|last|today)$/.test(openOn)) openOn = deserialize.call(this, openOn);

	  // set the initial calendar date
	  if (!this._month) {
	    var date = openOn;

	    if (typeof date === 'string' || !(0, _utils.isValidDate)(date)) date = new Date();

	    date = (0, _utils.setToStart)(new Date(date.getTime()));
	    date.setDate(1);

	    this._month = date;
	  }

	  return (0, _utils.isValidDate)(openOn) ? openOn : new Date();
	}

	// constrain weekstart
	function constrainWeekstart(weekstart) {
	  return Math.min(Math.max(weekstart, 0), 6);
	}

	// template functions
	function createTemplateRenderers(templates) {
	  this._renderers = this._renderers || {};

	  for (var name in templates) {
	    this._renderers[name] = (0, _utils.tmpl)(templates[name]);
	  }

	  return templates;
	}

	// initialize options
	function _initOptions(opts) {
	  this._opts = {};

	  // options pass through here before being set
	  var inline = updateInline.bind(this);
	  var minMax = deserializeMinMax.bind(this);
	  var withInOut = deserializeWithinWithout.bind(this);
	  var openOn = deserializeOpenOn.bind(this);
	  var weekstart = constrainWeekstart.bind(this);
	  var templates = createTemplateRenderers.bind(this);

	  this._setters = {
	    inline: inline,
	    min: minMax,
	    max: minMax,
	    within: withInOut,
	    without: withInOut,
	    openOn: openOn,
	    weekstart: weekstart,
	    templates: templates
	  };

	  // set all the options
	  this.set((0, _utils.deepExtend)({}, opts, (0, _utils.getDataAttributes)(this._el)), null, true);

	  // render select template
	  this._renderers.select = (0, _utils.tmpl)(['<select data-<%= t %>="<%= c %>" data-index="<%= i %>">', '<% for (var j = 0; j < o.length; j++) { %>', '<% var v = (t === "year") ? o[j] : j; %>', '<option value="<%= v %>"<%= (v === c) ? " selected" : "" %>>', '<%= o[j] %>', '</option>', '<% } %>', '</select>'].join(''));
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports._initDOM = _initDOM;
	function _initDOM(elem) {
	  var _opts = this._opts;
	  var isInline = _opts.inline;
	  var _opts$classNames = _opts.classNames;
	  var baseClass = _opts$classNames.base;
	  var inlineClass = _opts$classNames.inline;
	  var wrapperClass = _opts$classNames.wrapper;

	  // create the datepicker element

	  this.node = document.createElement('div');
	  this.node.className = baseClass + (isInline ? ' ' + inlineClass : '');

	  // create the wrapping element
	  this.wrapper = document.createElement('div');
	  this.wrapper.className = wrapperClass;

	  // insert our element into the dom
	  if (this._el.parentNode) this._el.parentNode.insertBefore(this.node, this._el);

	  // put stuff in our element
	  this.node.appendChild(this._el);
	  this.node.appendChild(this.wrapper);
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports._initEvents = _initEvents;
	exports._onmousedown = _onmousedown;
	exports._onmousemove = _onmousemove;
	exports._onmouseup = _onmouseup;
	exports._onclick = _onclick;

	var _utils = __webpack_require__(2);

	/*
	 * bind event listeners
	 */
	function _initEvents() {
	  var _this = this;

	  // already initialized
	  if (this._isInitialized) return;

	  // this will help with click & drag selecting
	  this._highlighted = [];

	  // bind context
	  this.open = this.open.bind(this);
	  this.toggle = this.toggle.bind(this);
	  this._onmousedown = this._onmousedown.bind(this);
	  this._onmousemove = this._onmousemove.bind(this);
	  this._onmouseup = this._onmouseup.bind(this);
	  this._onclick = this._onclick.bind(this);

	  // on focus (or click), open the datepicker
	  if ('input' !== this._el.tagName.toLowerCase()) {
	    this._el.addEventListener('click', this.toggle);
	  } else {
	    this._el.addEventListener('focus', this.open);
	  }

	  // if we click outside of our element, hide it
	  document.addEventListener('mousedown', function (e) {
	    if (!_this.node.contains(e.target)) _this.hide();
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

	/*
	 * when we mousedown on a "date node," highlight it and start the selection
	 */
	function _onmousedown(e) {
	  var deserialize = this._opts.deserialize;

	  var dateNode = (0, _utils.closest)(e.target, '[data-date]', this.node);

	  if (dateNode) {
	    addClass(dateNode, 'is-highlighted');
	    this._highlighted = [deserialize(dateNode.dataset.date)];
	    this._isDragging = true;
	  }
	}

	/*
	 * we're making a selection, and we're allowed to highlight them
	 */
	function _onmousemove(e) {
	  var _this2 = this;

	  var _opts = this._opts;
	  var multiple = _opts.multiple;
	  var serialize = _opts.serialize;
	  var deserialize = _opts.deserialize;
	  var highlighted = _opts.classNames.highlighted;


	  if (!multiple) return;

	  var startDate = this._highlighted[0];
	  var dateNode = (0, _utils.closest)(e.target, '[data-date]', this.node);
	  var date = dateNode ? deserialize(dateNode.dataset.date) : null;

	  if (date && this._isDragging && !(0, _utils.compareDates)(date, this._highlighted[0])) {
	    this._highlighted = (0, _utils.dateRange)(this._highlighted[0], date);

	    (0, _utils.$$)('[data-date].' + highlighted, this.wrapper).forEach(function (el) {
	      removeClass(el, highlighted);
	    });

	    this._highlighted.map(serialize).forEach(function (d) {
	      (0, _utils.$$)('[data-date="' + d + '"]', _this2.wrapper).forEach(function (el) {
	        toggleClass(el, highlighted);
	      });
	    });
	  }
	}

	/*
	 * we've finished the potential selection
	 */
	function _onmouseup(e) {
	  var _this3 = this;

	  var _opts2 = this._opts;
	  var multiple = _opts2.multiple;
	  var serialize = _opts2.serialize;
	  var _opts2$classNames = _opts2.classNames;
	  var highlighted = _opts2$classNames.highlighted;
	  var selected = _opts2$classNames.selected;

	  // remove the highlighting

	  (0, _utils.$$)('[data-date].' + highlighted, this.wrapper).forEach(function (el) {
	    removeClass(el, highlighted);
	  });

	  // make sure we've got at least one
	  if (!this._highlighted.length) return;

	  // only do this stuff if we've made a selection
	  if (this._isDragging && (0, _utils.closest)(e.target, '[data-date]', this.node)) {

	    // actually make the selection
	    this.toggleDates(this._highlighted);

	    // update the elements without refreshing the calendar
	    this._highlighted.map(serialize).forEach(function (d) {
	      (0, _utils.$$)('[data-date="' + d + '"]', _this3.wrapper).forEach(function (el) {
	        toggleClass(el, selected, _this3.hasDate(d));
	      });
	    });

	    // you can't select multiple, hide the calendar
	    if (!multiple) {
	      (0, _utils.$$)('[data-date].' + selected, this.wrapper).forEach(function (el) {
	        toggleClass(el, selected, _this3.hasDate(el.dataset.date));
	      });

	      this.hide();
	    }
	  }

	  // reset this stuff
	  this._isDragging = false;
	  this._highlighted = [];
	}

	/*
	 * what did you click?
	 */
	function _onclick(e) {
	  var _this4 = this;

	  // previous month
	  if (e.target.hasAttribute('data-prev')) {
	    this.prevMonth(e.target.dataset.prev);

	    // next month
	  } else if (e.target.hasAttribute('data-next')) {
	    this.nextMonth(e.target.dataset.next);

	    // clicked the year select but it hasn't been bound
	  } else if (e.target.hasAttribute('data-year') && !e.target.onchange) {
	    e.target.onchange = function () {
	      var c = e.target.dataset.year;
	      var y = _this4._month.getFullYear();
	      _this4._month.setFullYear(parseInt(e.target.value) - (c - y));
	      _this4.render();
	    };

	    // clicked the month select but it hasn't been bound
	  } else if (e.target.hasAttribute('data-month') && !e.target.onchange) {
	    e.target.onchange = function () {
	      _this4._month.setMonth(e.target.value - e.target.dataset.index);
	      _this4.render();
	    };
	  }
	}

/***/ }
/******/ ])
});
;