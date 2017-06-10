import { Directive, Input, ComponentRef, ElementRef, ViewContainerRef, Renderer, ChangeDetectorRef, ComponentFactoryResolver, forwardRef, EventEmitter, Output, SimpleChanges, OnChanges, HostListener } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { IMyDate, IMyDateRange, IMyDayLabels, IMyMonthLabels, IMyOptions, IMyDateModel, IMyCalendarViewChanged, IMyInputFieldChanged, IMyMarkedDates, IMyMarkedDate } from "./interfaces/index";
import { NgxMyDatePicker } from "./ngx-my-date-picker.component";
import { UtilService } from "./services/ngx-my-date-picker.util.service";

const NGX_DP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxMyDatePickerDirective),
    multi: true
};

enum CalToggle { Open = 1, CloseByDateSel = 2, CloseByCalBtn = 3, CloseByOutClick = 4, CloseByEsc = 5 }
enum Year { min = 1100, max = 9100 }
enum KeyCode { esc = 27, leftArrow = 37, rightArrow = 39 }

@Directive({
    selector: "[ngx-mydatepicker]",
    exportAs: "ngx-mydatepicker",
    providers: [UtilService, NGX_DP_VALUE_ACCESSOR]
})
export class NgxMyDatePickerDirective implements OnChanges, ControlValueAccessor {
    @Input() options: IMyOptions;
    @Input() defaultMonth: string;

    @Output() dateChanged: EventEmitter<IMyDateModel> = new EventEmitter<IMyDateModel>();
    @Output() inputFieldChanged: EventEmitter<IMyInputFieldChanged> = new EventEmitter<IMyInputFieldChanged>();
    @Output() calendarViewChanged: EventEmitter<IMyCalendarViewChanged> = new EventEmitter<IMyCalendarViewChanged>();
    @Output() calendarToggle: EventEmitter<number> = new EventEmitter<number>();

    private cRef: ComponentRef<NgxMyDatePicker> = null;
    private inputText: string = "";
    private preventClose: boolean = false;

    // Default options
    private opts: IMyOptions = {
        dayLabels: <IMyDayLabels>{
            su: "อา", mo: "จ", tu: "อ", we: "พ", th: "พฤ", fr: "ศ", sa: "ส"
        },
        monthLabels: <IMyMonthLabels>{
            1: "ม.ค.", 2: "ก.พ.", 3: "มี.ค.", 4: "เม.ย.", 5: "พ.ค.", 6: "มิ.ย.",
            7: "ก.ค.", 8: "ส.ค.", 9: "ก.ย.", 10: "ต.ค.", 11: "พ.ย.", 12: "ธ.ค."
        },
        dateFormat: <string>"dd/mm/yyyy",
        showTodayBtn: <boolean>true,
        todayBtnTxt: <string>"วันนี้",
        firstDayOfWeek: <string>"su",
        satHighlight: <boolean>false,
        sunHighlight: <boolean>true,
        highlightDates: <Array<IMyDate>>[],
        markCurrentDay: <boolean>true,
        markCurrentMonth: <boolean>true,
        markCurrentYear: <boolean>true,
        monthSelector: <boolean>true,
        yearSelector: <boolean>true,
        yearOffset: <number>543,
        disableHeaderButtons: <boolean>true,
        showWeekNumbers: <boolean>false,
        selectorHeight: <string>"232px",
        selectorWidth: <string>"252px",
        disableUntil: <IMyDate>{ year: 0, month: 0, day: 0 },
        disableSince: <IMyDate>{ year: 0, month: 0, day: 0 },
        disableDates: <Array<IMyDate>>[],
        enableDates: <Array<IMyDate>>[],
        markDates: <Array<IMyMarkedDates>>[],
        markWeekends: <IMyMarkedDate>{},
        disableDateRanges: <Array<IMyDateRange>>[],
        disableWeekends: <boolean>false,
        alignSelectorRight: <boolean>false,
        openSelectorTopOfInput: <boolean>false,
        closeSelectorOnDateSelect: <boolean>true,
        minYear: <number>Year.min,
        maxYear: <number>Year.max,
        showSelectorArrow: <boolean>true,
        ariaLabelPrevMonth: <string>"Previous Month",
        ariaLabelNextMonth: <string>"Next Month",
        ariaLabelPrevYear: <string>"Previous Year",
        ariaLabelNextYear: <string>"Next Year",
    };

    onChangeCb: (_: any) => void = () => { };
    onTouchedCb: () => void = () => { };

    constructor(private utilService: UtilService, private vcRef: ViewContainerRef, private cfr: ComponentFactoryResolver, private renderer: Renderer, private cdr: ChangeDetectorRef, private elem: ElementRef) { }

