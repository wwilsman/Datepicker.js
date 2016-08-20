export function $$(selector, ctx) {
  var els = (ctx||document).querySelectorAll(selector);
  return Array.prototype.slice.call(els);
}

export function matches(el, selector) {
  var matchesSelector = el.matches || el.matchesSelector || el.webkitMatchesSelector || el.msMatchesSelector;
  return matchesSelector && matchesSelector.call(el, selector);
}

export function closest(el, selector, top) {
  var toofar = top && !top.contains(el);

  while (el && !toofar) {
    if (matches(el, selector)) return el;
    toofar = top && !top.contains(el.parentNode);
    el = el.parentNode;
  }

  return false;
}

export function addClass(el, c) {
  el.classList.add.apply(el.classList, c.split(' ').filter(Boolean));
}

export function removeClass(el, c) {
  el.classList.remove.apply(el.classList, c.split(' ').filter(Boolean));
}

export function hasClass(el, c) {
  return c && el.classList.contains(c);
}

export function toggleClass(el, c, force) {
  if (typeof force == 'undefined') force = !hasClass(el, c);
  c && (!!force ? addClass(el, c) : removeClass(el, c));
}

export function getDataAttributes(elem) {
  var trim = function(s) { return s.trim(); };
  var obj = {};

  if (!elem || !elem.dataset) return obj

  for (var key in elem.dataset) {
    var val = elem.dataset[key];
    if (/true|false/.test(val.toLowerCase())) {
      val = val.toLowerCase() == 'true';
    } else if (val[0] == '[' && val.substr(-1) == ']') {
      val = transform(val.substr(1, val.length - 2).split(','), trim);
    } else if (/^\d*$/.test(val)) {
      val = parseInt(val, 10);
    }

    obj[key] = val;
  }

  return obj;
}

export function isLeapYear(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}

export function getDaysInMonth(year, month) {
  if (year instanceof Date) {
    month = year.getMonth();
    year = year.getFullYear();
  }

  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

export function dateInArray(date, array, dim) {
  for (var i = 0; i < array.length; i++) {
    var a = date;
    var b = array[i];

    if (dim == 'year') {
      a = a.getFullYear();
      b = b.getFullYear();
    } else if (dim == 'month') {
      a = a.getMonth();
      b = b.getMonth();
    } else {
      a = a.getTime();
      b = b.getTime();
    }

    if (a == b) {
      return true;
    }
  }

  return false;
}

export function compareDates(a, b) {
  return a.getTime() - b.getTime();
}

export function isValidDate(date) {
  return !!date && date instanceof Date && !isNaN(date.getTime());
}

export function setToStart(date) {
  return transform(date, function(d) {
    if (d) d.setHours(0,0,0,0);
    return d;
  });
}

export function dateRange(start, end) {
  start = new Date(start);
  end = new Date(end);
  var date = start;

  if (start > end) {
    start = end;
    end = date;
    date = start;
  }

  var dates = [new Date(date)];

  while (date < end) {
    date.setDate(date.getDate() + 1);
    dates.push(new Date(date));
  }

  return dates;
}

export function isPlainObject(obj) {
  if (typeof obj == 'object' && obj !== null) {
    var proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
  }

  return false;
}

export function deepExtend(obj) {
  var other = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < other.length; i++) {
    for (var p in other[i]) {
      if (obj[p] !== undefined && typeof other[i][p] === 'object' && other[i][p] !== null && other[i][p].nodeName === undefined) {
        if (other[i][p] instanceof Date) {
          obj[p] = new Date(other[i][p].getTime());
        } if (Array.isArray(other[i][p])) {
          obj[p] = other[i][p].slice(0);
        } else {
          obj[p] = deepExtend(obj[p], other[i][p]);
        }
      } else {
        obj[p] = other[i][p];
      }
    }
  }

  return obj;
}

export function transform(obj, fn, ctx) {
  var ret = [].concat(obj).map(fn, ctx);
  return ret.length === 1 ? ret[0] : ret;
}

export function tmpl(str, data){
  var fn = new Function("obj",
    "var p=[],print=function(){p.push.apply(p,arguments);};" +
    "with(obj){p.push('" +

    str
      .replace(/[\r\t\n]/g, " ")
      .split("<%").join("\t")
      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
      .replace(/\t=(.*?)%>/g, "',$1,'")
      .split("\t").join("');")
      .split("%>").join("p.push('")
      .split("\r").join("\\'")
  + "');}return p.join('');");

  return data ? fn( data ) : fn;
}
