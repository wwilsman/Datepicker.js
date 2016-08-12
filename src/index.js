import {
  $$,
  closest,
  addClass,
  removeClass,
  toggleClass,
  getDataAttributes,
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
  updateInline,
  deserializeMinMax,
  deserializeWithinWithout,
  deserializeOpenOn,
  constrainWeekstart,
  createTemplateRenderers
} from './options'

/**
 * Datepicker
 */
export default class Datepicker {

  /**
   * Default options
   */
  static defaults = defaultOptions

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
  constructor(elem, opts) {

    // we have a selector
    if (typeof elem === 'string') {

      // id selector
      if ('#' == elem.substr(0, 1)) {
        elem = document.getElementById(elem.substr(1))

      // class/tag selector
      } else {
        return $$(elem).map((el) => new this.constructor(el, opts))
      }
    }

    // no element?
    if (!elem) {
      elem = document.createElement('input')
    }

    // make sure it's a valid input type
    if ('input' === elem.tagName.toLowerCase()
        && !/input|hidden/i.test(elem.type)) {
      elem.type = 'text'
    }

    // save this
    this._el = elem

    // initialize options
    this._initOptions(opts)

    // initialize the dom
    this._initDOM()

    // initialize event listeners
    this._initEvents()

    // set the initial value
    this.setValue(elem.value || elem.dataset.value || '')

    // callback option
    if (typeof this._opts.onInit === 'function') {
      this._opts.onInit.call(this, elem)
    }
  }

  /**
   * Initialize options
   *
   * @param  {Object} opts Options to initialize this instance with
   */
  _initOptions(opts = {}) {
    this._opts = {}

    // options pass through here before being set
    let inline = updateInline.bind(this)
    let minMax = deserializeMinMax.bind(this)
    let withInOut = deserializeWithinWithout.bind(this)
    let openOn = deserializeOpenOn.bind(this)
    let weekstart = constrainWeekstart.bind(this)
    let templates = createTemplateRenderers.bind(this)

    this._setters = {
      inline,
      min: minMax,
      max: minMax,
      within: withInOut,
      without: withInOut,
      openOn,
      weekstart,
      templates
    }

    // set all the options
    this.set(deepExtend({},
      this.constructor.defaults,
      getDataAttributes(this._el),
      opts
    ))

    // render select template
    this._renderers.select = tmpl([
      '<select data-<%= t %>="<%= c %>" data-index="<%= i %>">',
        '<% for (var j = 0; j < o.length; j++) { %>',
          '<% var v = (t === "year") ? o[j] : j; %>',
          '<option value="<%= v %>"<%= (v === c) ? " selected" : "" %>>',
            '<%= o[j] %>',
          '</option>',
        '<% } %>',
      '</select>'
    ].join(''))
  }

  /**
   * Initialize DOM
   */
  _initDOM() {
    let {
      inline: isInline,
      classNames: {
        base: baseClass,
        inline: inlineClass,
        wrapper: wrapperClass
      }
    } = this._opts

    // already initialized dom
    if (this.node) return

    // create the datepicker element
    this.node = document.createElement('div')
    this.node.className = baseClass + (isInline ? ` ${inlineClass}` : '')

    // create the wrapping element
    this.wrapper = document.createElement('div')
    this.wrapper.className = wrapperClass

    // insert our element into the dom
    if (this._el.parentNode)
      this._el.parentNode.insertBefore(this.node, this._el)

    // put stuff in our element
    this.node.appendChild(this._el)
    this.node.appendChild(this.wrapper)
  }

  /**
   * Initialize event listeners
   */
  _initEvents() {

    // already initialized
    if (this._isInitialized) return

    // this will help with click & drag selecting
    this._highlighted = []

    // bind context
    this.open = this.open.bind(this)
    this.toggle = this.toggle.bind(this)
    this._onmousedown = this._onmousedown.bind(this)
    this._onmousemove = this._onmousemove.bind(this)
    this._onmouseup = this._onmouseup.bind(this)
    this._onclick = this._onclick.bind(this)

    // on focus (or click), open the datepicker
    if ('input' !== this._el.tagName.toLowerCase()) {
      this._el.addEventListener('click', this.toggle)
    } else {
      this._el.addEventListener('focus', this.open)
    }

    // if we click outside of our element, hide it
    document.addEventListener('mousedown', (e) => {
      if (!this.node.contains(e.target)) this.hide()
    })

    // don't actually select text, please
    this.node.onselectstart = () => false

    // add necessary events
    this.node.addEventListener('mousedown', this._onmousedown)
    this.node.addEventListener('mousemove', this._onmousemove)
    this.node.addEventListener('mouseup', this._onmouseup)
    this.node.addEventListener('click', this._onclick)

    // flag as initialized
    this._isInitialized = true
  }

  /**
   * When we mousedown on a "date node," highlight it and start the selection
   */
  _onmousedown(e) {
    let { deserialize } = this._opts
    let dateNode = closest(e.target, '[data-date]', this.node)

    if (dateNode) {
      addClass(dateNode, 'is-highlighted')
      this._highlighted = [deserialize(dateNode.dataset.date)]
      this._isDragging = true
    }
  }

