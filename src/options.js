import {
  toggleClass,
  isValidDate,
  setToStart,
  transform,
  tmpl
} from './helpers'

// update inline className
export function updateInline(isInline, opts) {
  let { classNames: { inline: inlineClass } } = opts

  if (this.node) {
    toggleClass(this.node, inlineClass, isInline)
    this.wrapper.style.position = isInline ? '' : 'absolute'
    this.wrapper.style.display = isInline ? '' : 'none'
  }

  this._isOpen = isInline
  return isInline
}

// update classNames
export function updateClassNames(classNames, opts) {
  let {
    base: baseClass,
    inline: inlineClass,
    wrapper: wrapperClass
  } = classNames

  let { inline: isInline } = opts

  if (this.node) {
    for (let key in classNames) {
      switch (key) {
        case 'base':
        case 'inline':
          this.node.className = baseClass + (isInline ? ` ${inlineClass}` : '')
          break

        case 'wrapper':
          this.wrapper.className = wrapperClass
          break
      }
    }
  }

  return classNames
}

// deserialize min/max
export function deserializeMinMax(value, opts) {
  let { deserialize } = opts
  value = !value ? false : transform(value, deserialize, this)
  return isValidDate(value) ? value : false
}

// deserialze within/without
export function deserializeWithinWithout(arr, opts) {
  let { deserialize } = opts

  if (arr.length) {
    arr = setToStart(transform(arr, deserialize, this))
    arr = [].concat(arr).filter(isValidDate)
  }

  return arr.length ? arr : false
}

// if needed, deserialize openOn and set the initial calendar month
export function deserializeOpenOn(openOn, opts) {
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
export function constrainWeekstart(weekstart) {
  return Math.min(Math.max(weekstart, 0), 6)
}

// bind option functions
export function bindOptionFunctions(fn) {
  return (typeof fn === 'function') ? fn.bind(this) : false
}

// template functions
export function createTemplateRenderers(templates) {
  this._renderers = this._renderers || {}

  for (let name in templates) {
    this._renderers[name] = tmpl(templates[name])
  }

  return templates
}
