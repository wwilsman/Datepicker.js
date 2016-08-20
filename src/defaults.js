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
    weekdays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  },

  classNames: {
    base: 'datepicker',
    wrapper: 'datepicker__wrapper',
    inline: 'is-inline',
    selected: 'is-selected',
    disabled: 'is-disabled',
    highlighted: 'is-highlighted',
    otherMonth: 'is-otherMonth',
    weekend: 'is-weekend',
    today: 'is-today'
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
        '<span class="datepicker__title" data-title><%= renderMonthSelect() %></span>',
        '<span class="datepicker__title" data-title><%= renderYearSelect() %></span>',
        '<a class="datepicker__next<%= (hasNext) ? "" : " is-disabled" %>" data-next>&rsaquo;</a>',
      '</header>'
    ].join(''),

    calendar: [
      '<table class="datepicker__cal">',
        '<thead>',
          '<tr>',
            '<% weekdays.forEach(function(name) { %>',
              '<th><%= name %></th>',
            '<% }); %>',
          '</tr>',
        '</thead>',
        '<tbody>',
          '<% days.forEach(function(day, i) { %>',
            '<%= (i % 7 == 0) ? "<tr>" : "" %>',
              '<%= renderDay(day) %>',
            '<%= (i % 7 == 6) ? "</tr>" : "" %>',
          '<% }); %>',
        '</tbody>',
      '</table>',
    ].join(''),

    day: [
      '<% classNames.push("datepicker__day"); %>',
      '<td class="<%= classNames.join(" ") %>" data-day="<%= timestamp %>"><div>',
        '<span class="datepicker__daynum"><%= daynum %></span>',
      '</div></td>'
    ].join('')
  }
}
