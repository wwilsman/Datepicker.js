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
  isPlainObject,
  deepExtend,
  transform,
  tmpl
} from './helpers.js'

import defaultOptions from './defaults'

import {
  updateInline,
  updateClassNames,
  deserializeMinMax,
  deserializeWithinWithout,
  deserializeOpenOn,
  constrainWeekstart,
  defaultTimeObject,
  bindOptionFunctions,
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

    // initialize the dom
    this._initDOM(elem)

    // initialize options
    this._initOptions(opts)

    // initialize event listeners
    this._initEvents()

    // set the initial value
    this.setValue(elem.value || elem.dataset.value || '')

    // callback option
    if (this._opts.onInit) {
      this._opts.onInit(elem)
    }
  }

  /**
   * Initialize options
   *
   * @param  {Object} opts Options to initialize this instance with
   */
  _initOptions(opts = {}) {
    this._opts = {}

    const inline = updateInline.bind(this)
    const minMax = deserializeMinMax.bind(this)
    const withInOut = deserializeWithinWithout.bind(this)
    const openOn = deserializeOpenOn.bind(this)
    const weekstart = constrainWeekstart.bind(this)
    const defTime = defaultTimeObject.bind(this)
    const classNames = updateClassNames.bind(this)
    const bindFunc = bindOptionFunctions.bind(this)
    const templates = createTemplateRenderers.bind(this)

    // options pass through here before being set
    this._set = {
      openOn,
      inline,
      weekstart,
      min: minMax,
      max: minMax,
      within: withInOut,
      without: withInOut,
      defaultTime: defTime,
      classNames,
      templates
    }

    // functions
    const fns = ['serialize', 'deserialize', 'onInit', 'onChange', 'onRender', 'setValue', 'getValue']
    fns.forEach((name) => this._set[name] = bindFunc)

    // setup renderers
    this._renderers = {
      select: tmpl([
        '<span style="position:relative"><%= text %>',
        '<select data-<%= type %>="<%= value %>" data-index="<%= index %>"',
        'style="position:absolute;top:0;left:0;width:100%;height:100%;margin:0;opacity:0.005;cursor:pointer;">',
        '<% options.forEach(function(o) { %>',
        '<option value="<%= o.value %>"',
        '<%= o.selected ? " selected" : "" %>',
        '<%= o.disabled ? " disabled" : "" %>',
        '><%= o.text %></option>',
        '<% }); %>',
        '</select>',
        '</span>'
      ].join(''))
    }

    // set all the options
    this.set(deepExtend({},
      this.constructor.defaults,
      getDataAttributes(this._el),
      opts
    ))
  }

  /**
   * Initialize DOM
   *
   * @param {Element} elem The element to wrap
   */
  _initDOM(elem) {

    // already initialized dom
    if (this.node) return

    // save this
    this._el = elem

    // create the datepicker element
    this.node = document.createElement('div')
    this.node.style.position = 'relative'

    // create the wrapping element
    this.wrapper = document.createElement('div')
    this.wrapper.style.zIndex = 9999

    // insert our element into the dom
    if (elem.parentNode) {
      elem.parentNode.insertBefore(this.node, elem)
    }

    // put stuff in our element
    this.node.appendChild(elem)
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
    this._onmousedown = this._onmousedown.bind(this)
    this._onmousemove = this._onmousemove.bind(this)
    this._onmouseup = this._onmouseup.bind(this)
    this._onclick = this._onclick.bind(this)

    // on focus (or click), open the datepicker
    if ('input' !== this._el.tagName.toLowerCase()) {
      this._el.addEventListener('click', () => this.toggle())
    } else {
      this._el.addEventListener('focus', () => this.open())
    }

    // if we click outside of our element, hide it
    document.addEventListener('mousedown', (e) => {
      const rect = this.wrapper.getBoundingClientRect();
      const cx = e.clientX;
      const cy = e.clientY;
      if (cx < rect.left || cx > rect.right || cy < rect.top || cy > rect.bottom) {
        this.hide();
      }
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
    const {
      ranged,
      multiple,
      classNames: {
        selected: selectedClass,
        highlighted: highlightedClass
      }
    } = this._opts

    const dateNode = closest(e.target, '[data-day]', this.wrapper)
    const date = dateNode ? parseInt(dateNode.dataset.day, 10) : null

    if (date) {

      // not finishing a range
      if (!ranged || !this._dragStart) {
        this._deselect = !ranged && this.hasDate(new Date(date))
        this._highlighted = [date]
        this._dragStart = date

        // deselect previous dates
        if (!multiple) {
          $$(`[data-day].${selectedClass}`, this.wrapper).forEach((el) => {
            removeClass(el, selectedClass)
          })
        }

        // select/deselect date
        $$(`[data-day="${date}"]`, this.wrapper).forEach((el) => {
          toggleClass(el, selectedClass, !this._deselect)
          addClass(el, highlightedClass)
        })

        // pretend we dragged here for a range
      } else {
        this._onmousemove(e)
      }
    }
  }

  /**
   * We're making a selection, and we're allowed to highlight them
   */
  _onmousemove(e) {
    const {
      ranged,
      multiple,
      classNames: {
        selected: selectedClass,
        highlighted: highlightedClass
      }
    } = this._opts

    // shouldn't select
    if (!(ranged || multiple) || e.buttons !== 1) return

    const dateNode = closest(e.target, '[data-day]', this.wrapper)
    const date = dateNode ? parseInt(dateNode.dataset.day, 10) : null

    if (date && this._dragStart) {
      this._highlighted = dateRange(this._dragStart, date).map((d) => d.getTime())
      this._isDragging = date !== this._dragStart

      // reset selected & highlighted classes
      $$(`[data-day].${highlightedClass}`, this.wrapper).forEach((el) => {
        const d = new Date(parseInt(el.dataset.day, 10))
        toggleClass(el, selectedClass, !ranged && this.hasDate(d))
        removeClass(el, highlightedClass)
      })

      // add highlighted and toggle selected classes
      this._highlighted.forEach((t) => {
        $$(`[data-day="${t}"]`, this.wrapper).forEach((el) => {
          toggleClass(el, selectedClass, !this._deselect)
          addClass(el, highlightedClass)
        })
      })
    }
  }

  /**
   * We've finished the potential selection
   */
  _onmouseup(e) {
    const {
      ranged,
      multiple,
      classNames: {
        highlighted: highlightedClass
      }
    } = this._opts

    // remove the highlighting
    $$(`[data-day].${highlightedClass}`, this.wrapper).forEach((el) => {
      removeClass(el, highlightedClass)
    })

    // date nodes only
    if (this._dragStart && closest(e.target, '[data-day]', this.node)) {
      const dates = this._highlighted.map((t) => new Date(t))

      // ranged or not multiple, don't toggle
      if (ranged || !multiple) {
        this.setDate(dates)

        // toggle
      } else {
        this.toggleDate(dates, !this._deselect)
      }

      // rerender
      this.render()

      // maybe hide the calendar
      if (!multiple && (!ranged || this._isDragging)) {
        this.hide()
      }
    }

    // reset this stuff
    if (!ranged || this._isDragging) {
      this._highlighted = []
      this._dragStart = null
    }

    this._isDragging = false
  }

  /**
   * What did you click?
   */
  _onclick(e) {
    const el = e.target

    // previous month
    if (el.hasAttribute('data-prev')) {
      this.prev(el.dataset.prev)

      // next month
    } else if (el.hasAttribute('data-next')) {
      this.next(el.dataset.next)

      // clicked the year select but it hasn't been bound
    } else if (el.hasAttribute('data-year') && !el.onchange) {
      el.onchange = () => {
        const c = el.dataset.year
        const y = this._month.getFullYear()
        this._month.setFullYear(parseInt(el.value) - (c - y))
        this.render()
      }

      // clicked the month select but it hasn't been bound
    } else if (el.hasAttribute('data-month') && !el.onchange) {
      el.onchange = () => {
        this._month.setMonth(el.value - el.dataset.index)
        this.render()
      }

      // clicked the hour select but it hasn't been bound
    } else if (el.hasAttribute('data-hour') && !el.onchange) {
      el.onchange = () => {
        this.setTime(el.dataset.hour, el.value)
        el.parentNode.firstChild.textContent = el.selectedOptions[0].textContent
      }

      // clicked the minute select but it hasn't been bound
    } else if (el.hasAttribute('data-minute') && !el.onchange) {
      el.onchange = () => {
        this.setTime(el.dataset.minute, null, el.value)
        el.parentNode.firstChild.textContent = el.selectedOptions[0].textContent
      }

      // clicked the period select but it hasn't been bound
    } else if (el.hasAttribute('data-period') && !el.onchange) {
      el.onchange = () => {
        const part = el.dataset.period
        const diff = (el.value === 'am' ? -12 : 12)

        $$(`[data-hour="${part}"] option`, this.wrapper).forEach((el) => {
          el.value = parseInt(el.value) + diff
        })

        this.setTime(part, (this._time ? this._time[part][0] : 0) + diff)

        el.parentNode.firstChild.textContent = el.selectedOptions[0].textContent
      }
    }
  }

  /**
   * Set options
   *
   * @param {String|Object} key Option key, or object of properties
   * @param {Mixed} [val] Value of option (not used if object present)
   */
  set(key, val) {
    if (!key) return

    // set multiple options
    if (isPlainObject(key)) {

      // don't render yet
      this._noRender = true

      // prioritize serialize & deserialize
      if (key.serialize) {
        this.set('serialize', key.serialize)
        delete key.serialize
      }
      if (key.deserialize) {
        this.set('deserialize', key.deserialize)
        delete key.deserialize
      }

      // set remaining options
      for (const k in key) {
        this.set(k, key[k])
      }

      // rerender
      this._noRender = false

      // return value
      val = this._opts

      // set individual options
    } else {

      // default opts to pass to setters
      const opts = deepExtend({}, this.constructor.defaults, this._opts)

      // fix the value
      if (key in this._set) {
        val = this._set[key](val, opts)
      }

      // actually set the value
      if (isPlainObject(val)) {
        val = deepExtend({}, opts[key], val)
      }

      this._opts[key] = val
    }

    // rerender
    if (this._isOpen && this.wrapper) {
      this.render()
    }

    // return value
    return val
  }

  /**
   * Get an option
   *
   * @param {String} key Option key
   * @return {Mixed} Option value
   */
  get(key) {

    // multiple options
    if (arguments.length > 1) {
      return [...arguments].reduce((o, a) => {
        o[a] = this.get(a)
        return o
      }, {})
    }

    // single option
    let val = this._opts[key]

    if (isPlainObject(val)) {
      val = deepExtend({}, val)
    }

    return val
  }

  /**
   * Open the calendar to a specific date (or `openOn` date);
   *
   * @param {String|Date} [date=openOn] The date to open to
   */
  open(date) {
    const selected = [].concat(this.getDate())
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

    // set/reset time
    this.setTime(!!this._selected.length)

    // set calendar to date and show it
    this.goToDate(date)
    this.render()
    this.show()
  }

  /**
   * Show the datepicker and position it
   */
  show() {
    if (!this._opts.inline) {
      this.wrapper.style.display = 'block'

      const nRect = this.node.getBoundingClientRect()
      const elRect = this._el.getBoundingClientRect()
      const elBottom = elRect.bottom - nRect.top + 'px'
      const elTop = nRect.bottom - elRect.top + 'px'

      this.wrapper.style.top = elBottom
      this.wrapper.style.right = ''
      this.wrapper.style.bottom = ''
      this.wrapper.style.left = 0

      let rect = this.wrapper.getBoundingClientRect()
      const posRight = rect.right > window.innerWidth
      const posTop = rect.bottom > window.innerHeight

      this.wrapper.style.top = posTop ? '' : elBottom
      this.wrapper.style.right = posRight ? 0 : ''
      this.wrapper.style.bottom = posTop ? elTop : ''
      this.wrapper.style.left = posRight ? '' : 0

      rect = this.wrapper.getBoundingClientRect()
      const fitLeft = rect.right >= rect.width
      const fitTop = rect.bottom > rect.height

      this.wrapper.style.top = posTop && fitTop ? '' : elBottom
      this.wrapper.style.right = posRight && fitLeft ? 0 : ''
      this.wrapper.style.bottom = posTop && fitTop ? elTop : ''
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
   * @param {Integer} [skip] How many months to skip
   */
  next(skip) {
    const date = new Date(this._month.getTime())
    skip = Math.max(skip || 1, 1)
    date.setMonth(date.getMonth() + skip)
    this.goToDate(date)
  }


  /**
   * Go to the previous month
   *
   * @param {Integer} [skip] How many months to skip
   */
  prev(skip) {
    const date = new Date(this._month.getTime())
    skip = Math.max(skip || 1, 1)
    date.setMonth(date.getMonth() - skip)
    this.goToDate(date)
  }

  /**
   * Go to a specific date
   *
   * @param {Date} date Date to set the calendar to
   */
  goToDate(date) {
    date = setToStart(this._opts.deserialize(date))
    date.setDate(1)

    this._month = date

    if (this._isOpen) {
      this.render()
    }

    if (this._opts.onNavigate) {
      this._opts.onNavigate(date)
    }
  }

  /**
   * Check the value for a specific date
   *
   * @param {Date} date The date to check for
   * @return {Boolean} Whether the date is selected
   */
  hasDate(date) {
    date = setToStart(isValidDate(date) ? date : this._opts.deserialize(date))
    return !!this._selected && this._selected.indexOf(date.getTime()) > -1
  }

  /**
   * Add a date to the value
   *
   * @param {Date|Array} date The date(s) to add
   */
  addDate(date) {
    this.toggleDate(date, true)
  }

  /**
   * Remove a date from the value
   *
   * @param {Date|Array} date The date(s) to remove
   */
  removeDate(date) {
    this.toggleDate(date, false)
  }

  /**
   * Toggle a date selection
   *
   * @param {Date|Array} date Date(s) to toggle
   * @param {Boolean} [force] Force to selected/deselected
   */
  toggleDate(date, force) {
    const { ranged, multiple, deserialize } = this._opts
    let dates = [].concat(date)

    // deserialize
    dates = dates.map((d) => isValidDate(d) ? d : deserialize(d))

    // filter valid dates and set to the beginning of the day
    dates = dates.filter((d) => isValidDate(d) && this.dateAllowed(d))

    // create range from selected dates
    if (ranged) {
      dates = dates.concat(this.getDate()).sort(compareDates)
      dates = dates.length ? dateRange(dates[0], dates.pop()) : []

      // there can only be one
    } else if (!multiple) {
      dates = dates.slice(0, 1)
    }

    // loop over date times
    dates.map((d) => setToStart(d).getTime()).forEach((t) => {
      const index = this._selected.indexOf(t)
      const hasDate = index > -1

      // add the date
      if (!hasDate && force !== false) {

        // add/set
        if (ranged || multiple) {
          this._selected.push(t)
        } else {
          this._selected = [t]
        }

        // remove the date
      } else if (hasDate && force !== true) {
        this._selected.splice(index, 1)
      }
    })

    // update the element
    this._update()
  }

  /**
   * Update the attached element and call onChange
   */
  _update() {
    const { onChange } = this._opts

    // update the element
    if (this._el.nodeName.toLowerCase() === 'input') {
      this._el.value = this.getValue()
    } else {
      this._el.dataset.value = this.getValue()
    }

    // callback
    if (onChange) {
      onChange(this.getDate())
    }
  }

  /**
   * Get the selected date(s)
   *
   * @return {Date|Array}
   */
  getDate() {
    const { ranged, multiple, time } = this._opts
    const start = this._time ? this._time.start : [0, 0]

    this._selected = (this._selected || []).sort()

    // return an array
    if (multiple || ranged) {

      // to dates
      const sel = this._selected.map((t) => new Date(t))

      // set time
      if (time && sel.length) {
        sel[0].setHours(start[0], start[1])

        if (sel.length > 1) {
          const end = this._time ? this._time.end : [0, 0]
          sel[sel.length - 1].setHours(end[0], end[1])
        }
      }

      // return
      return sel
    }

    // correct time and return date
    if (this._selected.length) {
      const d = new Date(this._selected[0])
      d.setHours(start[0], start[1])
      return d
    }
  }

  /**
   * Set the date
   *
   * @param {Date|Array} date Date(s) to set the time to
   */
  setDate(date) {
    this._selected = []
    this.addDate(date)
  }

  /**
   * Set the start/end time or part of it
   *
   * @param {String} [part] "start" or "end"
   * @param {Integer} hour Value between 0 and 23 representing the hour
   * @param {Integer} minute Value between 0 and 59 representing the minute
   */
  setTime(part, hour, minute) {
    const { time, defaultTime } = this._opts

    if (!time) return

    if (part === true || !this._time) {
      this._time = deepExtend({}, defaultTime)
    }

    // set time
    if (part && part !== true) {

      // default set start
      if (typeof part === 'number') {
        minute = hour
        hour = part
        part = 'start'
      }

      // correct params
      part = part === 'end' ? part : 'start'
      hour = hour ? parseInt(hour, 10) : false
      minute = minute ? parseInt(minute, 10) : false

      // set hours
      if (hour && !isNaN(hour)) {
        this._time[part][0] = hour
      }

      // set minutes
      if (minute && !isNaN(minute)) {
        this._time[part][1] = minute
      }
    }

    // update the element
    this._update()
  }

  /**
   * Get the value
   *
   * @return {String} The string value
   */
  getValue() {
    const { ranged, separator, serialize, toValue } = this._opts
    let selected = [].concat(this.getDate() || [])

    if (ranged && selected.length > 1) {
      selected = [selected[0], selected.pop()]
    }

    let value = selected.map(serialize).join(separator)

    if (toValue) {
      value = toValue(value, selected)
    }

    return value
  }

  /**
   * Set the value to a specific date
   *
   * @param {String} value The string value
   */
  setValue(val) {
    const { ranged, time, separator, serialize, fromValue } = this._opts
    this._selected = []

    const dates = fromValue ? fromValue(val) :
      val.split(separator).filter(Boolean).map(serialize)

    // set dates
    this.addDate(dates)

    // set time
    if (time && dates.length) {
      const start = dates.sort(compareDates)[0]
      this.setTime('start', start.getHours(), start.getMinutes())

      if (time === 'ranged' || ranged) {
        const end = dates[dates.length - 1]
        this.setTime('end', end.getHours(), end.getMinutes())
      }
    }
  }

  /**
   * Check if a date is allowed in the datepicker
   *
   * @param {Date} date The date to check
   * @param {String} [dim] The dimension to check ('year' or 'month')
   * @return {Boolean} Whether the date is allowed or not
   */
  dateAllowed(date, dim) {
    const { min, max, within, without, deserialize } = this._opts
    let belowMax, aboveMin = belowMax = true

    date = setToStart(isValidDate(date) ? date : deserialize(date))

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
   * Render the calendar HTML
   */
  render() {
    const { ranged, time, onRender } = this._opts

    // don't render
    if (this._noRender || !this._renderers) return

    // avoid duplicate calls to getData
    const renderCache = {}
    const getData = (i) => renderCache[i] || (renderCache[i] = this.getData(i))

    // render html
    this.wrapper.innerHTML = this._renderers.container({

      // render header
      renderHeader: (i = 0) => this._renderHeader(getData(i)),

      // render calendar
      renderCalendar: (i = 0) => {
        const data = getData(i)

        return this._renderers.calendar({
          ...data,

          // render header within calendar
          renderHeader: () => this._renderHeader(data),

          // render day
          renderDay: (day) => this._renderers.day(day)
        })
      },

      // render timepicker
      renderTimepicker: () => {
        let html = ''

        if (time) {
          html = this._renderTimepicker('start')

          if (time === 'ranged' || ranged) {
            html += this._renderTimepicker('end')
          }
        }

        return html
      }
    })

    // callback
    if (onRender) {
      onRender(this.wrapper.firstChild)
    }
  }

  /**
   * Get an object containing data for a calendar month
   *
   * @param {Integer} [index=0] Offset month to render
   * @return {Object} Object containing data for the calendar month
   */
  getData(index = 0) {
    const {
      i18n,
      weekStart,
      serialize,
      min: dateMin,
      max: dateMax,
      classNames: {
        selected: selectedClass,
        disabled: disabledClass,
        otherMonth: otherMonthClass,
        weekend: weekendClass,
        today: todayClass
      }
    } = this._opts

    const date = new Date(this._month.getTime())
    date.setMonth(date.getMonth() + index)

    const month = date.getMonth()
    const year = date.getFullYear()

    // get next/prev month to determine if they're allowed
    const nextMonth = new Date(date.getTime())
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    nextMonth.setDate(1)

    const prevMonth = new Date(date.getTime())
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    prevMonth.setDate(getDaysInMonth(prevMonth))

    // collect the days' data
    const days = []

    // setup the start day
    let start = date.getDay() - weekStart
    while (start < 0) start += 7

    // number of days in the month, padded to fit a calendar
    let dayCount = getDaysInMonth(year, month) + start
    while (dayCount % 7) dayCount += 1

    // today!
    const today = setToStart(new Date())

    // loop through the calendar days
    for (let i = 0; i < dayCount; i++) {
      const day = new Date(year, month, 1 + (i - start))
      const dayMonth = day.getMonth()
      const weekday = day.getDay()

      const isSelected = this.hasDate(day)
      const isDisabled = !this.dateAllowed(day)
      const isPrevMonth = dayMonth < month
      const isNextMonth = dayMonth > month
      const isThisMonth = !isPrevMonth && !isNextMonth
      const isWeekend = (weekday === 0 || weekday === 6)
      const isToday = day.getTime() === today.getTime()

      // classNames
      const classNames = []
      if (isSelected) classNames.push(selectedClass)
      if (isDisabled) classNames.push(disabledClass)
      if (!isThisMonth) classNames.push(otherMonthClass)
      if (isWeekend) classNames.push(weekendClass)
      if (isToday) classNames.push(todayClass)

      // basic day data
      days.push({
        _date: day,

        date: serialize(day),
        daynum: day.getDate(),
        timestamp: day.getTime(),
        weekday: i18n.weekdays[weekday],

        isSelected,
        isDisabled,
        isPrevMonth,
        isNextMonth,
        isThisMonth,
        isWeekend,
        isToday,

        classNames
      })
    }

    // return the calendar data
    return {
      _date: date,
      index,

      year,
      month: i18n.months[month],
      days,

      weekdays: i18n.weekdays,
      hasNext: (!dateMax || nextMonth <= dateMax),
      hasPrev: (!dateMin || prevMonth >= dateMin)
    }
  }

  /**
   * Generic render header
   *
   * @param {Object} data Data from `this.getData()`
   * @return {String} HTML for the calendar header
   */
  _renderHeader(data) {
    const { yearRange, i18n } = this._opts
    const { _date, index, year } = data
    const month = _date.getMonth()

    return this._renderers.header({
      ...data,

      // render month select
      renderMonthSelect: (i = index) => {
        const d = new Date(_date.getTime())
        const options = []

        for (let m = 0; m < 12; m++) {
          d.setMonth(m)

          options.push({
            text: i18n.months[m],
            disabled: !this.dateAllowed(d, 'month'),
            selected: m === month,
            value: m
          })
        }

        return this._renderers.select({
          index: i,
          type: 'month',
          text: i18n.months[month],
          value: month,
          options
        })
      },

      // render year select
      renderYearSelect: (i = index) => {
        const d = new Date(_date.getTime())
        let y = year - yearRange
        const max = year + yearRange
        const options = []

        for (; y <= max; y++) {
          d.setFullYear(y)

          options.push({
            disabled: !this.dateAllowed(d, 'year'),
            selected: y === year,
            value: y,
            text: y
          })
        }

        return this._renderers.select({
          index: i,
          type: 'year',
          text: year,
          value: year,
          options
        })
      }
    })
  }

  /**
   * Individual timepicker render
   *
   * @param {String} name "start" or "end"
   */
  _renderTimepicker(name) {
    const { ranged, time: timepicker, i18n } = this._opts

    if (!timepicker) return

    if (!this._time) {
      this.setTime(true)
    }

    const time = this._time[name]
    let label = i18n.time[0]

    if (timepicker === 'ranged' || ranged) {
      label = i18n.time[name === 'start' ? 1 : 2]
    }

    return this._renderers.timepicker({
      label,

      renderHourSelect: (long = false) => {
        const options = []

        const hour = time[0]
        const end = long ? 24 : 12

        for (let h = 0; h < end; h++) {
          options.push({
            text: (long || h) ? h : '12',
            selected: hour === h,
            disabled: false,
            value: h
          })
        }

        if (!long && hour >= 12) {
          options.forEach((o) => o.selected = (o.value += 12) === hour)
        } else if (!long) {
          options.push(options.shift())
        }

        const text = options.filter((o) => o.selected)[0].text

        return this._renderers.select({
          index: 0,
          type: 'hour',
          value: name,
          options,
          text
        })
      },

      renderMinuteSelect: (incr = 15) => {
        const options = []

        for (let i = 0; i < 60; i += incr) {
          options.push({
            text: i < 10 ? '0' + i : i,
            selected: time[1] === i,
            disabled: false,
            value: i
          })
        }

        const text = options.filter((o) => o.selected)[0].text

        return this._renderers.select({
          index: null,
          type: 'minute',
          value: name,
          options,
          text
        })
      },

      renderPeriodSelect: () => {
        return this._renderers.select({
          index: null,
          type: 'period',
          text: time[0] >= 12 ? 'PM' : 'AM',
          value: name,

          options: [{
            text: 'AM',
            value: 'am',
            selected: time[0] < 12
          }, {
            text: 'PM',
            value: 'pm',
            selected: time[0] >= 12
          }]
        })
      }
    })
  }
}