  /**
   * We're making a selection, and we're allowed to highlight them
   */
  _onmousemove(e) {
    let {
      multiple,
      serialize,
      deserialize,
      classNames: { highlighted }
    } = this._opts

    if (!multiple) return

    let startDate = this._highlighted[0]
    let dateNode = closest(e.target, '[data-date]', this.node)
    let date = dateNode ? deserialize(dateNode.dataset.date) : null

    if (date && this._isDragging && !compareDates(date, startDate)) {
      this._highlighted = dateRange(startDate, date)

      $$(`[data-date].${highlighted}`, this.wrapper).forEach((el) => {
        removeClass(el, highlighted)
      })

      this._highlighted.map(serialize).forEach((d) => {
        $$('[data-date="' + d + '"]', this.wrapper).forEach((el) => {
          toggleClass(el, highlighted)
        })
      })
    }
  }

  /**
   * We've finished the potential selection
   */
  _onmouseup(e) {
    let {
      multiple,
      serialize,
      classNames: { highlighted, selected }
    } = this._opts

    // remove the highlighting
    $$(`[data-date].${highlighted}`, this.wrapper).forEach((el) => {
      removeClass(el, highlighted)
    })

    // make sure we've got at least one
    if (!this._highlighted.length) return

    // only do this stuff if we've made a selection
    if (this._isDragging && closest(e.target, '[data-date]', this.node)) {

      // actually make the selection
      this.toggleDate(this._highlighted)

      // update the elements without refreshing the calendar
      this._highlighted.map(serialize).forEach((d) => {
        $$('[data-date="' + d + '"]', this.wrapper).forEach((el) => {
          toggleClass(el, selected, this.hasDate(d))
        })
      })

      // you can't select multiple, hide the calendar
      if (!multiple) {
        $$(`[data-date].${selected}`, this.wrapper).forEach((el) => {
          toggleClass(el, selected, this.hasDate(el.dataset.date))
        })

        this.hide()
      }
    }

    // reset this stuff
    this._isDragging = false
    this._highlighted = []
  }

  /**
   * What did you click?
   */
  _onclick(e) {

    // previous month
    if (e.target.hasAttribute('data-prev')) {
      this.prevMonth(e.target.dataset.prev)

    // next month
    } else if (e.target.hasAttribute('data-next')) {
      this.nextMonth(e.target.dataset.next)

    // clicked the year select but it hasn't been bound
    } else if (e.target.hasAttribute('data-year') && !e.target.onchange) {
      e.target.onchange = () => {
        let c = e.target.dataset.year
        let y = this._month.getFullYear()
        this._month.setFullYear(parseInt(e.target.value) - (c - y))
        this.render()
      }

    // clicked the month select but it hasn't been bound
    } else if (e.target.hasAttribute('data-month') && !e.target.onchange) {
      e.target.onchange = () => {
        this._month.setMonth(e.target.value - e.target.dataset.index)
        this.render()
      }
    }
  }

  /**
   * Set options
   *
   * @param {(string|Object)} prop - Option key, or object of properties
   * @param {mixed} [value] - Value of option (not used if object present)
   * @param {boolean} [noRedraw] - Do not redraw the calendar afterwards
   */
  set(key, val) {
    let k = key

    if (!key) return

    // iterate over the object
    if (typeof key === 'object') {

      // prioritize serialize & deserialize
      if (key.serialize) {
        this.set('serialize', key.serialize)
        delete key.serialize
      }
      if (key.deserialize) {
        this.set('deserialize', key.deserialize)
        delete key.deserialize
      }

      for (let k in key) this.set(k, key[k])
      return this._opts
    }

    // setting part of object
    if (key.indexOf('.') > 0) {
      let p = key.split('.')
      let v = val

      key = p.unshift()
      val = {}

      p.reduce((r, o) => val[o] = {}, val)
      val[p[p.length - 1]] = v
    }

    // default opts to pass to setters
    let opts = deepExtend({}, this.constructor.defaults, this._opts)

    // fix the value
    if (key in this._setters) {
      val = this._setters[key](val, opts)
    }


    if (typeof val === 'object')
      val = deepExtend({}, opts[key], val)

    // actually set the value
    this._opts[key] = val

    // rerender
    if (!this._isOpen && this.wrapper) this.render()


    // return value
    return this.get(k)
  }

  /**
   * Get an option
   *
   * @param {string} key - Option key
   */
  get(key) {
    return key.split('.').reduce((v, k) => v[k], this._opts)
  }

  /**
   * Open the calendar to a specific date (or `openOn` date);
   *
   * @param {string|Date} [date=openOn] - The date to open to
   */
  open(date) {
    let selected = [].concat(this.getDate())
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
    this.toggleDate(date, true)
  }

  /**
   * Remove a date from the value
   *
   * @param {(string|Date)} date - The date to remove
   */
  removeDate(date) {
    this.toggleDate(date, false)
  }

  /**
   * Toggle a date selection
   *
   * @param {(string|Date)} date - Date to toggle
   * @param {boolean} [force] - Force to selected/deselected
   */
  toggleDate(dates, force) {
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

    // update the element
    if (this._el.nodeName.toLowerCase() === 'input') {
      this._el.value = this.value
    } else {
      this._el.dataset.value = this.value
    }

    if (typeof this._opts.onUpdate === 'function') {
      this._opts.onUpdate.call(this, this.getDate())
    }
  }

  /**
   * Get the selected dates
   */
  getDate() {
    let selected = []
    for (let t in this._selected) selected.push(this._selected[t])
    return this._opts.multiple ? selected.sort(compareDates) : selected[0]
  }

  /**
   * Get the value
   */
  getValue() {
    let selected = transform((this.getDate() || []), this._opts.serialize, this)
    return [].concat(selected).join(this._opts.separator)
  }

  /**
   * Set the value to a specific date
   *
   * @param {string} value - The date value
   */
  setValue(val) {
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
