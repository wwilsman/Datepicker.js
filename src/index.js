import {
  $$,
  transform
} from './utils.js'

import defaultOptions from './defaults'

import {
  get,
  set,
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

import {
  update,
  open,
  show,
  hide,
  toggle,
  next,
  prev,
  goToDate,
  hasDate,
  addDate,
  removeDate,
  toggleDates,
  getSelected,
  getValue,
  setValue,
  dateAllowed
} from './methods'

import {
  render,
  getCalendar
} from './render'

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
    this.setValue(isInput ? elem.value : (elem.dataset.value || ''))

    // callback option
    if (typeof this._opts.onInit === 'function')
      opts.onInit.call(this, elem)
  }

  /**
   * Option methods
   */
  get = get
  set = set
  _initOptions = _initOptions

  /**
   * Initialize DOM
   */
  _initDOM = _initDOM

  /**
   * Event methods
   */
  _initEvents = _initEvents
  _onmousedown = _onmousedown
  _onmousemove = _onmousemove
  _onmouseup = _onmouseup
  _onclick = _onclick

  /**
   * Public methods
   */
  update = update
  open = open
  show = show
  hide = hide
  toggle = toggle
  next = next
  prev = prev
  goToDate = goToDate
  hasDate = hasDate
  addDate = addDate
  removeDate = removeDate
  toggleDates = toggleDates
  getSelected = getSelected
  getValue = getValue
  setValue = setValue
  dateAllowed = dateAllowed

  /**
   * Render methods
   */
  render = render
  getCalendar = getCalendar
}
