import {
  toggleClass,
  getDataAttributes,
  isValidDate,
  setToStart,
  transform,
  deepExtend,
  tmpl
} from './utils'

// update inline className
function updateInline(isInline, opts) {
  let { classNames: { inline: inlineClass } } = opts
  if (this.node) toggleClass(this.node, inlineClass, isInline)
  return isInline
}

// deserialize min/max
function deserializeMinMax(value, opts) {
  let { deserialize } = opts
  value = !value ? false : transform(value, deserialize, this)
  return isValidDate(value) ? value : false
}

// deserialze within/without
function deserializeWithinWithout(arr, opts) {
  let { deserialize } = opts

  if (arr.length) {
    arr = setToStart(transform(arr, deserialize, this))
    arr = [].concat(arr).filter(isValidDate)
  }

  return arr.length ? arr : false
}

// if needed, deserialize openOn and set the initial calendar month
function deserializeOpenOn(openOn, opts) {
  let { deserialize } = opts

  // deserialize
  if (typeof openOn == 'string' && !/^(first|last|today)$/.test(openOn)) {
    openOn = deserialize.call(this, openOn)
    if (!isValidDate(openOn)) openOn = new Date()
  }

  // set the initial calendar date
  if (!this._month) {
    let date = openOn

    if (typeof date === 'string' || !isValidDate(date))
      date = new Date()

    date = setToStart(new Date(date.getTime()))
    date.setDate(1)

    this._month = date
  }

  return openOn
}

// constrain weekstart
function constrainWeekstart(weekstart) {
  return Math.min(Math.max(weekstart, 0), 6)
}

// template functions
function createTemplateRenderers(templates) {
  this._renderers = this._renderers || {}

  for (let name in templates) {
    this._renderers[name] = tmpl(templates[name])
  }

  return templates
}

// initialize options
export function _initOptions(opts) {
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
 * Set options
 *
 * @param {(string|Object)} prop - Option key, or object of properties
 * @param {mixed} [value] - Value of option (not used if object present)
 * @param {boolean} [noRedraw] - Do not redraw the calendar afterwards
 */
export function set(key, val) {
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
export function get(key) {
  return key.split('.').reduce((v, k) => v[k], this._opts)
}
