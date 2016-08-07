import {
  $,
  $$,
  matches,
  closest,
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  getDataAttributes,
  isLeapYear,
  getDaysInMonth,
  dateInArray,
  compareDates,
  isValidDate,
  setToStart,
  dateRange,
  extend,
  transform,
  tmpl
} from './utils.js'

import defaultOpts from './defaults'

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
export default class Datepicker {

  static defaults = defaultOpts

  constructor(elem, opts) {

    // we have a selector
    if (typeof elem === 'string') {
      return transform($$(elem), (el) => new this.constructor(el, opts))
    }

    // no element?
    if (!elem) {
      elem = document.createElement('input')
    }

    // set internals
    this._selected = {}
    this._opts = {}

    // extend default options
    opts = extend({}, this.constructor.defaults, opts, getDataAttributes(elem))

    // set serialize & deserialize options first, they're important
    this.set('serialize', opts.serialize, true)
    this.set('deserialize', opts.deserialize, true)

    // set all the options
    opts = this.set(opts, null, true)

    // set the initial calendar date
    let date = opts.openOn
    if (typeof date === 'string' || !isValidDate(date)) date = new Date()
    this._month = setToStart(new Date(date.getTime()))
    this._month.setDate(1)

    // render select template
    this._renderers.select = tmpl([
      '<select data-<%= t %>="<%= c %>" data-index="<%= i %>">',
        '<% for (var j = 0 j < o.length j++) { %>',
          '<% var v = (t === "year") ? o[j] : j %>',
          '<option value="<%= v %>"<%= (v === c) ? " selected" : "" %>>',
            '<%= o[j] %>',
          '</option>',
        '<% } %>',
      '</select>'
    ].join(''))


    /* Setup DOM */

    // let's save this
    this._el = elem

    // create the datepicker element
    let node = this.node = document.createElement('div')
    node.className = opts.inline ? opts.classNames.inline : opts.classNames.default

    // create the wrapping element
    let wrapper = this.wrapper = document.createElement('div')
    wrapper.className = opts.classNames.wrapper

    // insert our element into the dom
    if (elem.parentNode) elem.parentNode.insertBefore(node, elem)

    // put stuff in our element
    node.appendChild(elem)
    node.appendChild(wrapper)

    // we need to know if the elem is an input
    let isInput = 'input' === elem.tagName.toLowerCase()
    let inputType = !isInput ? false : elem.type.toLowerCase()

    // make sure it's a valid input type
    if (isInput && !(inputType == 'text' || inputType == 'hidden'))
      elem.type = 'text'

    /* Add Events */

    // on focus (or click), open the datepicker
    if (isInput) {
      elem.addEventListener('focus', () => this.open())
    } else {
      elem.addEventListener('click', () => this._isOpen ? this.hide() : this.open())
    }

    // if we click outside of our element, hide it
    document.addEventListener('mousedown', (e) => {
      if (!node.contains(e.target)) this.hide()
    })

    // this will help with click & drag selecting
    let mousedown = false
    let startNode, startDate
    let selection = []

    // don't actually select text, please
    this.node.onselectstart = () => false

    // when we mousedown on a "date node," highlight it and start the selection
    this.node.addEventListener('mousedown', (e) => {
      let dateNode = closest(e.target, '[data-date]', this.node)

      if (dateNode) {
        addClass(dateNode, 'is-highlighted')
        startDate = opts.deserialize(dateNode.dataset.date)
        startNode = dateNode
        mousedown = true
      }
    })

    // we've finished the potential selection
    this.node.addEventListener('mouseup', (e) => {

      // remove the highlighting
      $$('[data-date].is-highlighted', this.wrapper).forEach((el) => {
        removeClass(el, 'is-highlighted')
      })

      // only do this stuff if we've made a selection
      if (mousedown && closest(e.target, '[data-date]', this.node)) {

        // make sure we've got at least one
        if (startNode && !selection.length) {
          selection.push(opts.serialize(startDate))
        }

        // actually make the selection
        this.toggleValue(selection)

        // update the elements without refreshing the calendar
        selection.forEach((d) => {
          $$('[data-date="' + d + '"]', this.wrapper).forEach((el) => {
            toggleClass(el, 'is-selected', this.hasDate(d))
          })
        })

        // you can't select multiple, hide the calendar
        if (!opts.multiple) {
          $$('[data-date].is-selected', this.wrapper).forEach((el) => {
            toggleClass(el, 'is-selected', this.hasDate(el.dataset.date))
          })

          this.hide()
        }
      }

      // reset this stuff
      mousedown = false
      startNode = null
      startDate = null
      selection = []
    })

    // we're making a selection, and we're allowed to highlight them
    this.node.addEventListener('mouseover', (e) => {
      let dateNode = closest(e.target, '[data-date]', this.node)
      if (opts.multiple && dateNode && mousedown && startNode != e.target) {
        let date = opts.deserialize(dateNode.dataset.date)
        selection = transform(dateRange(startDate, date), opts.serialize)
        selection = [].concat(selection)

        $$('[data-date].is-highlighted', this.wrapper).forEach((el) => {
          removeClass(el, 'is-highlighted')
        })

        selection.forEach((d) => {
          $$('[data-date="' + d + '"]', this.wrapper).forEach((el) => {
            toggleClass(el, 'is-highlighted')
          })
        })
      }
    })

    // what did you click?
    this.node.addEventListener('click', (e) => {

      // previous month
      if (e.target.hasAttribute('data-prev')) {
        this.prevMonth(opts.paginate)

      // next month
      } else if (e.target.hasAttribute('data-next')) {
        this.nextMonth(opts.paginate)

      // clicked the year select but it hasn't been bound
      } else if (e.target.hasAttribute('data-year') &&
          !e.target.hasAttribute('data-bound')) {

        e.target.dataset.bound = true
        e.target.addEventListener('change', () => {
          let c = e.target.dataset.year
          let y = this._month.getFullYear()
          this._month.setFullYear(parseInt(e.target.value) - (c - y))
          this.render()
        })

      // clicked the month select but it hasn't been bound
      } else if (e.target.hasAttribute('data-month') &&
          !e.target.hasAttribute('data-bound')) {

        e.target.dataset.bound = true
        e.target.addEventListener('change', () => {
          this._month.setMonth(e.target.value - e.target.dataset.cal)
          this.render()
        })
      }
    }, false)

    // the initial value of our element
    let elemValue = (isInput ? elem.value : (elem.dataset.value || ''))

    // set date(s) from the initial value
    this.setValue(elemValue.split(opts.separator).map((str) => {
      return str ? opts.deserialize(str) : false
    }).filter(isValidDate))

    // callback option
    if (opts.onInit) opts.onInit.call(this, elem)

    // draw the calendar for the first time
    this.render()
  }

