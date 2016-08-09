import {
  getDaysInMonth,
  setToStart
} from './utils.js'

/**
 * render the calendar HTML
 */
export function render() {
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
export function getCalendar(index = 0) {
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
