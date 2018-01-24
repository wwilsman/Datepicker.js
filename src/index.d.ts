declare namespace Datepicker {
  interface Options {
    inline: boolean;
    multiple: boolean;
    ranged: boolean;
    time: boolean | 'ranged';

    // Additional Options
    openOn: Date | "first" | "last" | "today";
    min: Date | false;
    max: Date | false;
    within: Date[] | false;
    without: Date[] | false;
    yearRange: number;
    weekStart: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    defaultTime: [number, number] | {
      start: [number, number];
      end: [number, number];
    };
    separator: string;
    serialize(dt: Date): string;
    deserialize(dt: string): Date;

    // Callbacks
    toValue(dt: Date): string;
    fromValue(dt: string): Date;
    onInit(el: HTMLElement): void;
    onChange(dt: Date | [Date, Date]): void;
    onRender(el: HTMLElement): void;
    onUpdate(dt: Date | Date[]): void;

    // Advanced

    // Localization
    i18n: {
      months: [string, string, string, string, string, string, string, string, string, string, string, string];
      weekdays: [string, string, string, string, string, string, string];
      time: [string, string, string];
    }

    // Customization
    classNames: {
      node: string;
      wrapper: string;
      inline: string;
      selected: string;
      disabled: string;
      highlighted: string;
      otherMonth: string;
      weekend: string;
      today: string;
    };
    templates: {
      container: string;
      header: string;
      timepicker: string;
      calendar: string;
      day: string;
    };
  }
}

declare interface Datepicker {
  set(option: string | any, value?: any): void;
  get(option: string): any;
  open(openOn?: Date | string);
  show(): void;
  hide(): void;
  toggle(): void;
  next(skip?: number): void;  // month
  prev(skip?: number): void;  // month
  goToDate(date: Date): void;
  hasDate(date: Date): boolean;
  addDate(date: Date | Date[] | number | number[]): void;
  removeDate(date: Date | Date[] | number | number[]): void;
  toggleDate(date: Date | Date[], force?: boolean): void;
  getDate(): Date | Date[];
  setDate(date: Date | Date[]): void;

  // Set the time of the time picker. When part is true, resets the
  // time to the defaultTime. Otherwise, part must be "start" or "end"
  // or it will default to "start".
  setTime(part: string | boolean, hour: number, minute: number): void;
  setTime(hour: number, minute: number): void;

  // Retrieves the string formatted value of the Datepicker. The
  // resulting string is what is set as the input element's value.
  getValue(): Date | Date[];
  setValue(val: Date | Date[]): void;

  // Checks if a given date is allowed to be selected in the
  // Datepicker. If dim is "month", only checks if the date's month is
  // allowed. If dim is "year", checks if the date's year is allowed.
  dateAllowed(date: Date, dim?: string): boolean;
  render(): void;
  getData(index?: number): any;
}

declare interface DatepickerStatic {
  new(id: string | HTMLElement, options?: Partial<Datepicker.Options>): Datepicker;
}

declare const Datepicker: DatepickerStatic;

export = Datepicker;
