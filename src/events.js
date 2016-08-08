import {
  $$,
  closest,
  compareDates,
  dateRange
} from './utils'

/*
 * bind event listeners
 */
export function _initEvents() {

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

/*
 * when we mousedown on a "date node," highlight it and start the selection
 */
export function _onmousedown(e) {
  let { deserialize } = this._opts
  let dateNode = closest(e.target, '[data-date]', this.node)

  if (dateNode) {
    addClass(dateNode, 'is-highlighted')
    this._highlighted = [deserialize(dateNode.dataset.date)]
    this._isDragging = true
  }
}

/*
 * we're making a selection, and we're allowed to highlight them
 */
export function _onmousemove(e) {
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

  if (date && this._isDragging && !compareDates(date, this._highlighted[0])) {
    this._highlighted = dateRange(this._highlighted[0], date)

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

/*
 * we've finished the potential selection
 */
export function _onmouseup(e) {
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
    this.toggleDates(this._highlighted)

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

/*
 * what did you click?
 */
export function _onclick(e) {

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
