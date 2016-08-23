# Datepicker.js [![Build Status](https://travis-ci.org/wwilsman/Datepicker.js.svg?branch=master)](https://travis-ci.org/wwilsman/Datepicker.js)

See the demo [here](https://wwilsman.github.io/Datepicker.js/)


## Quick Start

Include the files

```html
<!-- or another theme from `dist/css` -->
<link rel="stylesheet" href="datepicker.material.css">
<script src="datepicker.js"></script>
```

Distiguish the Datepicker

```html
<input type="text" id="datepicker">
```

Initialize Datepicker.js

```js
var datepicker = new Datepicker('#datepicker');
```


## Basic Usage

Call the constructor with an element or selector. Passing a selector other than an ID will return an array of initialized Datepickers matching the selector.

```js
/* All valid */

new Datepicker(document.getElementById('datepicker'));
// => Datepicker

new Datepicker('#datepicker');
// => Datepicker

new Datepicker('.datepicker');
// => [Datepicker, ...]
```

Pass an object of options to customize the Datepicker during initialization. Data attributes can also be used to set options.

```html
<input type="hidden" id="datepicker" data-inline="true"/>
```

```js
var datepicker = new Datepicker('#datepicker', {
  multiple: true,
  inline: false
});

datepicker.get('inline');
// => true

datepicker.get('multiple');
// => true
```


## Options

#### Inline Datepicker

**`inline:`** (`true|false`)

Best used with hidden inputs. Enabling this will render the Datepicker inline with the input and prevent show/hide functionality.

#### Multiple Dates

**`multiple:`** (`true|false`)

Enables the ability for multiple dates to be selected. Clicking and dragging selects/deselects a range of dates.

#### Ranged Selection

**`ranged:`** (`true|false`)

Forces the selection to a range of dates. Subsequent clicks and dragging select a new range.

#### Time Picker

**`time:`** (`true|false|"ranged"`)

Enables a single time picker for non-ranged Datepickers when `true`. For ranged Datepickers, or when `time` is `"ranged"`, two time pickers are rendered: "start" and "end".


### Additional Options

**`openOn:`** (`Date|"first"|"last"|"today"`) Default place the Datepicker will open to. A specified date, today, or the first/last date within the selected dates. Default `"first"`.

**`min`**/**`max:`** (`Date|false`) Minimum and maximum dates available to select from. Default `false`.

**`within:`** (`[Date...]|false`) If provided, only dates within this array will be allowed. Default `false`.

**`without:`** (`[Date...]|false`) If provided, dates within this array will be excluded. Default `false`.

**`yearRange:`** (`Integer`) How many years forward & backward from the active year the Datepicker will display in the year dropdown menu. Default `5`.

**`weekStart:`** (`Integer`) Index of the day of the week to start on, `0-6`. `0 == Sunday`, `1 == Monday`, etc. Default `0`.

**`defaultTime:`** (`Object|Array`) Default time when the `time` option is enabled. Given an array of `[hours, minutes]`, will set both the start and end default times. An object consisting of `start` and `end` arrays will set them individually.<br>
Default `{ start: [0, 0], end: [12, 0] }`.

**`separator:`** (`String`) The separator used when serializing multiple dates. Default `","`.

**`serialize:`** (`(Date) => String`) Transforms a date into a string to be set as the value of the input.

**`deserialize:`** (`(String) => Date`) Parses a string into a date. Called whenever a date string is used instead of a date object.

#### Callbacks

**`toValue:`** (`([Date...]) => String`) Transforms the current selected dates to a string used to set the value of the input element.

**`fromValue:`** (`(String) => [Date...]`) Parses the value of the input into an array of selected dates.

**`onInit:`** (`(Element)`) Called after initialization with the original input element as the only parameter.

**`onChange:`** (`(Date|[Date...])`) Called whenever the selected dates change or when the time or time range is updated. The currently selected date(s) are passed; start and end times are set on the respective start and end dates.

**`onRender:`** (`(Element)`) Called whenever the Datepicker is rendered. The element passed is the first child from the resulting templates.


### Advanced

#### Localization

**`i18n:`**

- **`months:`** An array of month names. `0 == January`, `12 == December`, etc.

- **`weekdays:`** An array of weekday names. `0 == Sunday`, `1 == Monday`, etc.

- **`time:`** An array of labels for the time picker. The first, for non-ranged time pickers. The second, for the starting time. And the third, for the ending time.

#### Customization

**`classNames:`**

```js
{
  node:        'datepicker',
  wrapper:     'datepicker__wrapper',
  inline:      'is-inline',
  selected:    'is-selected',
  disabled:    'is-disabled',
  highlighted: 'is-highlighted',
  otherMonth:  'is-otherMonth',
  weekend:     'is-weekend',
  today:       'is-today'
}
```

**`templates:`** Used for rendering the Datepicker. Utilizes John Resig's micro-templating. A number of properties are available within each template's context.

- **`container:`** Top-level element within the wrapper.
- **`header:`** Header navigation for any given month.
- **`timepicker:`** Rendered when the time picker is enabled.
- **`calendar:`** The actual calendar for any given month.
- **`day:`** An individual day within the calendar.

See the default templates for reference. For a list of available properties within each template context, also see the default templates.


## Methods

**`datepiker.set(option[, value])`**

`@param {String|Object} option`<br>
`@param {Mixed} value`

Update an option on the Datepicker. Pass an object as the only argument to update multiple options at once.

**`datepicker.get(option[, ...])`**

`@param {String} option`<br>
`@return {Mixed}`

Retrieve the value of an option from the Datepicker. Pass multiple options as additional arguments to receive an object of options in return.

**`datepicker.open([openOn])`**

`@param {Date|String} openOn`

Open the Datepicker to the date specified by `openOn`.  If not specified, will default to the value of the `openOn` option. See above for possible values.

**`datepicker.show()`**

Displays and positions the Datepicker. If `inline` is `true`, this method does nothing.

**`datepicker.hide()`**

Hides the Datepicker. If `inline` is `true`, this method does nothing.

**`datepicker.toggle()`**

Toggles the `open()` and `hide()` methods based on whether the Datepicker is open or not.

**`datepicker.next([skip])`**<br>
**`datepicker.prev([skip])`**

`@param {Integer} skip`

Advance the Datepicker forward/backward by a month. `skip` will advance the Datepicker by the specified number.

**`datepicker.goToDate(date)`**

`@param {Date} date`

Send the Datepicker to the specified date.

**`datepicker.hasDate(date)`**

`@param {Date} date`<br>
`@return {Boolean}`

Check if the specified date has been selected in the Datepicker.

**`datepicker.addDate(date)`**<br>
**`datepicker.removeDate(date)`**

`@param {Date|Array} date`

Add/Remove the date or dates to the Datepicker's selection.

**`datepicker.toggleDate(date[, force])`**

`@param {Date|Array} date`<br>
`@param {Boolean} force`

Add or remove the date or dates from the Datepicker's selection. Declaring `force` will force add/remove the dates regardless of whether they were previously selected or not.

**`datepicker.getDate()`**

`@return {Date|Array}`

Returns the selected date(s). If `range` is `true`, returns the first and last selected dates. When the time picker is enabled, the first date will be set to the start time and the last date will be set to the end time.

**`datepicker.setDate([date])`**

`@param {Date|Array} date`

Clears the current selection of dates and gives the Datepicker a new selection.

**`datepicker.setTime([part, ]hour, minute)`**

`@param {String|Boolean} part`<br>
`@param {Integer} hour`<br>
`@param {Integer} minute`

Set the time of the time picker. When `part` is `true`, resets the time to the `defaultTime`. Otherwise, `part` must be `"start"` or `"end"` or it will default to `"start"`.

**`datepicker.getValue()`**

`@return {String}`

Retrieves the string formatted value of the Datepicker. The resulting string is what is set as the input element's value.

**`datepicker.setValue(val)`**

`@param {String} val`

Given a string value, parses it and sets the selected dates and time.

**`datepicker.dateAllowed(date[, dim])`**

`@param {Date} date`<br>
`@param {String} dim`<br>
`@return {Boolean}`

Checks if a given date is allowed to be selected in the Datepicker. If `dim` is `"month"`, only checks if the date's month is allowed. If `dim` is `"year"`, checks if the date's year is allowed.

**`datepicker.render()`**

Renders the Datepicker using the defined templates and calendar data.

**`datepicker.getData([index])`**

`@param {Integer} index`

Retrieves data about the current month of the Datepicker. Providing an `index` will retrieve data for the offset month (e.g. `1` would be the next month, `-1` would be the previous month, etc.).

## Author

Wil Wilsman [wilwilsman.com](http://wilwilsman.com) [@wilwilsman](https://twitter.com/wilwilsman)

Copyright &copy; 2016 Wil Wilsman. MIT License.
