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

    // options pass through here before being set
    let inline = updateInline.bind(this)
    let minMax = deserializeMinMax.bind(this)
    let withInOut = deserializeWithinWithout.bind(this)
    let openOn = deserializeOpenOn.bind(this)
    let weekstart = constrainWeekstart.bind(this)
    let classNames = updateClassNames.bind(this)
    let templates = createTemplateRenderers.bind(this)

    this._setters = {
      inline,
      min: minMax,
      max: minMax,
      within: withInOut,
      without: withInOut,
      openOn,
      weekstart,
      classNames,
      templates
    }

    // setup renderers
    this._renderers = {
      select: tmpl([
        '<span style="position:relative"><%= o[c] %>',
          '<select data-<%= t %>="<%= c %>" data-index="<%= i %>"',
              'style="position:absolute;top:0;left:0;width:100%;height:100%;margin:0;opacity:0.005;">',
            '<% for (var v in o) { %>',
              '<option value="<%= v %>"<%= (v === c) ? " selected" : "" %>><%= o[v] %></option>',
            '<% } %>',
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
    let {
      ranged,
      multiple,
      serialize,
      deserialize,
      classNames: {
        selected: selectedClass,
        highlighted: highlightedClass
      }
    } = this._opts

    let dateNode = closest(e.target, '[data-day]', this.wrapper)

    if (dateNode) {
      let date = deserialize(dateNode.dataset.day)

      this._highlighted = []
      this._dragDate = this._dragDate || date
      this._selectRange = ranged && this._selectRange

      // maybe deselect old selection
      if (!multiple && !this._selectRange) {
        $$(`[data-day].${selectedClass}`, this.wrapper).forEach((el) => {
          removeClass(el, selectedClass)
        })
      }

      // start selection
      if (!this._selectRange) {
        this._dragDate = date
        this._deselect = !ranged && this.hasDate(date)

        $$(`[data-day="${dateNode.dataset.day}"]`, this.wrapper).forEach((el) => {
          toggleClass(el, selectedClass, !this._deselect)
          addClass(el, highlightedClass)
        })

      // ranged selection
      } else {
        this._highlighted = dateRange(this._dragDate, date)

        this._highlighted.forEach((d) => {
          $$(`[data-day="${serialize(d)}"]`, this.wrapper).forEach((el) => {
            toggleClass(el, selectedClass, !this._deselect)
            addClass(el, highlightedClass)
          })
        })
      }
    }
  }

  /**
   * We're making a selection, and we're allowed to highlight them
   */
  _onmousemove(e) {
    let {
      ranged,
      multiple,
      serialize,
      deserialize,
      classNames: {
        selected: selectedClass,
        highlighted: highlightedClass
      }
    } = this._opts

    if (!multiple && !ranged) return

    let dateNode = closest(e.target, '[data-day]', this.wrapper)
    let date = dateNode ? deserialize(dateNode.dataset.day) : null

    if (e.buttons === 1 && this._dragDate && date) {
      this._highlighted = dateRange(this._dragDate, date)
      this._isDragging = true

      $$(`[data-day].${highlightedClass}`, this.wrapper).forEach((el) => {
        toggleClass(el, selectedClass, this.hasDate(el.dataset.day))
        removeClass(el, highlightedClass)
      })

      this._highlighted.forEach((d) => {
        $$(`[data-day="${serialize(d)}"]`, this.wrapper).forEach((el) => {
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
    let {
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
    if (closest(e.target, '[data-day]', this.node)) {

      // make sure we've got at least one
      if (!this._highlighted.length) {
        this._highlighted.push(this._dragDate)
      }

      // we're making a drag selection
      if (this._isDragging) {

        // reset selection with range
        if (ranged) {
          this._selected = {}
          this._selectRange = false
        }

        // actually make the selection
        this.toggleDate(this._highlighted, !this._deselect)

        // rerender
        this.render()

        // you can't select multiple or we've finished a range, hide the calendar
        if (!multiple) {
          this.hide()
        }

      // select a range
      } else if (this._highlighted.length > 0 && ranged) {

        // actually make the selection
        if (this._selectRange) {
          this.toggleDate(this._highlighted, !this._deselect)
          this._selectRange = false
          this.hide()

        } else if (!this._deselect) {
          this.setDate(this._highlighted)
          this._selectRange = true
        }

        this.render()
      }
    }

    // reset this stuff
    this._isDragging = false
    this._highlighted = []

    if (!ranged || !this._selectRange) {
      this._dragDate = null
    }
  }

  /**
   * What did you click?
   */
  _onclick(e) {

    // previous month
    if (e.target.hasAttribute('data-prev')) {
      this.prev(e.target.dataset.prev)

    // next month
    } else if (e.target.hasAttribute('data-next')) {
      this.next(e.target.dataset.next)

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
      for (let k in key) this.set(k, key[k])

      // rerender
      this._noRender = false;

      if (this._isOpen && this.wrapper) {
        this.render()
      }

      // return all options
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

    if (isPlainObject(val)) {
      val = deepExtend({}, opts[key], val)
    }

    // actually set the value
    this._opts[key] = val

    // rerender
    if (this._isOpen && this.wrapper) {
      this.render()
    }

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
    this.render()
    this.show()
  }

  /**
   * Show the datepicker and position it
   */
  show() {
    if (!this._opts.inline) {
      this.wrapper.style.display = 'block'
      this.wrapper.style.top = '100%'
      this.wrapper.style.left = 0

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
    return !!this._selected && !!this._selected[date.getTime()]
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
    let { ranged, multiple, deserialize, onChange } = this._opts
    dates = [].concat(dates).filter((d) => !!d && this.dateAllowed(d)).map(deserialize)

    dates.map(setToStart).forEach((d) => {
      let t = d.getTime()

      // add the date
      if (!this._selected[t] && (force === undefined || !!force)) {

        // clear old value
        if (!multiple && !ranged) this._selected = {}

        this._selected[t] = d

      // remove the date
      } else if (this._selected[t] && !force) {
        delete this._selected[t]
      }
    })

    // create range from selected dates
    if (ranged && (dates = this.getDate()).length) {
      this._selected = dateRange(dates[0], dates.pop()).reduce((s, d) => {
        s[d.getTime()] = d
        return s
      }, {})
    }

    // update the element
    if (this._el.nodeName.toLowerCase() === 'input') {
      this._el.value = this.getValue()
    } else {
      this._el.dataset.value = this.getValue()
    }

    // callback
    if (onChange) onChange(this.getDate())
  }

  /**
   * Get the selected dates
   */
  getDate() {
    let { ranged, multiple } = this._opts
    let selected = []

    for (let t in this._selected) {
      selected.push(this._selected[t])
    }

    return (multiple || ranged) ? selected.sort(compareDates) : selected[0]
  }

  /**
   * Set the date
   *
   * @param {Date} date [description]
   */
  setDate(date) {
    date = [].concat(date)
    this._selected = {}

    date.forEach((d) => {
      if (this.dateAllowed(d)) {
        this._selected[d.getTime()] = new Date(d)
      }
    })
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
    let { yearRange, i18n, onRender } = this._opts

    // don't render
    if (this._noRender || !this._renderers) return

    // avoid duplicate calls to getCalendar
    let renderCache = {}
    let getData = (i) => renderCache[i] || (renderCache[i] = this.getCalendar(i))

    // generic render header
    let renderHeader = (data) => {
      let { _date, index, year } = data

      return this._renderers.header({ ...data,

        // render month select
        renderMonthSelect: (i = index) => {
          let d = new Date(_date.getTime())
          let o = {}

          for (let m = 0; m < 12; m++) {
            if (this.dateAllowed(d.setMonth(m), 'month')) {
              o[m] = i18n.months[m]
            }
          }

          return this._renderers.select({
            o, i, t: 'month', c: _date.getMonth()
          })
        },

        // render year select
        renderYearSelect: (i = index) => {
          let d = new Date(_date.getTime())
          let y = year - yearRange
          let max = year + yearRange
          let o = {}

          for (; y <= max; y++) {
            if (this.dateAllowed(d.setFullYear(y), 'year')) {
              o[y] = y
            }
          }

          return this._renderers.select({
            o, i, t: 'year', c: year
          })
        }
      })
    }

    // render html
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

    // callback
    if (onRender) onRender(this.wrapper.firstChild)
  }

  /**
   * Get an object containing data for a calendar month
   *
   * @param {integer} [i=0] - Offset month to render
   */
  getCalendar(index = 0) {
    let {
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
    let start = date.getDay() - weekStart
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
      let weekday = day.getDay()

      let isSelected = this.hasDate(day)
      let isDisabled = !this.dateAllowed(day)
      let isPrevMonth = dayMonth < month
      let isNextMonth = dayMonth > month
      let isThisMonth = !isPrevMonth && !isNextMonth
      let isWeekend = (weekday === 0 || weekday === 6)
      let isToday = day.getTime() === today.getTime()

      // classNames
      let classNames = []
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
        weekday: i18n.weekdays[weekday],
        weekdayShort: i18n.weekdays[weekday],

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

      year,
      month: i18n.months[month],
      days,

      weekdays: i18n.weekdays,
      weekdays: i18n.weekdays,
      hasNext: (!dateMax || nextMonth <= dateMax),
      hasPrev: (!dateMin || prevMonth >= dateMin)
    }
  }
}
