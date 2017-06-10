///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

import { FormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, ViewChild } from '@angular/core';
import { NgxMyDPTHModule } from './ngx-my-date-picker.module';
import { NgxMyDatePickerDirective } from './ngx-my-date-picker.input';
import { IMyOptions } from "./interfaces/my-options.interface";

let comp: NgxMyDatepickerTestComponent;
let fixture: ComponentFixture<NgxMyDatepickerTestComponent>;
let de: DebugElement;
let el: HTMLElement;

let PREVMONTH: string = '.header tr td:first-child div .headerbtncell:first-child .headerbtn';
let NEXTMONTH: string = '.header tr td:first-child div .headerbtncell:last-child .headerbtn';
let PREVYEAR: string = '.header tr td:last-child div .headerbtncell:first-child .headerbtn';
let NEXTYEAR: string = '.header tr td:last-child div .headerbtncell:last-child .headerbtn';
let MONTHLABEL: string = '.header tr td:first-child div .headermonthtxt .headerlabelbtn';
let YEARLABEL: string = '.header tr td:last-child div .headeryeartxt .headerlabelbtn';

function getDefaultDateString(date: Date): string {
    return `${(date.getDate() < 10 ? '0' + date.getDate() : date.getDate())}/${((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))}/${date.getFullYear()}`;
}

function getElement(id: string): any {
    return fixture.nativeElement.querySelector(id);
}

function getElements(id: string): Array<any> {
    return fixture.nativeElement.querySelectorAll(id);
}

function getThaiYearString(year: string) {
    return `${(+year + 543)}`;
}

function getThaiString(str: string) {
    const obj = {
        Sun: "อา", Mon: "จ", Tue: "อ", Wed: "พ", Thu: "พฤ", Fri: "ศ", Sat: "ส",
        Jan: "ม.ค.", Feb: "ก.พ.", Mar: "มี.ค.", Apr: "เม.ย.", May: "พ.ค.", Jun: "มิ.ย.",
        Jul: "ก.ค.", Aug: "ส.ค.", Sep: "ก.ย.", Oct: "ต.ค.", Nov: "พ.ย.", Dec: "ธ.ค."
    };
    return obj[str];
}

@Component({
    template: `
        <input 
            class="myDateInput" 
            id="myDateInput" 
            ngx-mydatepicker 
            #dp="ngx-mydatepicker" 
            name="mydate"
        />
    `
})
class NgxMyDatepickerTestComponent {
    @ViewChild('dp') vcDp: NgxMyDatePickerDirective;

    openCalendar(): void {
        this.vcDp.openCalendar();
    }

    closeCalendar(): void {
        this.vcDp.closeCalendar();
    }

    toggleCalendar(): void {
        this.vcDp.toggleCalendar();
    }

    clearDate(): void {
        this.vcDp.clearDate();
    }

    parseOptions(opts: IMyOptions): void {
        if (!opts.firstDayOfWeek) {
            opts.firstDayOfWeek = "mo";
        }
        this.vcDp.parseOptions(opts);
    }

    setDefaultMonth(defMonth: string): void {
        this.vcDp.defaultMonth = defMonth;
    }
}

