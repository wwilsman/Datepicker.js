(function(root, factory) {
  'use strict';

  if ( typeof define === 'function' && define.amd ) {
    define('Datepicker', factory());
  } else if ( typeof exports === 'object' ) {
    module.exports = factory();
  } else {
    root.Datepicker = factory();
  }
})(this, function() {
  'use strict';

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
  var Datepicker = function Datepicker(elem, opts) {
    var self = this;

    // we have a selector
    if (typeof elem === 'string') {
      return transform($$(elem), function(el) {
        return new Datepicker(el, opts);
      });
    }
    
    // no element?
    if (!elem) elem = document.createElement('input');
          
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
    this._renderSelect = tmpl([
      '<select data-<%= t %>="<%= c %>" data-cal="<%= i %>">',
        '<% for (var j = 0; j < o.length; j++) { %>',
          '<% var v = (t == "year") ? o[j] : j; %>',
          '<option value="<%= v %>" <%= (v == c) ? "selected" : "" %>>',
            '<%= o[j] %></option>',
        '<% } %>',
      '</select>'
    ].join(''));

    /* Setup DOM */
    
    // let's save this
    this.elem = elem;

    // create the datepicker element
    this.node = document.createElement('div');
    addClass(this.node, 'datePicker' + (opts.inline ? ' ' : ' has-popup ') + opts.class);
    if (opts.calendars > 1) addClass(this.node, 'is-multiple');

    // create the container element
    this.container = document.createElement('div');
    addClass(this.container, 'datePicker__container');
    
    // insert our element into the dom
    if (elem.parentNode) elem.parentNode.insertBefore(this.node, elem);

    // put stuff in our element
    this.node.appendChild(elem);
    this.node.appendChild(this.container);
    
    // we need to know if the elem is an input
    var isInput = this._isInput = (/input|textarea/i).test(elem.tagName);
    var inputType = !isInput ? false : elem.type.toLowerCase();

    // make sure it's a valid input type
    if (isInput && !(inputType == 'text' || inputType == 'hidden'))
      elem.type = 'text';

    /* Add Events */

    // on focus (or click), open the datepicker
    if (isInput) {
      elem.addEventListener('focus', function() {
        self.open();
      }, false);
    } else {
      elem.addEventListener('click', function() {
        if (hasClass(self.node, 'is-visible')) {
          self.hide();
        } else {
          self.open();
        }
      });
    }
    
    // if we click outside of our element, hide it
    document.addEventListener('mousedown', function(e) {
      if (!self.node.contains(e.target)) self.hide();
    }, false);
    
    // this will help with click & drag selecting
    var mousedown = false;
    var startNode = null;
    var selection = [];
    
    // don't actually select text, please
    this.node.onselectstart = function() { return false; };
    
    // when we mousedown on (or touch) a "date node," highlight it and start the selection
    this.node.addEventListener('mousedown', startSelectionHandler, false);
    this.node.addEventListener('touchstart', startSelectionHandler, false);
    function startSelectionHandler(e) {
      var dateNode = closest(e.target, '[data-date]', this);

      if (dateNode) {
        addClass(dateNode, 'is-highlighted');
        startNode = dateNode;
        mousedown = true;
      }
    }
    
    // we've finished the potential selection
    this.node.addEventListener('mouseup', endSelectionHandler, false);
    this.node.addEventListener('touchend', endSelectionHandler, false);
    function endSelectionHandler(e) {

      // remove the highlighting
      $$('[data-date].is-highlighted', self.container).forEach(function(el) {
        removeClass(el, 'is-highlighted');
      });
      
      // only do this stuff if we've made a selection
      if (mousedown && closest(e.target, '[data-date]', this)) {

        // make sure we've got at least one
        if (startNode && !selection.length) {
          selection.push(startNode.dataset.date);
        }

        // actually make the selection
        self.toggleValue(selection);

        // update the elements without refreshing the calendar
        selection.forEach(function(d) {
          $$('[data-date="' + d + '"]', self.container).forEach(function(el) {
            toggleClass(el, 'is-selected', self.hasDate(d));
          });
        });

        // you can't select multiple, hide the calendar
        if (!opts.multiple) {
          $$('[data-date].is-selected', self.container).forEach(function(el) {
            toggleClass(el, 'is-selected', self.hasDate(el.dataset.date));
          });
          
          self.hide();
        }
      }
      
      // reset this stuff
      mousedown = false;
      startNode = null;
      selection = [];
    }
    
    // we're making a selection, and we're allowed to; highlight them
    this.node.addEventListener('mouseover', makeSelectionHandler, false);
    this.node.addEventListener('touchmove', makeSelectionHandler, false);
    function makeSelectionHandler(e) {
      var dateNode = closest(e.target, '[data-date]', this);   
      if (opts.multiple && dateNode && mousedown && startNode != e.target) {
        selection = dateRange(startNode.dataset.date, dateNode.dataset.date);
        selection = transform(selection, opts.serialize);

        $$('[data-date].is-highlighted', self.container).forEach(function(el) {
          removeClass(el, 'is-highlighted');
        });
        
        selection.forEach(function(d) {
          $$('[data-date="' + d + '"]', self.container).forEach(function(el) {
            toggleClass(el, 'is-highlighted');
          });
        });
      }
    }
    
    // what did you click?
    this.node.addEventListener('click', function(e) {

      // previous month
      if (e.target.hasAttribute('data-prev')) {
        self.prevMonth(opts.paginate);
        
      // next month
      } else if (e.target.hasAttribute('data-next')) {
        self.nextMonth(opts.paginate);
        
      // clicked the year select but it hasn't been bound
      } else if (e.target.hasAttribute('data-year') &&
          !e.target.hasAttribute('data-bound')) {
        
        e.target.dataset.bound = true;
        e.target.addEventListener('change', function() {
          var c = this.dataset.year;
          var y = self._c.getFullYear();
          self._c.setFullYear(parseInt(this.value) - (c - y));
          self.draw();
        });
        
      // clicked the month select but it hasn't been bound
      } else if (e.target.hasAttribute('data-month') &&
          !e.target.hasAttribute('data-bound')) {
        
        e.target.dataset.bound = true;
        e.target.addEventListener('change', function() {
          self._c.setMonth(this.value - this.dataset.cal);
          self.draw();
        });
      }
    }, false);

    // the initial value of our element
    var elemValue = (isInput ? elem.value : (elem.dataset.value || ''));

    // set date(s) from the initial value
    this.setValue(elemValue.split(opts.separator).map(function(str) {
      return str ? opts.deserialize(str) : false;
    }).filter(isValidDate));

    // callback option
    if (opts.onInit) opts.onInit.call(this, elem);
    
    // draw the calendar for the first time
    this.draw();
  };
    
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
    
    serialize: function(date) {
      return date.toLocaleDateString();
    },
    
    deserialize: function(str) {
      if (str instanceof Date) return str;      
      return new Date(str);
    },

    onInit: false,
    onUpdate: false,
    
    i18n: {
      months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      weekdaysShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    },
    
    templates: {
      calendar: [
        '<div class="datePicker__cal">',
          '<%= renderHeader() %>',
          '<table class="datePicker__table">',
            '<thead>',
              '<tr>',
                '<% for (var i = 0; i < 7; i++) { %>',
                  '<th><%= days[i].weekdayShort %></th>',
                '<% } %>',
              '</tr>',
            '</thead>',
            '<tbody>',
              '<% for (var i = 0; i < days.length; i++) { %>',
                '<%= (i % 7 == 0) ? "<tr>" : "" %>',
                  '<td><%= renderDay(days[i]) %></td>',
                '<%= (i % 7 == 6) ? "</tr>" : "" %>',
              '<% } %>',
            '</tbody>',
          '</table>',
        '</div>'
      ].join(''),
      
      header: [
        '<header class="datePicker__header">',
          '<% if (first) { %><a class="datePicker__prev <%= (prev) ? "" : "is-disabled" %>" data-prev></a><% } %>',
          '<span class="datePicker__title"><%= month %><%= renderSelect("month") %></span>',
          '<span class="datePicker__title"><%= year %><%= renderSelect("year") %></span>',
          '<% if (index == 3 || last && index < 3) { %>',
            '<a class="datePicker__next <%= (next) ? "" : "is-disabled" %>" data-next></a>',
          '<% } %>',
        '</header>'
      ].join(''),
      
      day: [
        '<% var cls = ["datePicker__day"]; %>',
        '<% if (isSelected) cls.push("is-selected"); %>',
        '<% if (isDisabled) cls.push("is-disabled"); %>',
        '<% if (!isThisMonth) cls.push("is-otherMonth"); %>',
        '<% if (isToday) cls.push("is-today"); %>',
        '<div class="<%= cls.join(" ") %>" data-date="<%= date %>">',
          '<span class="datePicker__daynum"><%= daynum %></span>',
        '</div>'
      ].join('')
    }
  };
    
  // Datepicker prototype
  Datepicker.prototype = {
    
    /**
     * Set options
     *
     * @param {(string|Object)} prop - Option key, or object of properties
     * @param {mixed} [value] - Value of option (not used if object present)
     * @param {boolean} [noRedraw] - Do not redraw the calendar afterwards
     */
    set: function(key, val, noRedraw) {
      var o = this._o;

      // iterate over the object
      if (typeof key === 'object') {
        for (var k in key) this.set(k, key[k], true);
        if (!noRedraw) this.draw();
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
          if (!!val) val = [].concat(transform(val, o.deserialize, this)).filter(isValidDate);
          break;

        // if needed, deserialize openOn
        case 'openOn':              
          if (typeof val == 'string' && val != 'first' && val != 'last') {
            val = transform(val, o.deserialize, this);
            if (!isValidDate(val)) val = new Date();
          }
          break;

        // constrain integers
        case 'paginate':
        case 'calendars':
          val = Math.max(val, 1);
          this.node && toggleClass(this.node, 'is-multiple', val > 0);
          break;
        case 'weekstart':
          val = Math.min(Math.max(val, 0), 6);
          break;
        case 'index':
          val = Math.min(Math.max(val, 0), o.calendars);
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
          for (var k in val) this.set('templates.' + k, val[k], true);
          break;
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
        default: break;
      }

      // actually set the value and optionally redraw
      if (key.indexOf('.') < 0) this._o[key] = val;
      if (!noRedraw) this.draw();
      return val;
    },

    /**
     * Get an option 
     *
     * @param {string} key - Option key
     */
    get: function(key) {
      return this._o[key];
    },

    /**
     * Update the bound element and trigger `onUpdate` callback
     */
    update: function() {
      var opts = this._o;
      var value = this.getValue();

      var elemValue = [].concat(value || []).map(function(date) {
        return !!date ? opts.serialize(date) : false;
      }).filter(function(str) {
        return !!str;
      }).join(opts.separator);

      if (!this._isInput) {
        this.elem.dataset.value = elemValue;
      } else {
        this.elem.value = elemValue;
      }

      if (opts.onUpdate) {
        opts.onUpdate.call(this, value);
      }
    },
    
    /**
     * Open the calendar to a specific date (or `openOn` date);
     *
     * @param {string|Date} [date=openOn] - The date to open to
     */
    open: function(date) {
      var dates = [].concat(this.getValue());
      date = date || this._o.openOn || this._c;

      // we have a string
      if (typeof date === 'string') {
        date = date.toLowerCase();
        
        // first, last, or deserialize
        if (date === 'first' && dates.length) {
          date = dates[0];
        } else if (date === 'last' && dates.length) {
          date = dates.slice(-1);
        } else {
          date = this._o.deserialize(date);
        }
      }

      // still not valid? then open to today
      if (!isValidDate(date)) date = new Date();
      
      // set calendar to date and show it
      this.goToDate(date);
      this.show();
    },
    
    /**
     * Add classes to show the datepicker
     */
    show: function() {
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
        var fitTop = rect.top > rect.height;
        toggleClass(this.container, 'position-right', posRight && fitLeft);
        toggleClass(this.container, 'position-top', posTop && fitTop);
        if (posTop & !fitTop) this.container.style.top = elBottom + 'px';
      }
    },
    
    /**
     * Remove classes to hide the datepicker
     */
    hide: function() {
      if (!this._o.inline) {
        removeClass(this.node, 'is-visible')
        removeClass(this.container, 'position-right position-left');
      }
    },
    
    /**
     * Go to the next month
     *
     * @param {integer} [paginate] - How many months to skip
     */
    nextMonth: function(paginate) {
      paginate = Math.max(paginate || 1, 1);
      var date = new Date(this._c.getTime());
      date.setMonth(date.getMonth() + paginate);
      this.goToDate(date);
    },
    
    
    /**
     * Go to the previous month
     *
     * @param {integer} [paginate] - How many months to skip
     */
    prevMonth: function(paginate) {
      paginate = Math.max(paginate || 1, 1);
      var date = new Date(this._c.getTime());
      date.setMonth(date.getMonth() - paginate);
      this.goToDate(date);
    },
    
    /**
     * Go to a specific date
     *
     * @param {(string|Date)} date - Date to set the calendar to
     */
    goToDate: function(date) {
      this._c = setToStart(this._o.deserialize(date));
      this._c.setDate(1);
      this.draw();
    },
    
    /**
     * Check the value for a specific date
     *
     * @param {(string|Date)} date - The date to check for
     */
    hasDate: function(date) {
      date = setToStart(this._o.deserialize(date));
      return !!this._d[date.getTime()];
    },
    
    /**
     * Add a date to the value
     *
     * @param {(string|Date)} date - The date to add
     */
    addDate: function(date) {
      this.toggleValue(date, true);
    },
    
    /**
     * Remove a date from the value
     *
     * @param {(string|Date)} date - The date to remove
     */
    removeDate: function(date) {
      this.toggleValue(date, false);
    },
    
    /**
     * Toggle a date selection
     *
     * @param {(string|Date)} date - Date to toggle
     * @param {boolean} [force] - Force to selected/deselected
     */
    toggleValue: function(date, force) {
      var opts = this._o;
      
      [].concat(date).filter(function(d) {
        return !!d && this.dateAllowed(d);
      }, this).forEach(function(d) {            
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
    },
    
    /**
     * Set the value to a specific date
     *
     * @param {(string|Date)} date - The date value
     */
    setValue: function(date) {
      this._d = {};
      this.addDate(date);
    },
    
    /**
     * Get the value of the datepicker
     */
    getValue: function() {
      var dates = [];
      for (var t in this._d) dates.push(this._d[t]);
      return this._o.multiple ? dates.sort(compareDates) : dates[0];
    },
    
    /**
     * Check if a date is allowed in the datepicker
     *
     * @param {(string|Date)} date - The date to check
     * @param {string} [dim] - The dimension to check ('year' or 'month')
     */
    dateAllowed: function(date, dim) {
      var opts = this._o;
      date = setToStart(opts.deserialize(date));
      dim = (dim == 'month' || dim == 'year') ? dim : undefined;
      return ((!opts.min || date >= opts.min) && (!opts.max || date <= opts.max) &&
        (!opts.without || !dateInArray(date, opts.without, dim)) &&
        (!opts.within || dateInArray(date, opts.within, dim)));
    },
    
    /**
     * Draw the calendar HTML
     */
    draw: function() {
      var opts = this._o;
      var i = -opts.index;
      var limit = opts.calendars + i;
      
      var html = '';
      for (; i < limit; i++) {
        html += this.render(i);
      }
      
      this.container.innerHTML = html;
    },
    
    /**
     * Render a single month's HTML
     *
     * @param {integer} [i=0] - Offset month to render
     */
    render: function(i) {
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
        next: (!opts.max || nextMonth <= opts.max),
        prev: (!opts.min || prevMonth >= opts.min),
        year: year,
        days: [],
        
        // extra data for multiple calendars
        index: i,
        first: (i === -opts.index),
        last: (i === opts.calendars - opts.index - 1),
        main: (i === 0)
      };
      
      // setup the start day
      var start = new Date(year, month, 1).getDay() - opts.weekStart;
      while (start < 0) start += 7;
      
      // number of days in the month, padded to fit a calendar
      var days = getDaysInMonth(year, month) + start;
      while (days % 7) days += 1;
      
      // today!
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
          isWeekend: (weekday === 0 || weekday === 6),
          isSelected: this.hasDate(day),
          isDisabled: !this.dateAllowed(day),
          isThisMonth: !isLastMonth && !isNextMonth,
          isLastMonth: isLastMonth,
          isNextMonth: isNextMonth,
        });
      }

      // render functions
      cal.renderDay = this._renderDay;
      cal.renderHeader = function() {
        return self._renderHeader(cal);
      };
      
      // single render function for year/month
      cal.renderSelect = function(type) {
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
    },
    
    /**
     * Basic `toString` method
     */
    toString: function() {
      var parts = transform(this.getValue(), this._o.serialize, this);
      return [].concat(parts).join(this._o.separator);
    }
  };
  
  // return our construction
  return Datepicker;

  // Private functions

  function $(selector, ctx) {
    return (ctx||document).querySelector(selector);
  }
    
  function $$(selector, ctx) {
    var els = (ctx||document).querySelectorAll(selector);
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
    var trim = function(s) { return s.trim(); };
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
    return transform(date, function(d) {
      if (d) d.setHours(0,0,0,0);
      return d;
    });
  }
    
  function dateRange(start, end) {
    start = new Date(start);
    end = new Date(end);
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
        if (obj[p] !== undefined && typeof other[i][p] === 'object' && other[i][p] !== null && other[i][p].nodeName === undefined) {
          if (other[i][p] instanceof Date) {
            obj[p] = new Date(other[i][p].getTime());
          } if (Array.isArray(other[i][p])) {
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
    
  function tmpl(str, data){
    var fn = new Function("obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +
      "with(obj){p.push('" +

      str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
    + "');}return p.join('');");

    return data ? fn( data ) : fn;
  }
  
});
