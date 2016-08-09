import {
  dateInArray,
  compareDates,
  isValidDate,
  setToStart
} from './utils.js'

/**
 * Update the bound element and trigger `onUpdate` callback
 */
export function update() {
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
export function open(date) {
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
export function show() {
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
export function hide() {
  if (!this._opts.inline) {
    this.wrapper.style.display = 'none'
    this._isOpen = false
  }
}

/**
 * Toggle the datepicker
 */
export function toggle() {
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
export function next(skip) {
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
export function prev(skip) {
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
export function goToDate(date) {
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
export function hasDate(date) {
  date = setToStart(this._opts.deserialize(date))
  return !!this._selected[date.getTime()]
}

/**
 * Add a date to the value
 *
 * @param {(string|Date)} date - The date to add
 */
export function addDate(date) {
  this.toggleDates(date, true)
}

/**
 * Remove a date from the value
 *
 * @param {(string|Date)} date - The date to remove
 */
export function removeDate(date) {
  this.toggleDates(date, false)
}

/**
 * Toggle a date selection
 *
 * @param {(string|Date)} date - Date to toggle
 * @param {boolean} [force] - Force to selected/deselected
 */
export function toggleDates(dates, force) {
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
export function getSelected() {
  let selected = []
  for (let t in this._selected) selected.push(this._selected[t])
  return this._opts.multiple ? selected.sort(compareDates) : selected[0]
}

/**
 * Get the value
 */
export function getValue() {
  let selected = transform((this.getSelected() || []), this._opts.serialize, this)
  return [].concat(selected).join(this._opts.separator)
}

/**
 * Set the value to a specific date
 *
 * @param {string} value - The date value
 */
export function setValue(val) {
  this._selected = {}
  this.addDate(val.split(this._opts.separator))
}

/**
 * Check if a date is allowed in the datepicker
 *
 * @param {(string|Date)} date - The date to check
 * @param {string} [dim] - The dimension to check ('year' or 'month')
 */
export function dateAllowed(date, dim) {
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
