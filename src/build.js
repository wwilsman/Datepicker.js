export function _initDOM(elem) {
  let {
    inline: isInline,
    classNames: {
      base: baseClass,
      inline: inlineClass,
      wrapper: wrapperClass
    }
  } = this._opts

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
