describe('Datepicker', function() {
  var datepicker;

  beforeEach(function() {
    this.date = new Date();
    this.date.setHours(0,0,0,0);

    datepicker = new Datepicker();
  });

  describe('#set', function() {

    it('should set an option', function() {
      datepicker.set('multiple', true);
      expect(datepicker.get('multiple')).toBeTruthy();
    });

    it('should set multiple options', function() {
      datepicker.set({
        inline: true,
        ranged: true
      });

      expect(datepicker.get('inline')).toBeTruthy();
      expect(datepicker.get('ranged')).toBeTruthy();
    });

    it('should extend deep objects', function() {
      datepicker.set('classNames', { node: 'dk' });

      expect(datepicker.get('classNames').node).toBe('dk');
    });
  });

  describe('#get', function() {

    it('should retrieve an option', function() {
      expect(datepicker.get('multiple')).toBeFalsy();
    });
  });

  describe('#open', function() {
    var dates = [];
    var date = new Date();
    date.setHours(0,0,0,0);

    for (var i = 0; i < 3; i++) {
      date.setDate(date.getDate() + 1);
      dates.push(new Date(date));
    }

    beforeEach(function() {
      spyOn(datepicker, 'goToDate');
      spyOn(datepicker, 'show');

      datepicker.set('multiple', true);
      datepicker.addDate(dates);

      datepicker.open(dates[1]);
      datepicker.open('first');
      datepicker.open('last');
      datepicker.open('today');
    });

    it('should set the calendar to the specified date', function() {
      expect(datepicker.goToDate).toHaveBeenCalledWith(dates[1]);
    });

    it('"first" should open to the first selected date', function() {
      expect(datepicker.goToDate).toHaveBeenCalledWith(dates[0]);
    });

    it('"last" should open to the last selected date', function() {
      expect(datepicker.goToDate).toHaveBeenCalledWith(dates[2]);
    });

    it('"today" should open to today (this month)', function() {
      var today = new Date(this.date);
      today.setDate(1);

      expect(datepicker._month).toEqual(today);
    });

    it('shows the datepicker', function() {
      expect(datepicker.show).toHaveBeenCalled();
    });
  });

  describe('#show', function() {

    beforeEach(function() {
      datepicker.node.style.position = 'fixed';
      datepicker.node.style.top = datepicker.node.style.left = 0;
      document.body.appendChild(datepicker.node);
      datepicker.render();
    });

    afterEach(function() {
      datepicker.node.removeAttribute('style');
      document.body.removeChild(datepicker.node);
    });

    it('should show the datepicker', function() {
      expect(datepicker.wrapper.style.display).toEqual('none');

      datepicker.show();

      expect(datepicker.wrapper.style.display).not.toEqual('none');
    });

    it('should position the datepicker below, to the left', function() {
      datepicker.show();

      expect(datepicker.wrapper.style.top).not.toEqual('');
      expect(datepicker.wrapper.style.left).toEqual('0px');
      expect(datepicker.wrapper.style.bottom).toEqual('');
      expect(datepicker.wrapper.style.right).toEqual('');
    });

    it('should position the datepicker below, to the right', function() {
      datepicker.node.style.left = '';
      datepicker.node.style.right = 0;
      datepicker.show();

      expect(datepicker.wrapper.style.top).not.toEqual('');
      expect(datepicker.wrapper.style.left).toEqual('');
      expect(datepicker.wrapper.style.bottom).toEqual('');
      expect(datepicker.wrapper.style.right).toEqual('0px');
    });

    it('should position the datepicker above, to the left', function() {
      datepicker.node.style.top = '';
      datepicker.node.style.bottom = 0;
      datepicker.show();

      expect(datepicker.wrapper.style.top).toEqual('');
      expect(datepicker.wrapper.style.left).toEqual('0px');
      expect(datepicker.wrapper.style.bottom).not.toEqual('');
      expect(datepicker.wrapper.style.right).toEqual('');
    });

    it('should position the datepicker above, to the right', function() {
      datepicker.node.style.top = datepicker.node.style.left = '';
      datepicker.node.style.bottom = datepicker.node.style.right = 0;
      datepicker.show();

      expect(datepicker.wrapper.style.top).toEqual('');
      expect(datepicker.wrapper.style.left).toEqual('');
      expect(datepicker.wrapper.style.bottom).not.toEqual('');
      expect(datepicker.wrapper.style.right).toEqual('0px');
    });
  });

  describe('#hide', function() {

    it('should hide the datepicker', function() {
      datepicker.show();

      expect(datepicker.wrapper.style.display).not.toEqual('none');

      datepicker.hide();

      expect(datepicker.wrapper.style.display).toEqual('none');
    });
  });

  describe('#next', function() {
    var date;

    beforeEach(function() {
      spyOn(datepicker, 'goToDate');

      date = new Date(this.date);
      date.setDate(1);

      datepicker.next();
      datepicker.next(6);
    });

    it('should go to next month', function() {
      date.setMonth(date.getMonth() + 1);

      expect(datepicker.goToDate).toHaveBeenCalledWith(date);
    });

    it('should skip ahead 6 month', function() {
      date.setMonth(date.getMonth() + 6);

      expect(datepicker.goToDate).toHaveBeenCalledWith(date);
    });
  });

  describe('#prev', function() {
    var date;

    beforeEach(function() {
      spyOn(datepicker, 'goToDate');

      date = new Date(this.date);
      date.setDate(1);

      datepicker.prev();
      datepicker.prev(6);
    });

    it('should go to previous month', function() {
      date.setMonth(date.getMonth() - 1);

      expect(datepicker.goToDate).toHaveBeenCalledWith(date);
    });

    it('should skip back 6 month', function() {
      date.setMonth(date.getMonth() - 6);

      expect(datepicker.goToDate).toHaveBeenCalledWith(date);
    });
  });

  describe('#goToDate', function() {
    var onRender, date;

    beforeEach(function() {
      onRender = jasmine.createSpy('onRender');
      date = new Date(this.date);
      date.setDate(1);

      datepicker.set('onRender', onRender);
    });

    it('should set the calendar to the specified date', function() {
      datepicker.goToDate(date);

      expect(datepicker._month).toEqual(date);
    });

    it('should render the calendar if open', function() {
      datepicker.show();
      datepicker.goToDate(date);

      expect(onRender).toHaveBeenCalled();
    });

    it('should not render the calendar if not open', function() {
      datepicker.goToDate(date);

      expect(onRender).not.toHaveBeenCalled();
    });
  });

  describe('#hasDate', function() {
    var date;

    beforeEach(function() {
      date = new Date(this.date);

      datepicker.setDate(date);
    });

    it('should return true when value contains date', function() {
      expect(datepicker.hasDate(date)).toBeTruthy();
    });

    it('should return false when value does not contain date', function() {
      date.setMonth(date.getMonth() + 1);

      expect(datepicker.hasDate(date)).toBeFalsy();
    });
  });

  describe('#addDate', function() {

    it('should actually call #toggleDate with truthy second param', function() {
      spyOn(datepicker, 'toggleDate')

      datepicker.addDate(this.date);

      expect(datepicker.toggleDate.calls.argsFor(0)).toEqual([this.date, true]);
    });
  });

  describe('#removeDate', function() {

    it('should actually call #toggleDate with falsy second param', function() {
      spyOn(datepicker, 'toggleDate')

      datepicker.removeDate(this.date);

      expect(datepicker.toggleDate.calls.argsFor(0)).toEqual([this.date, false]);
    });
  });

  describe('#toggleDate', function() {
    var onChange, date;

    beforeEach(function() {
      onChange = jasmine.createSpy('onChange')
      spyOn(datepicker, 'dateAllowed').and.callThrough();

      date = new Date(this.date);
      date.setDate(date.getDate() + 1);

      datepicker.set('onChange', onChange);
      datepicker.toggleDate(this.date);
    });

    it('should set the value to the date', function() {
      expect(datepicker.getDate()).toEqual(this.date);
    });

    it('should unset the value', function() {
      datepicker.toggleDate(this.date);

      expect(datepicker.getDate()).not.toEqual(this.date);
    });

    it('should not set the value when second param is falsy', function() {
      datepicker.toggleDate(date, false);

      expect(datepicker.getDate()).not.toEqual(date);
    });

    it('should not unset the value when second param is truthy', function() {
      datepicker.toggleDate(this.date, true);

      expect(datepicker.getDate()).not.toEqual(date);
    });

    it('should work with multiple values', function() {
      datepicker.set('multiple', true);
      datepicker.toggleDate([this.date, date]);

      expect(datepicker.getDate()).not.toContain(this.date);
      expect(datepicker.getDate()).toContain(date);
    });

    it('should check if the date is allowed', function() {
      expect(datepicker.dateAllowed).toHaveBeenCalledWith(this.date);
    });

    it('should update the bound element\'s value', function() {
      expect(datepicker._el.value).not.toBe('');
      expect(datepicker._el.value).toBe(datepicker.getValue());
    });

    it('should call onChange with the new value', function() {
      expect(onChange).toHaveBeenCalledWith(this.date);
    });
  });

  describe('#setDate', function() {

    beforeEach(function() {
      datepicker.setDate(this.date);
    });

    it('should set the value', function() {
      expect(datepicker.getDate()).toEqual(this.date);
    });

    it('should remove the old value, even whith multiple dates', function() {
      var date = new Date(this.date);
      date.setDate(date.getDate() + 1);

      datepicker.set('multiple', true);
      datepicker.setDate(date);

      expect(datepicker.getDate()).not.toContain(this.date);
      expect(datepicker.getDate()).toContain(date);
    });
  });

  describe('#getDate', function() {

    beforeEach(function() {
      datepicker.setDate(this.date);
    });

    it('should return the current value', function() {
      expect(datepicker.getDate()).toEqual(this.date);
    });

    it('should return an array of dates for multiple', function() {
      datepicker.set('multiple', true);

      expect(datepicker.getDate()).toEqual(jasmine.any(Array));
    });
  });

  describe('#dateAllowed', function() {
    var date = new Date();
    var dates = [];

    for (var i = 0; i < 3; i++) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    var monthInYear = new Date();
    monthInYear.setMonth(date.getMonth() > 10 ? 0 : 11);

    it('should only allow dates above min', function() {
      datepicker.set('min', dates[1]);

      expect(datepicker.dateAllowed(dates[2])).toBeTruthy();
      expect(datepicker.dateAllowed(dates[0])).toBeFalsy();
    });

    it('should only allow dates below max', function() {
      datepicker.set('max', dates[1]);

      expect(datepicker.dateAllowed(dates[0])).toBeTruthy();
      expect(datepicker.dateAllowed(dates[2])).toBeFalsy();
    });

    it('should only allow dates within array', function() {
      datepicker.set('within', dates);

      expect(datepicker.dateAllowed(dates[0])).toBeTruthy();
      expect(datepicker.dateAllowed(date)).toBeFalsy();
    });

    it('should only allow dates not within array', function() {
      datepicker.set('without', dates);

      expect(datepicker.dateAllowed(date)).toBeTruthy();
      expect(datepicker.dateAllowed(dates[0])).toBeFalsy();
    });

    it('should just check the month', function() {
      datepicker.set({
        within: [dates[0]],
        min: dates[0],
        max: dates[0]
      });

      date.setMonth(dates[0].getMonth());
      if (dates[0].getDate() > 1) date.setDate(1);
      else date.setDate(2);

      expect(datepicker.dateAllowed(date, 'month')).toBeTruthy();
      expect(datepicker.dateAllowed(monthInYear, 'month')).toBeFalsy();
    });

    it('should just check the year', function() {
      datepicker.set({
        within: [dates[0]],
        min: dates[0],
        max: dates[0]
      });

      date.setFullYear(dates[0].getFullYear() + 1);

      expect(datepicker.dateAllowed(monthInYear, 'year')).toBeTruthy();
      expect(datepicker.dateAllowed(date, 'year')).toBeFalsy();
    });
  });

  describe('#render', function() {

    it('should call for calendar data', function() {
      spyOn(datepicker, 'getData').and.callThrough();

      datepicker.render();

      expect(datepicker.getData).toHaveBeenCalled();
    });

    it('should update the wrapper innerHTML', function() {
      var html = datepicker.wrapper.innerHTML;

      datepicker.next();
      datepicker.render();

      expect(datepicker.wrapper.innerHTML).not.toBe(html);
    });

    it('year select should be limited by a range', function() {
      datepicker.set('yearRange', 1);
      datepicker.render();

      var yearSelect = datepicker.node.querySelector('select[data-year]');

      expect(yearSelect.childElementCount).toBe(3);
    });
  });

  describe('#getData', function() {
    var data;

    beforeEach(function() {
      data = [];

      var og = datepicker.getData;
      spyOn(datepicker, 'getData').and.callFake(function() {
        var ret = og.apply(this, arguments);
        data.push(ret);
        return ret;
      });

      datepicker.getData();
    });

    it('should represent this month', function() {
      expect(data[0]._date.getMonth()).toBe(this.date.getMonth());
      expect(data[0].year).toBe(this.date.getFullYear());
    });

    it('should know if the next/prev month is restricted by min/max', function() {
      expect(data[0].hasPrev).toBeTruthy();
      expect(data[0].hasNext).toBeTruthy();

      datepicker.set({
        min: this.date,
        max: this.date
      });

      datepicker.getData();

      expect(data[1].hasPrev).toBeFalsy();
      expect(data[1].hasNext).toBeFalsy();
    });

    it('a day should know some basic info about itself', function() {
      var day = data[0].days[7];

      datepicker.setDate(day._date);
      datepicker.set('max', day._date);
      datepicker.getData();

      day = data[1].days[7];

      expect(day.daynum).toBe(day._date.getDate());
      expect(day.isToday).toBe(day._date.getTime() === this.date.getTime());
      expect(day.isSelected).toBeTruthy();
      expect(day.isDisabled).toBeFalsy();

      while (day._date.getDay() != 0)
        day = data[1].days[data[1].days.indexOf(day) + 1];

      expect(day.isWeekend).toBeTruthy();

      day = data[1].days[data[1].days.indexOf(day) + 1];

      expect(day.isWeekend).toBeFalsy();
      expect(day.isSelected).toBeFalsy();
      expect(day.isDisabled).toBeTruthy();
    });
  });
});
