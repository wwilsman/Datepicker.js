// Our default options
export default {
  openOn: 'first',
  inline: false,
  multiple: false,
  ranged: false,

  min: false,
  max: false,
  within: false,
  without: false,
  yearRange: 5,
  weekStart: 0,

  separator: ',',

  serialize(date) {
    return date.toLocaleDateString()
  },

  deserialize(str) {
    return new Date(str)
  },

  onInit: false,
  onChange: false,
  onRender: false,
  onNavigate: false,

  i18n: {
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    weekdaysShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  },

  classNames: {
    default: 'datepicker',
    inline: 'datepicker is-inline',
    multiple: 'datepicker is-multiple',
    wrapper: 'datepicker__wrapper'
  },

  templates: {
    container: [
      '<div class="datepicker__container">',
        '<%= renderHeader() %>',
        '<%= renderCalendar() %>',
      '</div>'
    ].join(''),

    header: [
      '<header class="datepicker__header">',
        '<a class="datepicker__prev<%= (hasPrev) ? "" : " is-disabled" %>" data-prev>&lsaquo;</a>',
        '<span class="datepicker__title" data-title><%= month %><%= renderMonthSelect() %></span>',
        '<span class="datepicker__title" data-title><%= year %><%= renderYearSelect() %></span>',
        '<a class="datepicker__next<%= (hasNext) ? "" : " is-disabled" %>" data-next>&rsaquo;</a>',
      '</header>'
    ].join(''),

    calendar: [
      '<table class="datepicker__cal">',
        '<thead>',
          '<tr>',
            '<% weekdaysShort.map(function(name) { %>',
              '<th><%= name %></th>',
            '<% }) %>',
          '</tr>',
        '</thead>',
        '<tbody>',
          '<% days.map(function(day, i) { %>',
            '<%= (i % 7 == 0) ? "<tr>" : "" %>',
              '<%= renderDay(day) %>',
            '<%= (i % 7 == 6) ? "</tr>" : "" %>',
          '<% }) %>',
        '</tbody>',
      '</table>',
    ].join(''),

    day: [
      '<% var cls = ["datepicker__day"]; %>',
      '<% if (isSelected) cls.push("is-selected"); %>',
      '<% if (isDisabled) cls.push("is-disabled"); %>',
      '<% if (!isThisMonth) cls.push("is-otherMonth"); %>',
      '<% if (isToday) cls.push("is-today"); %>',
      '<td class="<%= cls.join(" ") %>" data-day="<%= date %>"><div>',
        '<span class="datepicker__daynum"><%= daynum %></span>',
      '</div></td>'
    ].join('')
  }
}