    @HostListener("keyup", ["$event"]) onKeyUp(evt: KeyboardEvent) {
        if (evt.keyCode === KeyCode.leftArrow || evt.keyCode === KeyCode.rightArrow) {
            return;
        }
        else if (evt.keyCode === KeyCode.esc) {
            this.closeSelector(CalToggle.CloseByEsc);
        }
        else {
            let date: IMyDate = this.utilService.isDateValid(this.elem.nativeElement.value, this.opts.dateFormat, this.opts.minYear, this.opts.maxYear, this.opts.disableUntil, this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDates, this.opts.disableDateRanges, this.opts.monthLabels, this.opts.enableDates);
            if (date.day !== 0 && date.month !== 0 && date.year !== 0) {
                let dateModel: IMyDateModel = this.utilService.getDateModel(date, this.opts.dateFormat, this.opts.monthLabels);
                this.emitDateChanged(dateModel);
                this.updateModel(dateModel);
                this.emitInputFieldChanged(dateModel.formatted, true);
                if (this.opts.closeSelectorOnDateSelect) {
                    this.closeSelector(CalToggle.CloseByDateSel);
                }
                else if (this.cRef !== null) {
                    this.cRef.instance.setCalendarView(date);
                }
            }
            else {
                if (this.inputText !== this.elem.nativeElement.value) {
                    if (this.elem.nativeElement.value === "") {
                        this.clearDate();
                    }
                    else {
                        this.onChangeCb(null);
                        this.emitInputFieldChanged(this.elem.nativeElement.value, false);
                    }
                }
            }
            this.inputText = this.elem.nativeElement.value;
        }
    }

    @HostListener("document:click", ["$event"]) onClick(evt: MouseEvent) {
        if (!this.preventClose && evt.target && this.cRef !== null && this.elem.nativeElement !== evt.target && !this.cRef.location.nativeElement.contains(evt.target)) {
            this.closeSelector(CalToggle.CloseByOutClick);
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty("options")) {
            this.parseOptions(changes["options"].currentValue);
        }

        if (changes.hasOwnProperty("defaultMonth")) {
            let dm: any = changes["defaultMonth"].currentValue;
            if (typeof dm === "object") {
                dm = dm.defMonth;
            }
            this.defaultMonth = dm;
        }
    }

    public parseOptions(opts: IMyOptions): void {
        if (opts !== undefined) {
            Object.keys(opts).forEach((k) => {
                (<IMyOptions>this.opts)[k] = opts[k];
            });
        }
        if (this.opts.minYear < Year.min) {
            this.opts.minYear = Year.min;
        }
        if (this.opts.maxYear > Year.max) {
            this.opts.maxYear = Year.max;
        }
    }

    public writeValue(value: Object): void {
        if (value && (value["date"] || value["jsdate"])) {
            let formatted: string = this.utilService.formatDate(value["date"] ? value["date"] : this.jsDateToMyDate(value["jsdate"]), this.opts.dateFormat, this.opts.monthLabels);
            this.setInputValue(formatted);
            this.emitInputFieldChanged(formatted, true);
        }
        else if (value === null || value === "") {
            this.setInputValue("");
            this.emitInputFieldChanged("", false);
        }
    }

    public registerOnChange(fn: any): void {
        this.onChangeCb = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouchedCb = fn;
    }

    public openCalendar(): void {
        this.preventClose = true;
        this.cdr.detectChanges();
        if (this.cRef === null) {
            let cf = this.cfr.resolveComponentFactory(NgxMyDatePicker);
            this.cRef = this.vcRef.createComponent(cf);
            this.cRef.instance.initialize(
                this.opts,
                this.defaultMonth,
                this.elem.nativeElement.value,
                this.elem.nativeElement.offsetHeight,
                (dm: IMyDateModel, close: boolean) => {
                    this.emitDateChanged(dm);
                    this.updateModel(dm);
                    if (close) {
                        this.closeSelector(CalToggle.CloseByDateSel);
                    }
                },
                (cvc: IMyCalendarViewChanged) => {
                    this.emitCalendarChanged(cvc);
                },
                () => {
                    this.closeSelector(CalToggle.CloseByEsc);
                }
            );
            this.emitCalendarToggle(CalToggle.Open);
        }
        setTimeout(() => {
            this.preventClose = false;
        }, 50);
    }

    public closeCalendar(): void {
        this.closeSelector(CalToggle.CloseByCalBtn);
    }

    public toggleCalendar(): void {
        if (this.cRef === null) {
            this.openCalendar();
        }
        else {
            this.closeSelector(CalToggle.CloseByCalBtn);
        }
    }

    public clearDate(): void {
        this.emitDateChanged({ date: { year: 0, month: 0, day: 0 }, jsdate: null, formatted: "", epoc: 0 });
        this.emitInputFieldChanged("", false);
        this.onChangeCb(null);
        this.onTouchedCb();
        this.setInputValue("");
        this.closeSelector(CalToggle.CloseByCalBtn);
    }

    private closeSelector(reason: number): void {
        if (this.cRef !== null) {
            this.vcRef.remove(this.vcRef.indexOf(this.cRef.hostView));
            this.cRef = null;
            this.emitCalendarToggle(reason);
        }
    }

    private updateModel(model: IMyDateModel): void {
        this.onChangeCb(model);
        this.onTouchedCb();
        this.setInputValue(model.formatted);
    }

    private setInputValue(value: string): void {
        this.inputText = value;
        this.renderer.setElementProperty(this.elem.nativeElement, "value", value);
    }

    private emitDateChanged(dateModel: IMyDateModel): void {
        this.dateChanged.emit(dateModel);
    }

    private emitInputFieldChanged(value: string, valid: boolean): void {
        this.inputFieldChanged.emit({ value: value, dateFormat: this.opts.dateFormat, valid: valid });
    }

    private emitCalendarChanged(cvc: IMyCalendarViewChanged) {
        this.calendarViewChanged.emit(cvc);
    }

    private emitCalendarToggle(reason: number): void {
        this.calendarToggle.emit(reason);
    }

    private jsDateToMyDate(date: Date): IMyDate {
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }
}