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
  deepExtend,
  transform,
  tmpl
} from './utils.js'

import defaultOptions from './defaults'

import {
  _initOptions
} from './options'

import {
  _initDOM
} from './build'

import {
  _initEvents,
  _onmousedown,
  _onmousemove,
  _onmouseup,
  _onclick
} from './events'

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

  constructor(elem, opts) {

    // we have a selector
    if (typeof elem === 'string') {
      return transform($$(elem), (el) => new this.constructor(el, opts))
    }

    // no element?
    if (!elem) {
      elem = document.createElement('input')
    }

    // we need to know if the elem is an input
    let isInput = 'input' === elem.tagName.toLowerCase()
    let inputType = !isInput ? false : elem.type.toLowerCase()

    // make sure it's a valid input type
    if (isInput && !(inputType === 'text' || inputType === 'hidden'))
      elem.type = 'text'

    // save this
    this._el = elem

    // initialize options
    this._initOptions(opts)

    // initialize the dom
    this._initDOM(elem)

    // initialize event listeners
    this._initEvents()

    // set the initial value
    this.value = (isInput ? elem.value : (elem.dataset.value || ''))

    // callback option
    if (this._opts.onInit) opts.onInit.call(this, elem)
  }

  static defaults = defaultOptions

  /*
   * Initialize options
   */
  _initOptions = _initOptions

  /*
   * Initialize DOM
   */
  _initDOM = _initDOM

  /*
   * Event methods
   */
  _initEvents = _initEvents
  _onmousedown = _onmousedown
  _onmousemove = _onmousemove
  _onmouseup = _onmouseup
  _onclick = _onclick

  /**
   * Set options
   *
   * @param {(string|Object)} prop - Option key, or object of properties
   * @param {mixed} [value] - Value of option (not used if object present)
   * @param {boolean} [noRedraw] - Do not redraw the calendar afterwards
   */
  set(key, val) {
    if (!key) return

    // iterate over the object
    if (typeof key === 'object') {
      let obj = deepExtend({}, this.constructor.defaults, key)
      for (let k in obj) this.set(k, obj[k], true)
      if (this._isOpen) this.render()
      return this._opts
    }

    // setting part of object
    if (key.indexOf('.') > 0) {
      let k = key.split('.')
      let v = val

      key = k.unshift()
      val = {}

      k.reduce((r, o) => val[o] = {}, val)
      val[k[k.length - 1]] = v
    }

    // default opts to pass to setters
    let opts = deepExtend({}, this._opts, this.constructor.defaults)

    // fix the value
    if (key in this._setters) {
      val = this._setters[key](val, opts)
    }


    if (typeof val === 'object')
      val = deepExtend({}, val, this.constructor.defaults[key])

    // actually set the value
    this._opts[key] = val

    // rerender
    // if (!this._isOpen) this.render()

    // return value
    return val
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
      this._el.value = this.value
    } else {
      this._el.dataset.value = this.value
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

      this._isOpen = true
    }
  }

  /**
   * Hide the datepicker
   */
  hide() {
    if (!this._opts.inline) {
      this.wrapper.style.display = 'none'
      this._isOpen = false
    }
  }

  /**
   * Toggle the datepicker
   */
  toggle() {
    if (this._isOpen) {
      this.hide()
    } else {
      this.open()
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
    this.toggleDates(date, true)
  }

  /**
   * Remove a date from the value
   *
   * @param {(string|Date)} date - The date to remove
   */
  removeDate(date) {
    this.toggleDates(date, false)
  }

  /**
   * Toggle a date selection
   *
   * @param {(string|Date)} date - Date to toggle
   * @param {boolean} [force] - Force to selected/deselected
   */
  toggleDates(dates, force) {
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
   * Get the selected dates
   */
  getSelected() {
    let selected = []
    for (let t in this._selected) selected.push(this._selected[t])
    return this._opts.multiple ? selected.sort(compareDates) : selected[0]
  }

  /**
   * Get the value
   */
  get value() {
    let selected = transform((this.getSelected() || []), this._opts.serialize, this)
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
   * Check if a date is allowed in the datepicker
   *
   * @param {(string|Date)} date - The date to check
   * @param {string} [dim] - The dimension to check ('year' or 'month')
   */
  dateAllowed(date, dim) {
    let { min, max, within, without, deserialize } = this._opts
    let belowMax, aboveMin = belowMax = true

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
    let getData = (i) => renderCache[i] || (renderCache[i] = this.getCalendar(i))

    // generic render header
    let renderHeader = (data) => {
      let { _date, index, month, year } = data

      return this._renderers.header({ ...data,

        // render month select
        renderMonthSelect: (i = index) => {
          let d = new Date(_date.getTime())
          let o = []

          for (let m = 0; m < 12; m++) {
            if (this.dateAllowed(d.setMonth(m), 'month'))
              o.push(opts.i18n.months[m])
          }

          return this._renderers.select({ o, i, t: 'month', c: month })
        },

        // render year select
        renderYearSelect: (i = index) => {
          let d = new Date(_date.getTime())
          let y = year - opts.yearRange
          let max = year + opts.yearRange
          let o = []

          for (; y <= max; y++) {
            if (this.dateAllowed(d.setFullYear(y), 'year'))
              o.push(y)
          }

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
      _date: date,
      weekdays: opts.i18n.weekdays,
      weekdaysShort: opts.i18n.weekdaysShort,
      month: opts.i18n.months[month],
      year, days,

      hasNext: (!opts.max || nextMonth <= opts.max),
      hasPrev: (!opts.min || prevMonth >= opts.min)
    }
  }
}