  /**
   * Set options
   *
   * @param {(string|Object)} prop - Option key, or object of properties
   * @param {mixed} [value] - Value of option (not used if object present)
   * @param {boolean} [noRedraw] - Do not redraw the calendar afterwards
   */
  set(key, val, noRedraw) {
    let o = this._opts;

    if (!key) return;

    // iterate over the object
    if (typeof key === 'object') {
      for (var k in key) this.set(k, key[k], true);
      if (!noRedraw && this.wrapper) this.render();
      return o;
    }

    // fix the value
    // @TODO: run options through functions
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

      // constrain weekstart
      case 'weekstart':
        val = Math.min(Math.max(val, 0), 6);
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
        this._renderers = this._renderers || {}
        this._renderers[key.substr(10)] = tmpl(val);
        o.templates = o.templates || extend({}, Datepicker.defaults.templates)
        o.templates[key.substr(10)] = val
        break

      // don't do anything
      default: break;
    }

    // actually set the value and optionally redraw
    if (key.indexOf('.') < 0) this._opts[key] = val;
    if (!noRedraw && this.wrapper) this.render();
    return val;
  }

  /**
   * Get an option
   *
   * @param {string} key - Option key
   */
  get(key) {
    return this._opts[key]
  }

  /**
   * Update the bound element and trigger `onUpdate` callback
   */
  update() {
    if (this._el.nodeName.toLowerCase() === 'input') {
      this._el.value = this.toString()
    } else {
      this._el.dataset.value = this.toString()
    }

    if (typeof this._opts.onUpdate === 'function') {
      this._opts.onUpdate.call(this, this.getSelected())
    }
  }

  /**
   * Open the calendar to a specific date (or `openOn` date);
   *
   * @param {string|Date} [date=openOn] - The date to open to
   */
  open(date) {
    let selected = [].concat(this.getSelected())
    date = date || this._opts.openOn || this._month

    // we have a string
    if (typeof date === 'string') {
      date = date.toLowerCase()

      // first, last, or deserialize
      if (date === 'first' && selected.length) {
        date = selected[0]
      } else if (date === 'last' && selected.length) {
        date = selected[selected.length - 1]
      } else if (date !== 'today') {
        date = this._opts.deserialize(date)
      }
    }

    // still not valid? then open to today
    if (!isValidDate(date)) {
      date = new Date()
    }

    // set calendar to date and show it
    this.goToDate(date)
    this.show()
  }

  /**
   * Show the datepicker and position it
   */
  show() {
    if (!this._opts.inline) {
      this.wrapper.style.display = 'block'
      this.wrapper.style.top = '100%'

      let rect = this.wrapper.getBoundingClientRect()
      let posRight = rect.right > window.innerWidth
      let posTop = rect.bottom > window.innerHeight

      this.wrapper.style.top = posTop ? '' : '100%'
      this.wrapper.style.right = posRight ? 0 : ''
      this.wrapper.style.bottom = posTop ? '100%' : ''
      this.wrapper.style.left = posRight ? '' : 0

      rect = this.wrapper.getBoundingClientRect()
      let fitLeft = rect.right >= rect.width
      let fitTop = rect.bottom > rect.height

      this.wrapper.style.top = posTop && fitTop ? '' : '100%'
      this.wrapper.style.right = posRight && fitLeft ? 0 : ''
      this.wrapper.style.bottom = posTop && fitTop ? '100%' : ''
      this.wrapper.style.left = posRight && fitLeft ? '' : 0
    }
  }

  /**
   * Hide the datepicker
   */
  hide() {
    if (!this._opts.inline) {
      this.wrapper.style.display = 'none'
    }
  }

  /**
   * Go to the next month
   *
   * @param {integer} [skip] - How many months to skip
   */
  next(skip) {
    let date = new Date(this._month.getTime())
    skip = Math.max(skip || 1, 1)
    date.setMonth(date.getMonth() + skip)
    this.goToDate(date)
  }


  /**
   * Go to the previous month
   *
   * @param {integer} [skip] - How many months to skip
   */
  prev(skip) {
    let date = new Date(this._month.getTime())
    skip = Math.max(skip || 1, 1)
    date.setMonth(date.getMonth() - skip)
    this.goToDate(date)
  }

  /**
   * Go to a specific date
   *
   * @param {(string|Date)} date - Date to set the calendar to
   */
  goToDate(date) {
    date = setToStart(this._opts.deserialize(date))
    date.setDate(1)

    this._month = date

    if (this._isOpen) {
      this.render()
    }
  }

  /**
   * Check the value for a specific date
   *
   * @param {(string|Date)} date - The date to check for
   */
  hasDate(date) {
    date = setToStart(this._opts.deserialize(date))
    return !!this._selected[date.getTime()]
  }

  /**
   * Add a date to the value
   *
   * @param {(string|Date)} date - The date to add
   */
  addDate(date) {
    this.toggleValue(date, true)
  }

  /**
   * Remove a date from the value
   *
   * @param {(string|Date)} date - The date to remove
   */
  removeDate(date) {
    this.toggleValue(date, false)
  }

  /**
   * Toggle a date selection
   *
   * @param {(string|Date)} date - Date to toggle
   * @param {boolean} [force] - Force to selected/deselected
   */
  toggleValue(dates, force) {
    let { multiple, deserialize } = this._opts
    dates = [].concat(dates).filter((d) => !!d && this.dateAllowed(d))

    dates.forEach((d) => {
      d = setToStart(deserialize(d))
      let t = d.getTime()

      // add the date
      if (!this._selected[t] && (force === undefined || !!force)) {

        // clear old value
        if (!multiple) this._selected = {}

        this._selected[t] = d

      // remove the date
      } else if (this._selected[t] && !force) {
        delete this._selected[t]
      }
    })

    this.update()
  }

  /**
   * Get the value
   */
  get value() {
    let selected = transform(this.getSelected(), this._opts.serialize, this)
    return [].concat(selected).join(this._opts.separator)
  }

  /**
   * Set the value to a specific date
   *
   * @param {string} value - The date value
   */
  set value(val) {
    this._selected = {}
    this.addDate(val.split(this._opts.separator))
  }

  /**
   * Get the selected dates
   */
  getSelected() {
    let selected = []
    for (let t in this._selected) selected.push(this._selected[t])
    return this._opts.multiple ? selected.sort(compareDates) : selected[0]
  }

  /**
   * Check if a date is allowed in the datepicker
   *
   * @param {(string|Date)} date - The date to check
   * @param {string} [dim] - The dimension to check ('year' or 'month')
   */
  dateAllowed(date, dim) {
    let { min, max, within, without, deserialize } = this._opts
    let aboveMin = belowMax = true

    date = setToStart(deserialize(date))

    if (dim == 'month') {
      aboveMin = (!min || date.getMonth() >= min.getMonth())
      belowMax = (!max || date.getMonth() <= max.getMonth())
    } else if (dim == 'year') {
      aboveMin = (!min || date.getFullYear() >= min.getFullYear())
      belowMax = (!max || date.getFullYear() <= max.getFullYear())
    } else {
      aboveMin = (!min || date >= min)
      belowMax = (!max || date <= max)
    }

    return (aboveMin && belowMax &&
      (!without || !dateInArray(date, without, dim)) &&
      (!within || dateInArray(date, within, dim)))
  }

  /**
   * render the calendar HTML
   */
  render() {
    let opts = this._opts
    let renderCache = {}

    // avoid duplicate calls to getCalendar
    let getData = (i) => {
      return renderCache[i] ||
        (renderCache[i] = this.getCalendar(i))
    }

    // generic render header
    let renderHeader = (data) => {
      let { _date, index, month, year } = data

      return this._renderers.header({ ...data,

        // render month select
        renderMonthSelect: (i = index) => {
          let d = new Date(_date.getTime())
          let o = [0,1,2,3,4,5,6,7,8,9,10,11]
          o = o.filter((m) => this.dateAllowed(d.setMonth(m), 'month'))
          return this._renderers.select({ o, i, t: 'month', c: month })
        },

        // render year select
        renderYearSelect: (i = index) => {
          let d = new Date(_date.getTime())
          let y = year - opts.yearRange
          let max = year + opts.yearRange

          let o = []
          for (; y <= max; y++) o.push(y)
          o = o.filter((y) => this.dateAllowed(d.setFullYear(y), 'year'))

          return this._renderers.select({ o, i, t: 'year', c: year })
        }
      })
    }

    this.wrapper.innerHTML = this._renderers.container({

      // render header
      renderHeader: (i = 0) => renderHeader(getData(i)),

      // render calendar
      renderCalendar: (i = 0) => {
        let data = getData(i)

        return this._renderers.calendar({ ...data,

          // render header within calendar
          renderHeader: () => renderHeader(data),

          // render day
          renderDay: (day) => this._renderers.day(day)
        })
      }
    })
  }

  /**
   * Get an object containing data for a calendar month
   *
   * @param {integer} [i=0] - Offset month to render
   */
  getCalendar(index = 0) {
    let opts = this._opts
    let date = new Date(this._month.getTime())
    date.setMonth(date.getMonth() + index)

    let month = date.getMonth()
    let year = date.getFullYear()

    // get next/prev month to determine if they're allowed
    let nextMonth = new Date(date.getTime())
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    nextMonth.setDate(1)

    let prevMonth = new Date(date.getTime())
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    prevMonth.setDate(getDaysInMonth(prevMonth))

    // collect the days' data
    let days = []

    // setup the start day
    let start = date.getDay() - opts.weekStart
    while (start < 0) start += 7

    // number of days in the month, padded to fit a calendar
    let dayCount = getDaysInMonth(year, month) + start
    while (dayCount % 7) dayCount += 1

    // today!
    let today = setToStart(new Date())

    // loop through the calendar days
    for (let i = 0; i < dayCount; i++) {
      let day = new Date(year, month, 1 + (i - start))
      let dayMonth = day.getMonth()
      let isPrevMonth = dayMonth < month
      let isNextMonth = dayMonth > month
      let weekday = day.getDay()

      // basic day data
      days.push({
        _date: day,

        date: opts.serialize(day),
        daynum: day.getDate(),
        weekday: opts.i18n.weekdays[weekday],
        weekdayShort: opts.i18n.weekdaysShort[weekday],

        isToday: day.getTime() === today.getTime(),
        isWeekend: (weekday === 0 || weekday === 6),
        isSelected: this.hasDate(day),
        isDisabled: !this.dateAllowed(day),
        isThisMonth: !isPrevMonth && !isNextMonth,
        isPrevMonth,
        isNextMonth,
      })
    }

    // return the calendar data
    return {
      date, year, days,
      month: opts.i18n.months[month],
      hasNext: (!opts.max || nextMonth <= opts.max),
      hasPrev: (!opts.min || prevMonth >= opts.min)
    }
  }
}
