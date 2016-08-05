/******/ (function(modules) { // webpackBootstrap
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
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

	    // we have a selector
	    if (typeof elem === 'string') {
	      return transform($$(elem), function (el) {
	        return new Datepicker(el, opts);
	      });
	    }

	    // no element?
	    if (!elem) {
	      elem = document.createElement('input');
	    }

	    // set internals
	    this._d = {};
	    this._o = {};

	    // extend default options
	    opts = extend({}, Datepicker.defaults, opts, getDataAttributes(elem));

	    // set serialize & deserialize options first, they're important
	    this.set('serialize', opts.serialize, true);
	    this.set('deserialize', opts.deserialize, true);

	    // set all the options
	    opts = this.set(opts, null, true);

	    // set the initial calendar date
	    var date = opts.openOn;
	    if (typeof date === 'string' || !isValidDate(date)) date = new Date();
	    this._c = setToStart(new Date(date.getTime()));
	    this._c.setDate(1);

	    // render select template
	    this._renderSelect = tmpl(['<select data-<%= t %>="<%= c %>" data-cal="<%= i %>">', '<% for (var j = 0 j < o.length j++) { %>', '<% var v = (t == "year") ? o[j] : j %>', '<option value="<%= v %>" <%= (v == c) ? "selected" : "" %>>', '<%= o[j] %></option>', '<% } %>', '</select>'].join(''));

	    // responsive options
	    var origOpts = extend({}, opts);
	    delete origOpts.responsive;
	    this._r = [];

	    var mQuery = void 0;
	    var queryTimeout = void 0;
	    var matchedOpts = {};
	    var queryMatched = false;

	    for (mQuery in opts.responsive) {
	      this._r.push(window.matchMedia(mQuery));
	    }

	    var queryResponsiveOpts = function queryResponsiveOpts() {
	      for (var i = 0; i < _this._r.length; i++) {
	        var mq = _this._r[i];

	        if (mq.matches) {
	          extend(matchedOpts, opts.responsive[mq.media] || {});
	          queryMatched = true;
	        }
	      }

	      if (queryTimeout) window.clearTimeout(queryTimeout);
	      queryTimeout = window.setTimeout(function () {
	        _this.set(queryMatched ? matchedOpts : origOpts);
	        matchedOpts = extend({}, origOpts);
	        queryMatched = false;
	      }, 100);
	    };

	    window.addEventListener('resize', queryResponsiveOpts, false);
	    queryResponsiveOpts();

	    /* Setup DOM */

	    // let's save this
	    this.elem = elem;

	    // create the datepicker element
	    this.node = document.createElement('div');
	    addClass(this.node, 'datepicker' + (opts.inline ? ' ' : ' has-popup ') + opts.class);
	    if (opts.calendars > 1) addClass(this.node, 'is-multiple');

	    // create the container element
	    this.container = document.createElement('div');
	    addClass(this.container, 'datepicker__container');

	    // insert our element into the dom
	    if (elem.parentNode) elem.parentNode.insertBefore(this.node, elem);

	    // put stuff in our element
	    this.node.appendChild(elem);
	    this.node.appendChild(this.container);

	    // we need to know if the elem is an input
	    var isInput = this._isInput = /input|textarea/i.test(elem.tagName);
	    var inputType = !isInput ? false : elem.type.toLowerCase();

	    // make sure it's a valid input type
	    if (isInput && !(inputType == 'text' || inputType == 'hidden')) elem.type = 'text';

	    /* Add Events */

	    // on focus (or click), open the datepicker
	    if (isInput) {
	      elem.addEventListener('focus', function () {
	        return _this.open();
	      });
	    } else {
	      elem.addEventListener('click', function () {
	        if (hasClass(_this.node, 'is-visible')) {
	          _this.hide();
	        } else {
	          _this.open();
	        }
	      });
	    }

	    // if we click outside of our element, hide it
	    document.addEventListener('mousedown', function (e) {
	      if (!_this.node.contains(e.target)) {
	        _this.hide();
	      }
	    });

	    // this will help with click & drag selecting
	    var mousedown = false;
	    var startNode = void 0,
	        startDate = void 0;
	    var selection = [];

	    // don't actually select text, please
	    this.node.onselectstart = function () {
	      return false;
	    };

	    // when we mousedown on a "date node," highlight it and start the selection
	    this.node.addEventListener('mousedown', function (e) {
	      var dateNode = closest(e.target, '[data-date]', _this.node);

	      if (dateNode) {
	        addClass(dateNode, 'is-highlighted');
	        startDate = opts.deserialize(dateNode.dataset.date);
	        startNode = dateNode;
	        mousedown = true;
	      }
	    });

	    // we've finished the potential selection
	    this.node.addEventListener('mouseup', function (e) {

	      // remove the highlighting
	      $$('[data-date].is-highlighted', _this.container).forEach(function (el) {
	        removeClass(el, 'is-highlighted');
	      });

	      // only do this stuff if we've made a selection
	      if (mousedown && closest(e.target, '[data-date]', _this.node)) {

	        // make sure we've got at least one
	        if (startNode && !selection.length) {
	          selection.push(opts.serialize(startDate));
	        }

	        // actually make the selection
	        _this.toggleValue(selection);

	        // update the elements without refreshing the calendar
	        selection.forEach(function (d) {
	          $$('[data-date="' + d + '"]', _this.container).forEach(function (el) {
	            toggleClass(el, 'is-selected', _this.hasDate(d));
	          });
	        });

	        // you can't select multiple, hide the calendar
	        if (!opts.multiple) {
	          $$('[data-date].is-selected', _this.container).forEach(function (el) {
	            toggleClass(el, 'is-selected', _this.hasDate(el.dataset.date));
	          });

	          _this.hide();
	        }
	      }

	      // reset this stuff
	      mousedown = false;
	      startNode = null;
	      startDate = null;
	      selection = [];
	    });

	    // we're making a selection, and we're allowed to highlight them
	    this.node.addEventListener('mouseover', function (e) {
	      var dateNode = closest(e.target, '[data-date]', _this.node);
	      if (opts.multiple && dateNode && mousedown && startNode != e.target) {
	        var _date = opts.deserialize(dateNode.dataset.date);
	        selection = transform(dateRange(startDate, _date), opts.serialize);
	        selection = [].concat(selection);

	        $$('[data-date].is-highlighted', _this.container).forEach(function (el) {
	          removeClass(el, 'is-highlighted');
	        });

	        selection.forEach(function (d) {
	          $$('[data-date="' + d + '"]', _this.container).forEach(function (el) {
	            toggleClass(el, 'is-highlighted');
	          });
	        });
	      }
	    });

	    // what did you click?
	    this.node.addEventListener('click', function (e) {

	      // previous month
	      if (e.target.hasAttribute('data-prev')) {
	        _this.prevMonth(opts.paginate);

	        // next month
	      } else if (e.target.hasAttribute('data-next')) {
	        _this.nextMonth(opts.paginate);

	        // clicked the year select but it hasn't been bound
	      } else if (e.target.hasAttribute('data-year') && !e.target.hasAttribute('data-bound')) {

	        e.target.dataset.bound = true;
	        e.target.addEventListener('change', function () {
	          var c = e.target.dataset.year;
	          var y = _this._c.getFullYear();
	          _this._c.setFullYear(parseInt(e.target.value) - (c - y));
	          _this.draw();
	        });

	        // clicked the month select but it hasn't been bound
	      } else if (e.target.hasAttribute('data-month') && !e.target.hasAttribute('data-bound')) {

	        e.target.dataset.bound = true;
	        e.target.addEventListener('change', function () {
	          _this._c.setMonth(e.target.value - e.target.dataset.cal);
	          _this.draw();
	        });
	      }
	    }, false);

	    // the initial value of our element
	    var elemValue = isInput ? elem.value : elem.dataset.value || '';

	    // set date(s) from the initial value
	    this.setValue(elemValue.split(opts.separator).map(function (str) {
	      return str ? opts.deserialize(str) : false;
	    }).filter(isValidDate));

	    // callback option
	    if (opts.onInit) opts.onInit.call(this, elem);

	    // draw the calendar for the first time
	    this.draw();
	  }

	  /**
	   * Set options
	   *
	   * @param {(string|Object)} prop - Option key, or object of properties
	   * @param {mixed} [value] - Value of option (not used if object present)
	   * @param {boolean} [noRedraw] - Do not redraw the calendar afterwards
	   */


	  _createClass(Datepicker, [{
	    key: 'set',
	    value: function set(key, val, noRedraw) {
	      var o = this._o;

	      if (!key) return;

	      // iterate over the object
	      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
	        for (var k in key) {
	          this.set(k, key[k], true);
	        }if (!noRedraw && this.container) this.draw();
	        return o;
	      }

	      // fix the value
	      switch (key) {

	        // update dom attributes
	        case 'inline':
	          this.node && toggleClass(this.node, 'is-' + key, val);
	          break;

	        // deserialize min/max
	        case 'min':
	        case 'max':
	          val = !val ? false : transform(val, o.deserialize, this);
	          if (!isValidDate(val)) val = false;
	          break;

	        // deserialze within/without
	        case 'within':
	        case 'without':
	          if (!!val && !val.length) val = false;
	          if (!!val) val = [].concat(setToStart(transform(val, o.deserialize, this))).filter(isValidDate);
	          break;

	        // if needed, deserialize openOn
	        case 'openOn':
	          if (typeof val == 'string' && !/^(first|last|today)$/.test(val)) {
	            val = o.deserialize.call(this, val);
	            if (!isValidDate(val)) val = new Date();
	          }
	          break;

	        // constrain integers
	        case 'paginate':
	        case 'calendars':
	          val = Math.max(val, 1);
	          if (key === 'calendars' && this.node) {
	            toggleClass(this.node, 'is-multiple', val > 1);
	          }
	          break;
	        case 'weekstart':
	          val = Math.min(Math.max(val, 0), 6);
	          break;
	        case 'index':
	          val = Math.min(Math.max(val, 0), o.calendars);
	          break;

	        // responsive object always extends old one
	        case 'responsive':
	          if (val[key]) delete val[key];
	          val = extend({}, this.get(key), val);
	          break;

	        // i18n
	        case 'i18n':
	          val = extend({}, o.i18n, val);
	          break;
	        case 'i18n.months':
	        case 'i18n.weekdays':
	        case 'i18n.weekdaysShort':
	          o.i18n = o.i18n || extend({}, Datepicker.defaults.i18n);
	          o.i18n[key.substr(6)] = val;
	          break;

	        // template functions
	        case 'templates':
	          for (var k in val) {
	            this.set('templates.' + k, val[k], true);
	          }break;
	        case 'templates.calendar':
	        case 'templates.header':
	        case 'templates.day':
	          this['_render' + key[10].toUpperCase() + key.substr(11)] = tmpl(val);
	          o.templates = o.templates || extend({}, Datepicker.defaults.templates);
	          o.templates[key.substr(10)] = val;
	          break;

	        // these are required to be functions
	        case 'serialize':
	        case 'deserialize':
	        case 'onInit':
	        case 'onUpdate':
	          val = typeof val === 'function' ? val : Datepicker.defaults[key];
	          break;

	        // don't do anything
	        default:
	          break;
	      }

	      // actually set the value and optionally redraw
	      if (key.indexOf('.') < 0) this._o[key] = val;
	      if (!noRedraw && this.container) this.draw();
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
	      return this._o[key];
	    }

	    /**
	     * Update the bound element and trigger `onUpdate` callback
	     */

	  }, {
	    key: 'update',
	    value: function update() {
	      var opts = this._o;

	      if (this._isInput) {
	        this.elem.value = this.toString();
	      } else {
	        this.elem.dataset.value = this.toString();
	      }

	      if (opts.onUpdate) {
	        opts.onUpdate.call(this, this.getValue());
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
	      var dates = [].concat(this.getValue());
	      date = date || this._o.openOn || this._c;

	      // we have a string
	      if (typeof date === 'string') {
	        date = date.toLowerCase();

	        // first, last, deserialize, or open to today later
	        if (date === 'first' && dates.length) {
	          date = dates[0];
	        } else if (date === 'last' && dates.length) {
	          date = dates[dates.length - 1];
	        } else if (date !== 'today') {
	          date = this._o.deserialize(date);
	        }
	      }

	      // still not valid? then open to today
	      if (!isValidDate(date)) date = new Date();

	      // set calendar to date and show it
	      this.goToDate(date);
	      this.show();
	    }

	    /**
	     * Add classes to show the datepicker
	     */

	  }, {
	    key: 'show',
	    value: function show() {
	      if (!this._o.inline) {
	        var elBottom = this.elem.offsetTop + this.elem.offsetHeight;
	        addClass(this.node, 'is-visible');

	        this.container.style.top = elBottom + 'px';
	        var rect = this.container.getBoundingClientRect();
	        var posRight = rect.right > window.innerWidth;
	        var posTop = rect.bottom > window.innerHeight;
	        toggleClass(this.container, 'position-right', posRight);
	        toggleClass(this.container, 'position-top', posTop);
	        if (posTop) this.container.style.top = '';

	        rect = this.container.getBoundingClientRect();
	        var fitLeft = rect.right >= rect.width;
	        var fitTop = rect.bottom > rect.height;
	        toggleClass(this.container, 'position-right', posRight && fitLeft);
	        toggleClass(this.container, 'position-top', posTop && fitTop);
	        if (posTop & !fitTop) this.container.style.top = elBottom + 'px';
	      }
	    }

	    /**
	     * Remove classes to hide the datepicker
	     */

	  }, {
	    key: 'hide',
	    value: function hide() {
	      if (!this._o.inline) {
	        removeClass(this.node, 'is-visible');
	        removeClass(this.container, 'position-right position-top');
	      }
	    }

	    /**
	     * Go to the next month
	     *
	     * @param {integer} [paginate] - How many months to skip
	     */

	  }, {
	    key: 'nextMonth',
	    value: function nextMonth(paginate) {
	      paginate = Math.max(paginate || 1, 1);
	      var date = new Date(this._c.getTime());
	      date.setMonth(date.getMonth() + paginate);
	      this.goToDate(date);
	    }

	    /**
	     * Go to the previous month
	     *
	     * @param {integer} [paginate] - How many months to skip
	     */

	  }, {
	    key: 'prevMonth',
	    value: function prevMonth(paginate) {
	      paginate = Math.max(paginate || 1, 1);
	      var date = new Date(this._c.getTime());
	      date.setMonth(date.getMonth() - paginate);
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
	      this._c = setToStart(this._o.deserialize(date));
	      this._c.setDate(1);
	      this.draw();
	    }

	    /**
	     * Check the value for a specific date
	     *
	     * @param {(string|Date)} date - The date to check for
	     */

	  }, {
	    key: 'hasDate',
	    value: function hasDate(date) {
	      date = setToStart(this._o.deserialize(date));
	      return !!this._d[date.getTime()];
	    }

	    /**
	     * Add a date to the value
	     *
	     * @param {(string|Date)} date - The date to add
	     */

	  }, {
	    key: 'addDate',
	    value: function addDate(date) {
	      this.toggleValue(date, true);
	    }

	    /**
	     * Remove a date from the value
	     *
	     * @param {(string|Date)} date - The date to remove
	     */

	  }, {
	    key: 'removeDate',
	    value: function removeDate(date) {
	      this.toggleValue(date, false);
	    }

	    /**
	     * Toggle a date selection
	     *
	     * @param {(string|Date)} date - Date to toggle
	     * @param {boolean} [force] - Force to selected/deselected
	     */

	  }, {
	    key: 'toggleValue',
	    value: function toggleValue(date, force) {
	      var opts = this._o;

	      [].concat(date).filter(function (d) {
	        return !!d && this.dateAllowed(d);
	      }, this).forEach(function (d) {
	        d = setToStart(opts.deserialize(d));
	        var t = d.getTime();

	        if (!this._d[t] && (force === undefined || !!force)) {
	          if (!opts.multiple) this._d = {};
	          this._d[t] = d;
	        } else if (this._d[t] && !force) {
	          delete this._d[t];
	        }
	      }, this);

	      this.update();
	    }

	    /**
	     * Set the value to a specific date
	     *
	     * @param {(string|Date)} date - The date value
	     */

	  }, {
	    key: 'setValue',
	    value: function setValue(date) {
	      this._d = {};
	      this.addDate(date);
	    }

	    /**
	     * Get the value of the datepicker
	     */

	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      var dates = [];
	      for (var t in this._d) {
	        dates.push(this._d[t]);
	      }return this._o.multiple ? dates.sort(compareDates) : dates[0];
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
	      var opts = this._o;
	      date = setToStart(opts.deserialize(date));
	      dim = dim == 'month' || dim == 'year' ? dim : undefined;

	      if (dim == 'month') {
	        var aboveMin = !opts.min || date.getMonth() >= opts.min.getMonth();
	        var belowMax = !opts.max || date.getMonth() <= opts.max.getMonth();
	      } else if (dim == 'year') {
	        var aboveMin = !opts.min || date.getFullYear() >= opts.min.getFullYear();
	        var belowMax = !opts.max || date.getFullYear() <= opts.max.getFullYear();
	      } else {
	        var aboveMin = !opts.min || date >= opts.min;
	        var belowMax = !opts.max || date <= opts.max;
	      }

	      return aboveMin && belowMax && (!opts.without || !dateInArray(date, opts.without, dim)) && (!opts.within || dateInArray(date, opts.within, dim));
	    }

	    /**
	     * Draw the calendar HTML
	     */

	  }, {
	    key: 'draw',
	    value: function draw() {
	      var opts = this._o;
	      var i = -opts.index;
	      var limit = opts.calendars + i;

	      var html = '';
	      for (; i < limit; i++) {
	        html += this.render(i);
	      }

	      this.container.innerHTML = html;
	    }

	    /**
	     * Render a single month's HTML
	     *
	     * @param {integer} [i=0] - Offset month to render
	     */

	  }, {
	    key: 'render',
	    value: function render(i) {
	      i = i || 0;

	      var self = this;
	      var opts = this._o;
	      var date = new Date(this._c.getTime());
	      date.setMonth(date.getMonth() + i);

	      var month = date.getMonth();
	      var year = date.getFullYear();

	      // get next/prev month to determine if they're allowed
	      var nextMonth = new Date(date.getTime());
	      nextMonth.setMonth(nextMonth.getMonth() + 1);
	      nextMonth.setDate(1);
	      var prevMonth = new Date(date.getTime());
	      prevMonth.setMonth(prevMonth.getMonth() - 1);
	      prevMonth.setDate(getDaysInMonth(prevMonth));

	      // basic data for a month
	      var cal = {
	        date: date,
	        month: opts.i18n.months[month],
	        next: !opts.max || nextMonth <= opts.max,
	        prev: !opts.min || prevMonth >= opts.min,
	        year: year,
	        days: [],

	        // extra data for multiple calendars
	        index: i,
	        first: i === -opts.index,
	        last: i === opts.calendars - opts.index - 1,
	        main: i === 0
	      };

	      // setup the start day
	      var start = new Date(year, month, 1).getDay() - opts.weekStart;
	      while (start < 0) {
	        start += 7;
	      } // number of days in the month, padded to fit a calendar
	      var days = getDaysInMonth(year, month) + start;
	      while (days % 7) {
	        days += 1;
	      } // today!
	      var today = setToStart(new Date());

	      // loop over the days
	      for (var j = 0; j < days; j++) {
	        var day = new Date(year, month, 1 + (j - start));
	        var dayMonth = day.getMonth();
	        var isLastMonth = dayMonth < month;
	        var isNextMonth = dayMonth > month;
	        var weekday = day.getDay();

	        // basic day data
	        cal.days.push({
	          obj: day,
	          date: opts.serialize(day),
	          daynum: day.getDate(),
	          weekday: opts.i18n.weekdays[weekday],
	          weekdayShort: opts.i18n.weekdaysShort[weekday],
	          isToday: day.getTime() === today.getTime(),
	          isWeekend: weekday === 0 || weekday === 6,
	          isSelected: this.hasDate(day),
	          isDisabled: !this.dateAllowed(day),
	          isThisMonth: !isLastMonth && !isNextMonth,
	          isLastMonth: isLastMonth,
	          isNextMonth: isNextMonth
	        });
	      }

	      // render functions
	      cal.renderDay = this._renderDay;
	      cal.renderHeader = function () {
	        return self._renderHeader(cal);
	      };

	      // single render function for year/month
	      cal.renderSelect = function (type) {
	        var d = new Date(date.getTime());
	        var data = { t: type, o: [], i: i };

	        // month select
	        if (type == 'month') {
	          data.c = month;

	          for (var m = 0; m < 12; m++) {
	            d.setMonth(m);
	            if (self.dateAllowed(d, 'month')) {
	              data.o.push(opts.i18n.months[m]);
	            }
	          }

	          // year select (in range)
	        } else if (type == 'year') {
	          data.c = year;

	          var y = year - opts.yearRange;
	          var max = year + opts.yearRange;

	          for (; y <= max; y++) {
	            d.setFullYear(y);
	            if (self.dateAllowed(d, 'year')) {
	              data.o.push(y);
	            }
	          }
	        }

	        // template function
	        return self._renderSelect(data);
	      };

	      // return the HTML generated from the data
	      return tmpl(opts.templates.calendar, cal);
	    }

	    /**
	     * Basic `toString` method
	     */

	  }, {
	    key: 'toString',
	    value: function toString() {
	      var parts = transform(this.getValue() || [], this._o.serialize, this);
	      return [].concat(parts).join(this._o.separator);
	    }
	  }]);

	  return Datepicker;
	}();

	// our default configuration


	Datepicker.defaults = {
	  class: '',
	  openOn: 'first',
	  multiple: false,
	  inline: false,
	  min: false,
	  max: false,
	  within: false,
	  without: false,
	  yearRange: 5,
	  weekStart: 0,
	  calendars: 1,
	  paginate: 1,
	  index: 0,
	  separator: ',',

	  responsive: {},

	  serialize: function serialize(date) {
	    return date.toLocaleDateString();
	  },

	  deserialize: function deserialize(str) {
	    return new Date(str);
	  },

	  onInit: false,
	  onUpdate: false,

	  i18n: {
	    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	  },

	  templates: {
	    calendar: ['<div class="datepicker__cal">', '<%= renderHeader() %>', '<table class="datepicker__table">', '<thead>', '<tr>', '<% for (var i = 0; i < 7; i++) { %>', '<th><%= days[i].weekdayShort %></th>', '<% } %>', '</tr>', '</thead>', '<tbody>', '<% for (var i = 0; i < days.length; i++) { %>', '<%= (i % 7 == 0) ? "<tr>" : "" %>', '<%= renderDay(days[i]) %>', '<%= (i % 7 == 6) ? "</tr>" : "" %>', '<% } %>', '</tbody>', '</table>', '</div>'].join(''),

	    header: ['<header class="datepicker__header">', '<% if (first) { %><a class="datepicker__prev <%= (prev) ? "" : "is-disabled" %>" data-prev></a><% } %>', '<span class="datepicker__title"><%= month %><%= renderSelect("month") %></span>', '<span class="datepicker__title"><%= year %><%= renderSelect("year") %></span>', '<% if (index == 3 || last && index < 3) { %>', '<a class="datepicker__next <%= (next) ? "" : "is-disabled" %>" data-next></a>', '<% } %>', '</header>'].join(''),

	    day: ['<% var cls = ["datepicker__day"]; %>', '<% if (isSelected) cls.push("is-selected"); %>', '<% if (isDisabled) cls.push("is-disabled"); %>', '<% if (!isThisMonth) cls.push("is-otherMonth"); %>', '<% if (isToday) cls.push("is-today"); %>', '<td class="<%= cls.join(" ") %>" data-date="<%= date %>"><div>', '<span class="datepicker__daynum"><%= daynum %></span>', '</div></td>'].join('')
	  }
	};

	// Private functions

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

	function extend(obj) {
	  var other = Array.prototype.slice.call(arguments, 1);

	  for (var i = 0; i < other.length; i++) {
	    for (var p in other[i]) {
	      if (obj[p] !== undefined && _typeof(other[i][p]) === 'object' && other[i][p] !== null && other[i][p].nodeName === undefined) {
	        if (other[i][p] instanceof Date) {
	          obj[p] = new Date(other[i][p].getTime());
	        }if (Array.isArray(other[i][p])) {
	          obj[p] = other[i][p].slice(0);
	        } else {
	          obj[p] = extend(obj[p], other[i][p]);
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

/***/ }
/******/ ]);