describe('Datepicker', function() {
  var datepicker;

  this.date = new Date();
  this.date.setHours(0,0,0,0);

  beforeEach(function() {
    this.date = new Date();
    this.date.setHours(0,0,0,0);

    datepicker = new Datepicker();
  });

  describe('#set', function() {

    beforeEach(function() {
      spyOn(datepicker, 'draw');
      
      datepicker.set('multiple', true);
      
      datepicker.set({
        inline: true,
        calendars: 2
      });
    });

    it('should set an option', function() {
      expect(datepicker.get('multiple')).toBeTruthy();
    });

    it('should set options from an object', function() {
      expect(datepicker.get('inline')).toBeTruthy();
      expect(datepicker.get('calendars')).toBe(2);
    });

    it('should redraw when setting an option', function() {
      expect(datepicker.draw).toHaveBeenCalled();
    });

    it('should only redraw once when setting multiple options', function() {
      expect(datepicker.draw.calls.count()).toEqual(2);
    });

    it('should not redraw if third param is truthy', function() {
      datepicker.set('multiple', false, true);

      expect(datepicker.get('multiple')).toBeFalsy();
      expect(datepicker.draw.calls.count()).toEqual(2);
    });
  });

  describe('#get', function() {

    it('should retrieve an option', function() {
      expect(datepicker.get('multiple')).toBeFalsy();
    });
  });

  describe('#update', function() {
    var onUpdate = jasmine.createSpy();

    beforeEach(function() {
      spyOn(datepicker, 'update').and.callThrough();
      
      datepicker.set('onUpdate', onUpdate);
      datepicker.setValue(this.date);
    });

    it('should be called when a value is toggled', function() {
      expect(datepicker.update).toHaveBeenCalled();
    });

    it('should update the bound element\'s value', function() {
      expect(datepicker.elem.value).not.toBe('');
      expect(datepicker.elem.value).toBe(datepicker.toString());
    });

    it('should call onUpdate with the new value', function() {
      expect(onUpdate).toHaveBeenCalledWith(this.date);
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
      datepicker.setValue(dates);

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

      expect(datepicker._c).toEqual(today);
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
    });

    afterEach(function() {
      datepicker.node.removeAttribute('style');
      document.body.removeChild(datepicker.node);
    });

    it('should add "is-visible" class', function() {
      datepicker.show();

      expect(datepicker.node).toHaveClass('is-visible');
    });

    it('should add "position-right" class', function() {
      datepicker.node.style.left = '';
      datepicker.node.style.right = 0;
      datepicker.show();

      expect(datepicker.container).toHaveClass('position-right');
    });

    it('should add "position-top" class', function() {
      datepicker.node.style.top = '';
      datepicker.node.style.bottom = 0;
      datepicker.show();

      expect(datepicker.container).toHaveClass('position-top');
    });
  });

  describe('#hide', function() {

    it('should remove "is-visible" and positioning classes', function() {
      datepicker.node.style.position = 'fixed';
      datepicker.node.style.bottom = datepicker.node.style.right = 0;
      document.body.appendChild(datepicker.node);

      datepicker.show();

      expect(datepicker.node).toHaveClass('is-visible');
      expect(datepicker.container).toHaveClass('position-right');
      expect(datepicker.container).toHaveClass('position-top');

      datepicker.hide();

      expect(datepicker.node).not.toHaveClass('is-visible');
      expect(datepicker.container).not.toHaveClass('position-right');
      expect(datepicker.container).not.toHaveClass('position-top');

      datepicker.node.removeAttribute('style');
      document.body.removeChild(datepicker.node);
    });
  });

  describe('#nextMonth', function() {
    var date;

    beforeEach(function() {
      spyOn(datepicker, 'goToDate');

      date = new Date(this.date);
      date.setDate(1);

      datepicker.nextMonth();
      datepicker.nextMonth(6);
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

  describe('#prevMonth', function() {
    var date;

    beforeEach(function() {
      spyOn(datepicker, 'goToDate');

      date = new Date(this.date);
      date.setDate(1);

      datepicker.prevMonth();
      datepicker.prevMonth(6);
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
    var date;

    beforeEach(function() {
      spyOn(datepicker, 'draw');

      date = new Date(this.date);
      date.setDate(1);

      datepicker.goToDate(date);
    });

    it('should set the calendar to the specified date', function() {
      expect(datepicker._c).toEqual(date);
    });

    it('should redraw the calendar', function() {
      expect(datepicker.draw).toHaveBeenCalled();
    });
  });

  describe('#hasDate', function() {
    var date;

    beforeEach(function() {
      date = new Date();

      datepicker.setValue(date);
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

    it('should actually call #toggleValue with truthy first param', function() {
      spyOn(datepicker, 'toggleValue')

      datepicker.addDate(this.date);

      expect(datepicker.toggleValue.calls.argsFor(0)).toEqual([this.date, true]);
    });
  });
  
  describe('#removeDate', function() {

    it('should actually call #toggleValue with falsy second param', function() {
      spyOn(datepicker, 'toggleValue')

      datepicker.removeDate(this.date);

      expect(datepicker.toggleValue.calls.argsFor(0)).toEqual([this.date, false]);
    });
  });

  describe('#toggleValue', function() {
    var date;

    beforeEach(function() {
      spyOn(datepicker, 'dateAllowed').and.callThrough();
      spyOn(datepicker, 'update');

      date = new Date(this.date);
      date.setDate(date.getDate() + 1);

      datepicker.toggleValue(this.date);
    });

    it('should set the value to the date', function() {
      expect(datepicker.getValue()).toEqual(this.date);
    });

    it('should unset the value', function() {
      datepicker.toggleValue(this.date);

      expect(datepicker.getValue()).not.toEqual(this.date);
    });

    it('should not set the value when second param is falsy', function() {
      datepicker.toggleValue(date, false);

      expect(datepicker.getValue()).not.toEqual(date);
    });

    it('should not unset the value when second param is truthy', function() {
      datepicker.toggleValue(this.date, true);

      expect(datepicker.getValue()).not.toEqual(date);
    });

    it('should work with multiple values', function() {
      datepicker.set('multiple', true);
      datepicker.toggleValue([this.date, date]);

      expect(datepicker.getValue()).not.toContain(this.date);
      expect(datepicker.getValue()).toContain(date);
    });

    it('should check if the date is allowed', function() {
      expect(datepicker.dateAllowed).toHaveBeenCalledWith(this.date);
    });

    it('should update the datepicker', function() {
      expect(datepicker.update).toHaveBeenCalled();
    });
  });
  
  describe('#setValue', function() {

    beforeEach(function() {
      datepicker.setValue(this.date);
    });

    it('should set the value', function() {
      expect(datepicker.getValue()).toEqual(this.date);
    });

    it('should remove the old value, even whith multiple dates', function() {
      var date = new Date(this.date);
      date.setDate(date.getDate() + 1);

      datepicker.set('multiple', true);
      datepicker.setValue(date);

      expect(datepicker.getValue()).not.toContain(this.date);
      expect(datepicker.getValue()).toContain(date);
    });
  });
  
  describe('#getValue', function() {

    beforeEach(function() {
      datepicker.setValue(this.date);
    });

    it('should return the current value', function() {
      expect(datepicker.getValue()).toEqual(this.date);
    });

    it('should return an array of dates for multiple', function() {
      datepicker.set('multiple', true);

      expect(datepicker.getValue()).toEqual(jasmine.any(Array));
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
    if (date.getMonth() > 10) monthInYear.setMonth(0);
    else monthInYear.setMonth(11);

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
  
  describe('#draw', function() {

    it('should render the calendar as needed', function() {
      spyOn(datepicker, 'render').and.callThrough();

      datepicker.set('calendars', 2);

      expect(datepicker.render.calls.count()).toBe(2);
    });

    it('should update the container innerHTML', function() {
      var html = datepicker.container.innerHTML;

      datepicker.nextMonth();

      expect(datepicker.container.innerHTML).not.toBe(html);
    });
  });

  describe('#render', function() {
    var data;

    beforeEach(function() {
      data = [];

      var ogFn = datepicker._renderHeader;
      spyOn(datepicker, '_renderHeader').and.callFake(function(cal) {
        var ret = ogFn.apply(this, arguments);
        data.push(cal);
        return ret;
      });

      datepicker.render();
    });

    it('should render this month', function() {
      expect(data[0].date.getMonth()).toBe(this.date.getMonth());
      expect(data[0].year).toBe(this.date.getFullYear());
    });

    it('should know if the next/prev month is restricted by min/max', function() {
      expect(data[0].prev).toBeTruthy();
      expect(data[0].next).toBeTruthy();

      datepicker.set({
        min: this.date,
        max: this.date
      });

      expect(data[1].prev).toBeFalsy();
      expect(data[1].next).toBeFalsy();
    });

    it('should track the main calendar within multiple calendars', function() {
      datepicker.set({
        calendars: 3,
        index: 1
      });

      expect(data[1].first).toBeTruthy();
      expect(data[1].main).toBeFalsy();
      expect(data[1].last).toBeFalsy();
      expect(data[2].first).toBeFalsy();
      expect(data[2].main).toBeTruthy();
      expect(data[2].last).toBeFalsy();
      expect(data[3].firt).toBeFalsy();
      expect(data[3].main).toBeFalsy();
      expect(data[3].last).toBeTruthy();
    });

    it('a day should know some basic info about itself', function() {
      var day = data[0].days[7];

      datepicker.setValue(day.obj);
      datepicker.set('max', day.obj);

      day = data[1].days[7];

      expect(day.daynum).toBe(day.obj.getDate());
      expect(day.isToday).toBe(day.obj.getTime() === this.date.getTime());
      expect(day.isSelected).toBeTruthy();
      expect(day.isDisabled).toBeFalsy();

      while (day.obj.getDay() != 0)
        day = data[1].days[data[1].days.indexOf(day) + 1];

      expect(day.isWeekend).toBeTruthy();

      day = data[1].days[data[1].days.indexOf(day) + 1];

      expect(day.isWeekend).toBeFalsy();
      expect(day.isSelected).toBeFalsy();
      expect(day.isDisabled).toBeTruthy();
    });

    it('a day should know what month it\'s in', function() {
      datepicker.set('calendars', 3);

      var day = data[1].days[0];
      if (day.isThisMonth) day = date[2].days[0];
      if (day.isThisMonth) day = date[3].days[0];

      expect(day.isThisMonth).toBeFalsy();
      expect(day.isLastMonth).toBeTruthy();
      expect(day.isNextMonth).toBeFalsy();

      day = data[1].days[7];

      expect(day.isThisMonth).toBeTruthy();
      expect(day.isLastMonth).toBeFalsy();
      expect(day.isNextMonth).toBeFalsy();

      while (day.obj.getDate() != 1)
        day = data[1].days[data[1].days.indexOf(day) + 1];

      expect(day.isThisMonth).toBeFalsy();
      expect(day.isLastMonth).toBeFalsy();
      expect(day.isNextMonth).toBeTruthy();
    });

    it('should make basic render functions available', function() {
      expect(data[0].renderHeader).toEqual(jasmine.any(Function));
      expect(data[0].renderSelect).toEqual(jasmine.any(Function));
      expect(data[0].renderDay).toEqual(jasmine.any(Function));
    });

    it('year select should be limited by a range', function() {
      datepicker.set('yearRange', 1);

      var yearSelect = datepicker.node.querySelector('select[data-year]');

      expect(yearSelect.childElementCount).toBe(3);
    });
  });

  describe('#toString', function() {

    it('should be a serialized string of the date', function() {
      datepicker.setValue(this.date);

      expect(datepicker.toString()).toBe(datepicker.get('serialize')(this.date));
    });

    it('should contain the delimeter if multiple dates are present', function() {
      var date = new Date(this.date);
      date.setDate(date.getDate() + 1);

      datepicker.set('multiple', true);
      datepicker.setValue([this.date, date]);

      expect(datepicker.toString()).toMatch(datepicker.get('separator'));
    });
  });
});