describe('ngx-mydatepicker', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NgxMyDatepickerTestComponent],
            imports: [FormsModule, NgxMyDPTHModule]
        });
        fixture = TestBed.createComponent(NgxMyDatepickerTestComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('.myDateInput'));
        el = de.nativeElement;
    });

    it('test open/close/toggle calendar functions', () => {
        comp.openCalendar();
        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);

        comp.closeCalendar();
        fixture.detectChanges();
        selector = getElement('.selector');
        expect(selector).toBe(null);

        comp.toggleCalendar();
        fixture.detectChanges();
        selector = getElement('.selector');
        expect(selector).not.toBe(null);

        comp.toggleCalendar();
        fixture.detectChanges();
        selector = getElement('.selector');
        expect(selector).toBe(null);
    });

    it('select today and clear date', () => {
        comp.openCalendar();
        fixture.detectChanges();
        let headertodaybtn = getElement('.headertodaybtn');
        expect(headertodaybtn).not.toBe(null);

        fixture.detectChanges();
        headertodaybtn.click();
        let selector = getElement('.selector');
        expect(selector).toBe(null);

        fixture.detectChanges();
        let selection = getElement('.myDateInput');
        expect(selection.value).toBe(getDefaultDateString(new Date()));

        comp.clearDate();
        fixture.detectChanges();
        selection = getElement('.myDateInput');
        expect(selection.value).toBe('');
    });

    it('select previous month', () => {
        let opts: IMyOptions = {
            monthLabels: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12" }
        };

        comp.parseOptions(opts);
        comp.setDefaultMonth('2016/12');

        comp.openCalendar();

        let prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);

        for (let i = 12; i > 0; i--) {
            fixture.detectChanges();

            let monthlabel = getElement(MONTHLABEL);
            expect(monthlabel).not.toBe(null);
            expect(monthlabel.textContent.trim()).toBe(String(i));

            prevmonth.click();
        }
    });

    it('select next month', () => {
        let opts: IMyOptions = {
            monthLabels: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12" }
        };

        comp.parseOptions(opts);
        comp.setDefaultMonth('2016/01');

        comp.openCalendar();

        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        for (let i = 1; i <= 12; i++) {
            fixture.detectChanges();

            let monthlabel = getElement(MONTHLABEL);
            expect(monthlabel).not.toBe(null);
            expect(monthlabel.textContent.trim()).toBe(String(i));

            nextmonth.click();
        }
    });

    it('select previous month form selector', () => {
        comp.setDefaultMonth('2016/01');

        comp.openCalendar();

        fixture.detectChanges();
        let prevmonth = getElements('.prevmonth');
        expect(prevmonth).not.toBe(null);

        fixture.detectChanges();
        prevmonth[0].click();

        fixture.detectChanges();
        let monthlabel = getElement(MONTHLABEL);
        expect(monthlabel).not.toBe(null);
        expect(monthlabel.textContent.trim()).toBe(getThaiString('Dec'));

        fixture.detectChanges();
        let yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2015'));
    });

    it('select next month form selector', () => {
        comp.setDefaultMonth('2016/01');

        comp.openCalendar();

        fixture.detectChanges();
        let nextmonth = getElements('.nextmonth');
        expect(nextmonth).not.toBe(null);

        fixture.detectChanges();
        nextmonth[0].click();

        fixture.detectChanges();
        let monthlabel = getElement(MONTHLABEL);
        expect(monthlabel).not.toBe(null);
        expect(monthlabel.textContent.trim()).toBe(getThaiString('Feb'));

        fixture.detectChanges();
        let yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2016'));
    });

    it('select today from selector', () => {
        comp.openCalendar();

        fixture.detectChanges();
        let markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.click();

        fixture.detectChanges();
        let selection = getElement('.myDateInput');
        expect(selection.value).toBe(getDefaultDateString(new Date()));

        comp.clearDate();
        fixture.detectChanges();
        selection = getElement('.myDateInput');
        expect(selection.value).toBe('');
    });

    it('select previous year', () => {
        comp.setDefaultMonth('2010/12');

        comp.openCalendar();

        let prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);

        for (let i = 2010; i > 2000; i--) {
            fixture.detectChanges();

            let yearlabel = getElement(YEARLABEL);
            expect(yearlabel).not.toBe(null);
            expect(yearlabel.textContent.trim()).toBe(getThaiYearString(String(i)));

            prevyear.click();
        }
    });

    it('select next year', () => {
        comp.setDefaultMonth('2010/12');

        comp.openCalendar();

        let nextyear = getElement(NEXTYEAR);
        expect(nextyear).not.toBe(null);

        for (let i = 2010; i < 2020; i++) {
            fixture.detectChanges();

            let yearlabel = getElement(YEARLABEL);
            expect(yearlabel).not.toBe(null);
            expect(yearlabel.textContent.trim()).toBe(getThaiYearString(String(i)));

            nextyear.click();
        }
    });

    it('select previous month year change', () => {
        comp.setDefaultMonth('2016/01');

        comp.openCalendar();

        fixture.detectChanges();
        let prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);

        prevmonth.click();

        fixture.detectChanges();
        let monthlabel = getElement(MONTHLABEL);
        expect(monthlabel).not.toBe(null);
        expect(monthlabel.textContent.trim()).toBe(getThaiString('Dec'));

        fixture.detectChanges();
        let yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2015'));
    });

    it('select next month year change', () => {
        comp.setDefaultMonth('2016/12');

        comp.openCalendar();

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        nextmonth.click();

        fixture.detectChanges();
        let monthlabel = getElement(MONTHLABEL);
        expect(monthlabel).not.toBe(null);
        expect(monthlabel.textContent.trim()).toBe(getThaiString('Jan'));

        fixture.detectChanges();
        let yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2017'));
    });

    it('edit date in input box', () => {
        let opts: IMyOptions = {
            dateFormat: 'dd mmm yyyy'
        };

        comp.parseOptions(opts);

        fixture.detectChanges();
        let selection = getElement('.myDateInput');

        selection.value = '12 ก.พ. 2017';
        selection.dispatchEvent(new Event('keyup'));

        fixture.detectChanges();
        selection = getElement('.myDateInput');
        expect(selection.value).toBe('12 ก.พ. 2017');
    });

    it('test calendar year 2016 month one by one - next month button', () => {
        let opts: IMyOptions = {
            firstDayOfWeek: "mo"
        };

        comp.parseOptions(opts);
        comp.setDefaultMonth('2016/01');

        comp.openCalendar();

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        fixture.detectChanges();
        let monthlabel = getElement('.monthlabel');
        expect(monthlabel).not.toBe(null);
        expect(monthlabel.textContent.trim()).toBe(getThaiString('Jan'));

        fixture.detectChanges();
        let yearlabel = getElement('.yearlabel');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2016'));

        let beginDate: Array<string> = ['28', '1', '29', '28', '25', '30', '27', '1', '29', '26', '31', '28'];
        let endDate: Array<string> = ['7', '13', '10', '8', '5', '10', '7', '11', '9', '6', '11', '8'];

        for (let i = 0; i < 12; i++) {
            fixture.detectChanges();
            let currmonth = getElements('.caltable tbody tr td');
            expect(currmonth).not.toBe(null);
            expect(currmonth.length).toBe(42);

            expect(currmonth[0]).not.toBe(null);
            expect(currmonth[0].textContent.trim()).toBe(beginDate[i]);

            expect(currmonth[41]).not.toBe(null);
            expect(currmonth[41].textContent.trim()).toBe(endDate[i]);

            nextmonth.click();
        }
    });

    it('test calendar year 2016 month one by one - previous month button', () => {
        let opts: IMyOptions = {
            firstDayOfWeek: "mo"
        };

        comp.parseOptions(opts);
        comp.setDefaultMonth('2016/12');

        comp.openCalendar();

        fixture.detectChanges();
        let prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);

        fixture.detectChanges();
        let monthlabel = getElement('.monthlabel');
        expect(monthlabel).not.toBe(null);
        expect(monthlabel.textContent.trim()).toBe(getThaiString('Dec'));

        fixture.detectChanges();
        let yearlabel = getElement('.yearlabel');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2016'));

        let beginDate: Array<string> = ['28', '1', '29', '28', '25', '30', '27', '1', '29', '26', '31', '28'];
        let endDate: Array<string> = ['7', '13', '10', '8', '5', '10', '7', '11', '9', '6', '11', '8'];

        for (let i = 11; i > 0; i--) {
            fixture.detectChanges();
            let currmonth = getElements('.caltable tbody tr td');
            expect(currmonth).not.toBe(null);
            expect(currmonth.length).toBe(42);

            expect(currmonth[0]).not.toBe(null);
            expect(currmonth[0].textContent.trim()).toBe(beginDate[i]);

            expect(currmonth[41]).not.toBe(null);
            expect(currmonth[41].textContent.trim()).toBe(endDate[i]);

            prevmonth.click();
        }
    });

    // options
    it('options - dayLabels', () => {
        let options: IMyOptions = { dayLabels: { su: '1', mo: '2', tu: '3', we: '4', th: '5', fr: '6', sa: '7' }, firstDayOfWeek: 'su' };

        comp.setDefaultMonth('2016/05');
        comp.parseOptions(options);

        comp.openCalendar();

        fixture.detectChanges();
        let ths = getElements('.weekdaytitle');
        expect(ths.length).toBe(7);

        for (let i = 0; i < ths.length; i++) {
            let el = ths[i];
            expect(parseInt(el.textContent.trim())).toBe(i + 1);
        }
    });

    it('options - monthLabels', () => {
        let opts: IMyOptions = {
            monthLabels: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12" }
        };

        comp.parseOptions(opts);
        comp.setDefaultMonth('2016/01');

        comp.openCalendar();

        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        for (let i = 1; i <= 12; i++) {
            fixture.detectChanges();

            let monthlabel = getElement(MONTHLABEL);
            expect(monthlabel).not.toBe(null);
            expect(monthlabel.textContent.trim()).toBe(String(i));

            nextmonth.click();
        }
    });

    it('options - dateFormat', () => {
        // default
        let opts: IMyOptions = {
            firstDayOfWeek: "mo"
        };

        comp.parseOptions(opts);
        comp.setDefaultMonth('2016/01');
        comp.openCalendar();

        fixture.detectChanges();
        let currmonth = getElements('.daycell');
        expect(currmonth).not.toBe(null);
        expect(currmonth.length).toBe(42);

        currmonth[5].click();

        fixture.detectChanges();
        let selection = getElement('.myDateInput');
        expect(selection.value).toBe('02/01/2016');

        comp.closeCalendar();


        // dd.mm.yyyy
        opts.dateFormat = "dd.mm.yyyy";

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        currmonth = getElements('.daycell');
        expect(currmonth).not.toBe(null);
        expect(currmonth.length).toBe(42);

        currmonth[4].click();

        fixture.detectChanges();
        selection = getElement('.myDateInput');
        expect(selection.value).toBe('01.01.2016');

        comp.closeCalendar();


        // dd mmm yyyy
        opts.dateFormat = 'dd mmm yyyy';
        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        currmonth = getElements('.daycell');
        expect(currmonth).not.toBe(null);
        expect(currmonth.length).toBe(42);

        currmonth[4].click();

        fixture.detectChanges();
        selection = getElement('.myDateInput');
        expect(selection.value).toBe(`01 ${getThaiString('Jan')} 2016`);
    });

    it('options - showTodayBtn', () => {
        comp.setDefaultMonth('2016/01');

        let opts: IMyOptions = {
            showTodayBtn: true
        };

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        let headertodaybtn = getElement('.headertodaybtn');
        expect(headertodaybtn).not.toBe(null);

        comp.closeCalendar();


        opts.showTodayBtn = false;

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        headertodaybtn = getElement('.headertodaybtn');
        expect(headertodaybtn).toBe(null);
    });

    it('options - todatBtnTxt', () => {
        comp.setDefaultMonth('2016/01');
        comp.openCalendar();

        fixture.detectChanges();
        let headertodaybtn = getElement('.headertodaybtn span:last-child');
        expect(headertodaybtn).not.toBe(null);
        expect(headertodaybtn.textContent.trim()).toBe('วันนี้');

        comp.closeCalendar();


        let opts: IMyOptions = {
            todayBtnTxt: 'text'
        };

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        headertodaybtn = getElement('.headertodaybtn span:last-child');
        expect(headertodaybtn).not.toBe(null);
        expect(headertodaybtn.textContent.trim()).toBe('text');
    });

    it('options - firstDayOfWeek', () => {
        let opts: IMyOptions = {
            firstDayOfWeek: "mo"
        };

        comp.parseOptions(opts);
        comp.setDefaultMonth('2016/01');
        comp.openCalendar();

        fixture.detectChanges();
        let first = getElement('.weekdaytitle:first-child');
        expect(first).not.toBe(null);
        expect(first.textContent.trim()).toBe(getThaiString('Mon'));

        let last = getElement('.weekdaytitle:last-child');
        expect(last).not.toBe(null);
        expect(last.textContent.trim()).toBe(getThaiString('Sun'));

        comp.closeCalendar();


        opts.firstDayOfWeek = "su";

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        first = getElement('.weekdaytitle:first-child');
        expect(first).not.toBe(null);
        expect(first.textContent.trim()).toBe(getThaiString('Sun'));

        last = getElement('.weekdaytitle:last-child');
        expect(last).not.toBe(null);
        expect(last.textContent.trim()).toBe(getThaiString('Sat'));
    });

    it('options - sunHighlight', () => {
        comp.setDefaultMonth('2016/01');

        let opts: IMyOptions = {
            sunHighlight: true
        };

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        let highlight = getElements('.highlight');
        expect(highlight).not.toBe(null);
        expect(highlight.length).toBe(6);

        comp.closeCalendar();


        opts.sunHighlight = false;

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        highlight = getElements('.highlight');
        expect(highlight.length).toBe(0);
    });

    it('options - satHighlight', () => {
        comp.setDefaultMonth('2016/01');

        let opts: IMyOptions = {
            sunHighlight: false,
            satHighlight: true
        };

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        let highlight = getElements('.highlight');
        expect(highlight).not.toBe(null);
        expect(highlight.length).toBe(6);

        comp.closeCalendar();


        opts.satHighlight = false;

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        highlight = getElements('.highlight');
        expect(highlight.length).toBe(0);
    });

    it('options - highlightDates', () => {
        comp.setDefaultMonth('2016/01');

        let opts: IMyOptions = {
            sunHighlight: false,
            satHighlight: false,
            highlightDates: [{ year: 2016, month: 1, day: 10 }, { year: 2016, month: 1, day: 12 }, { year: 2016, month: 1, day: 13 }]
        };

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        let highlight = getElements('.highlight');
        expect(highlight).not.toBe(null);
        expect(highlight.length).toBe(3);

        comp.closeCalendar();


        opts.highlightDates = [];

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        highlight = getElements('.highlight');
        expect(highlight.length).toBe(0);
    });

    it('options - markCurrentDay', () => {
        let opts: IMyOptions = {
            markCurrentDay: true
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        comp.closeCalendar();


        opts.markCurrentDay = false;

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        markcurrday = getElement('.markcurrday');
        expect(markcurrday).toBe(null);
    });

    it('options - markCurrentMonth', () => {
        let opts: IMyOptions = {
            markCurrentMonth: true
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let monthlabel = getElement('.monthlabel');
        monthlabel.click();

        fixture.detectChanges();
        let markcurrmonth = getElement('.markcurrmonth');
        expect(markcurrmonth).not.toBe(null);
    });

    it('options - markCurrentYear', () => {
        let opts: IMyOptions = {
            markCurrentYear: true
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let yearlabel = getElement('.yearlabel');
        yearlabel.click();

        fixture.detectChanges();
        let markcurryear = getElement('.markcurryear');
        expect(markcurryear).not.toBe(null);
    });

    it('options - monthSelector', () => {
        comp.setDefaultMonth('2016/05');

        let opts: IMyOptions = {
            monthSelector: true
        };

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        let montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        montlabel.click();

        fixture.detectChanges();
        let monthtable = getElement('.monthtable');
        expect(monthtable).not.toBe(null);

        fixture.detectChanges();
        let monthcell = getElements('.monthcell');
        expect(monthcell).not.toBe(null);
        expect(monthcell.length).toBe(12);

        fixture.detectChanges();
        expect(monthcell[0].textContent.trim()).toBe(getThaiString('Jan'));

        fixture.detectChanges();
        expect(monthcell[11].textContent.trim()).toBe(getThaiString('Dec'));

        fixture.detectChanges();
        let selectedmonth = getElement('.selectedmonth');
        expect(selectedmonth).not.toBe(null);
        expect(selectedmonth.textContent.trim()).toBe(getThaiString('May'));
        selectedmonth.click();

        fixture.detectChanges();
        monthtable = getElement('.monthtable');
        expect(monthtable).toBe(null);
    });

    it('options - yearSelector', () => {
        comp.setDefaultMonth('2016/05');

        let opts: IMyOptions = {
            yearSelector: true
        };

        comp.parseOptions(opts);

        comp.openCalendar();

        fixture.detectChanges();
        let yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        yearlabel.click();

        fixture.detectChanges();
        let yeartable = getElement('.yeartable');
        expect(yeartable).not.toBe(null);

        fixture.detectChanges();
        let yearcell = getElements('.yearcell');
        expect(yearcell).not.toBe(null);
        expect(yearcell.length).toBe(25);

        fixture.detectChanges();
        expect(yearcell[0].textContent.trim()).toBe(getThaiYearString('2016'));

        fixture.detectChanges();
        expect(yearcell[24].textContent.trim()).toBe(getThaiYearString('2040'));

        fixture.detectChanges();
        let selectedyear = getElement('.selectedyear');
        expect(selectedyear).not.toBe(null);
        expect(selectedyear.textContent.trim()).toBe(getThaiYearString('2016'));

        selectedyear.click();

        fixture.detectChanges();
        yeartable = getElement('.yeartable');
        expect(yeartable).toBe(null);
    });

    it('options - yearOffset', () => {
        comp.setDefaultMonth('2017/06');
        comp.openCalendar();

        fixture.detectChanges();
        let yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe('2560');

        yearlabel.click();

        fixture.detectChanges();
        let yearcell = getElements('.yearcell');
        expect(yearcell).not.toBe(null);
        expect(yearcell.length).toBe(25);

        fixture.detectChanges();
        expect(yearcell[0].textContent.trim()).toBe('2560');

        fixture.detectChanges();
        expect(yearcell[24].textContent.trim()).toBe('2584');
        comp.closeCalendar();

        let opts: IMyOptions = {
            yearOffset: 0
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe('2017');

        yearlabel.click();

        fixture.detectChanges();
        yearcell = getElements('.yearcell');
        expect(yearcell).not.toBe(null);
        expect(yearcell.length).toBe(25);

        fixture.detectChanges();
        expect(yearcell[0].textContent.trim()).toBe('2017');

        fixture.detectChanges();
        expect(yearcell[24].textContent.trim()).toBe('2041');
        comp.closeCalendar();
    });

    it('options - disableHeaderButtons', () => {
        comp.setDefaultMonth('2016/05');

        let opts: IMyOptions = {
            disableHeaderButtons: true,
            disableUntil: { year: 2016, month: 4, day: 10 }
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.textContent.trim()).toBe(getThaiString('May'));

        fixture.detectChanges();
        let prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);
        prevmonth.click();

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.textContent.trim()).toBe(getThaiString('Apr'));

        fixture.detectChanges();
        let headerbtndisabled = getElements('.headerbtndisabled');
        expect(headerbtndisabled).not.toBe(null);
        expect(headerbtndisabled.length).toBe(2);

        prevmonth.click();

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.textContent.trim()).toBe(getThaiString('Apr'));

        fixture.detectChanges();
        let prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);
        prevyear.click();

        fixture.detectChanges();
        let yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2016'));

        comp.closeCalendar();


        opts.disableSince = { year: 2016, month: 7, day: 10 };
        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.textContent.trim()).toBe(getThaiString('May'));

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);
        nextmonth.click();

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.textContent.trim()).toBe(getThaiString('Jun'));

        fixture.detectChanges();
        headerbtndisabled = getElements('.headerbtndisabled');
        expect(headerbtndisabled).not.toBe(null);
        expect(headerbtndisabled.length).toBe(2);

        prevmonth.click();

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.textContent.trim()).toBe(getThaiString('Jun'));

        fixture.detectChanges();
        let nextyear = getElement(NEXTYEAR);
        expect(nextyear).not.toBe(null);
        nextyear.click();

        fixture.detectChanges();
        yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2016'));
    });

    it('options - showWeekNmbers', () => {
        comp.setDefaultMonth('2017/01');

        let opts: IMyOptions = {
            showWeekNumbers: true
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let weekdaytitleweeknbr = getElement('.weekdaytitleweeknbr');
        expect(weekdaytitleweeknbr).not.toBe(null);

        fixture.detectChanges();
        let daycellweeknbr = getElements('.daycellweeknbr');
        expect(daycellweeknbr.length).toBe(6);

        expect(daycellweeknbr[0].textContent.trim()).toBe('52');
        expect(daycellweeknbr[1].textContent.trim()).toBe('1');
        expect(daycellweeknbr[2].textContent.trim()).toBe('2');
        expect(daycellweeknbr[3].textContent.trim()).toBe('3');
        expect(daycellweeknbr[4].textContent.trim()).toBe('4');
        expect(daycellweeknbr[5].textContent.trim()).toBe('5');

        fixture.detectChanges();
        let prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);
        prevyear.click();

        fixture.detectChanges();
        daycellweeknbr = getElements('.daycellweeknbr');
        expect(daycellweeknbr.length).toBe(6);

        expect(daycellweeknbr[0].textContent.trim()).toBe('53');
        expect(daycellweeknbr[1].textContent.trim()).toBe('1');
        expect(daycellweeknbr[2].textContent.trim()).toBe('2');
        expect(daycellweeknbr[3].textContent.trim()).toBe('3');
        expect(daycellweeknbr[4].textContent.trim()).toBe('4');
        expect(daycellweeknbr[5].textContent.trim()).toBe('5');

        prevyear.click();

        fixture.detectChanges();
        daycellweeknbr = getElements('.daycellweeknbr');
        expect(daycellweeknbr.length).toBe(6);

        expect(daycellweeknbr[0].textContent.trim()).toBe('1');
        expect(daycellweeknbr[1].textContent.trim()).toBe('2');
        expect(daycellweeknbr[2].textContent.trim()).toBe('3');
        expect(daycellweeknbr[3].textContent.trim()).toBe('4');
        expect(daycellweeknbr[4].textContent.trim()).toBe('5');
        expect(daycellweeknbr[5].textContent.trim()).toBe('6');
    });

    it('options - selectorHeight', () => {
        comp.setDefaultMonth('2017/01');

        let opts: IMyOptions = {
            selectorHeight: '200px'
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);
        expect(selector.style['height']).toBe('200px');
    });

    it('options - selectorWidth', () => {
        comp.setDefaultMonth('2017/01');

        let opts: IMyOptions = {
            selectorWidth: '220px'
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);
        expect(selector.style['width']).toBe('220px');
    });

    it('options - minYear', () => {
        comp.setDefaultMonth('2011/12');
        let opts: IMyOptions = {
            minYear: 2010
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);

        prevyear.click();

        fixture.detectChanges();
        let yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2010'));

        prevyear.click();

        fixture.detectChanges();
        yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2010'));
    });

    it('options - maxYear', () => {
        comp.setDefaultMonth('2019/12');
        let opts: IMyOptions = {
            maxYear: 2020
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let nextyear = getElement(NEXTYEAR);
        expect(nextyear).not.toBe(null);

        nextyear.click();

        fixture.detectChanges();
        let yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2020'));

        nextyear.click();

        fixture.detectChanges();
        yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2020'));
    });

    it('options - disableUntil', () => {
        comp.setDefaultMonth('2017/01');
        let opts: IMyOptions = {
            disableUntil: { year: 2017, month: 1, day: 26 },
            disableHeaderButtons: false
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let disabled = getElements('.disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(32);

        fixture.detectChanges();
        let prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);

        prevmonth.click();

        fixture.detectChanges();
        disabled = getElements('.disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(42);
    });

    it('options - disableSince', () => {
        comp.setDefaultMonth('2017/01');
        let opts: IMyOptions = {
            disableSince: { year: 2017, month: 1, day: 12 },
            disableHeaderButtons: false
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let disabled = getElements('.disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(25);

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        nextmonth.click();

        fixture.detectChanges();
        disabled = getElements('.disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(42);
    });

    it('options - disableDates', () => {
        comp.setDefaultMonth('2017/01');
        let opts: IMyOptions = {
            disableDates: [{ year: 2017, month: 1, day: 12 }, { year: 2017, month: 1, day: 14 }]
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let disabled = getElements('.disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(2);

        fixture.detectChanges();
        let daycell = getElements('.daycell');
        expect(daycell).not.toBe(null);
        expect(daycell.length).toBe(42);

        daycell[17].click();

        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);

        fixture.detectChanges();
        let selection = getElement('.myDateInput');
        expect(selection.value).toBe('');

        daycell[18].click();

        fixture.detectChanges();
        selector = getElement('.selector');
        expect(selector).toBe(null);

        fixture.detectChanges();
        selection = getElement('.myDateInput');
        expect(selection.value).toBe('13/01/2017');
    });

    it('options - enableDates', () => {
        comp.setDefaultMonth('2017/01');
        let opts: IMyOptions = {
            disableUntil: { year: 2017, month: 1, day: 31 },
            enableDates: [{ year: 2017, month: 1, day: 14 }, { year: 2017, month: 1, day: 15 }]
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let disabled = getElements('.disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(35);

        fixture.detectChanges();
        let daycell = getElements('.daycell');
        expect(daycell).not.toBe(null);
        expect(daycell.length).toBe(42);

        daycell[19].click();

        fixture.detectChanges();
        let selection = getElement('.myDateInput');
        expect(selection.value).toBe('14/01/2017');
    });

    it('options - disableDateRanges', () => {
        comp.setDefaultMonth('2016/10');
        let opts: IMyOptions = {
            disableDateRanges: [
                { begin: { year: 2016, month: 10, day: 5 }, end: { year: 2016, month: 10, day: 7 } },
                { begin: { year: 2016, month: 10, day: 10 }, end: { year: 2016, month: 10, day: 12 } }
            ]
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let disabled = getElements('tr .disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(6);

        expect(disabled[0].textContent.trim()).toBe('5');
        expect(disabled[1].textContent.trim()).toBe('6');
        expect(disabled[2].textContent.trim()).toBe('7');

        expect(disabled[3].textContent.trim()).toBe('10');
        expect(disabled[4].textContent.trim()).toBe('11');
        expect(disabled[5].textContent.trim()).toBe('12');
    });

    it('options - markDates', () => {
        comp.setDefaultMonth('2017/01');
        let opts: IMyOptions = {
            markDates: [{ dates: [{ year: 2017, month: 1, day: 14 }, { year: 2017, month: 1, day: 15 }], color: 'red' }]
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let markdate = getElements('.markdate');
        expect(markdate).not.toBe(null);
        expect(markdate.length).toBe(2);

        comp.closeCalendar();

        opts.markDates = [];

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        markdate = getElements('.markdate');
        expect(markdate).not.toBe(null);
        expect(markdate.length).toBe(0);
    });

    it('options - markWeekends', () => {
        comp.setDefaultMonth('2017/01');
        let opts: IMyOptions = {
            markWeekends: { marked: true, color: 'red' }
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let markdate = getElements('.markdate');
        expect(markdate).not.toBe(null);
        expect(markdate.length).toBe(12);

        comp.closeCalendar();

        opts.markWeekends = { marked: false, color: '' };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        markdate = getElements('.markdate');
        expect(markdate).not.toBe(null);
        expect(markdate.length).toBe(0);
    });

    it('options - disableWeekends', () => {
        comp.setDefaultMonth('2016/10');
        let opts: IMyOptions = {
            firstDayOfWeek: 'mo',
            disableWeekends: true
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let disabled = getElements('.disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(12);

        let firstDisabled = disabled[0];
        expect(firstDisabled.textContent.trim()).toBe('1');

        let secondDisabled = disabled[1];
        expect(secondDisabled.textContent.trim()).toBe('2');


        let thirdDisabled = disabled[2];
        expect(thirdDisabled.textContent.trim()).toBe('8');

        let fourthDisabled = disabled[3];
        expect(fourthDisabled.textContent.trim()).toBe('9');


        let lastDisabled = disabled[disabled.length - 1];
        expect(lastDisabled.textContent.trim()).toBe('6');
    });

    it('options - alignSelectorRight', () => {
        comp.setDefaultMonth('2017/02');
        let opts: IMyOptions = {
            alignSelectorRight: true
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);
        expect(selector.attributes['style'].textContent.trim()).not.toContain('left: 0px');
    });

    it('options - openSelectorTopOfInput', () => {
        comp.setDefaultMonth('2017/02');
        let opts: IMyOptions = {
            openSelectorTopOfInput: true
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);
        expect(selector.attributes['style'].textContent.trim()).not.toContain('bottom: initial');
    });

    it('options - closeSelectorOnDateSelect', () => {
        comp.setDefaultMonth('2017/05');
        let opts: IMyOptions = {
            closeSelectorOnDateSelect: false
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let daycell = getElements('.daycell');
        expect(daycell).not.toBe(null);
        expect(daycell.length).toBe(42);

        daycell[0].click();

        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);

        comp.closeCalendar();

        opts.closeSelectorOnDateSelect = true;

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        daycell = getElements('.daycell');
        expect(daycell).not.toBe(null);
        expect(daycell.length).toBe(42);

        daycell[0].click();

        fixture.detectChanges();
        selector = getElement('.selector');
        expect(selector).toBe(null);
    });

    it('options - ariaLabelPrevMonth', () => {
        comp.setDefaultMonth('2017/02');
        let opts: IMyOptions = {
            ariaLabelPrevMonth: 'aria-label prev month'
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);
        expect(prevmonth.attributes['aria-label'].textContent.trim()).toBe(opts.ariaLabelPrevMonth);
    });

    it('options - ariaLabelNextMonth', () => {
        comp.setDefaultMonth('2017/02');
        let opts: IMyOptions = {
            ariaLabelNextMonth: 'aria-label next month'
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);
        expect(nextmonth.attributes['aria-label'].textContent.trim()).toBe(opts.ariaLabelNextMonth);
    });


    it('options - ariaLabelPrevYear', () => {
        comp.setDefaultMonth('2017/02');
        let opts: IMyOptions = {
            ariaLabelPrevYear: 'aria-label prev year'
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);
        expect(prevyear.attributes['aria-label'].textContent.trim()).toBe(opts.ariaLabelPrevYear);
    });

    it('options - ariaLabelNextYear', () => {
        comp.setDefaultMonth('2017/02');
        let opts: IMyOptions = {
            ariaLabelNextYear: 'aria-label next year'
        };

        comp.parseOptions(opts);
        comp.openCalendar();

        fixture.detectChanges();
        let nextyear = getElement(NEXTYEAR);
        expect(nextyear).not.toBe(null);
        expect(nextyear.attributes['aria-label'].textContent.trim()).toBe(opts.ariaLabelNextYear);
    });

    it('defaultMonth attribute', () => {
        comp.setDefaultMonth('2016/02');
        comp.openCalendar();

        fixture.detectChanges();
        let monthlabel = getElement(MONTHLABEL);
        expect(monthlabel).not.toBe(null);
        expect(monthlabel.textContent.trim()).toBe(getThaiString('Feb'));

        fixture.detectChanges();
        let yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2016'));

        comp.closeCalendar();


        comp.setDefaultMonth('2018/08');
        comp.openCalendar();

        fixture.detectChanges();
        monthlabel = getElement(MONTHLABEL);
        expect(monthlabel).not.toBe(null);
        expect(monthlabel.textContent.trim()).toBe(getThaiString('Aug'));

        fixture.detectChanges();
        yearlabel = getElement(YEARLABEL);
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.textContent.trim()).toBe(getThaiYearString('2018'));
    });

});





