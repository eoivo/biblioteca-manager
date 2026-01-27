import { Component, forwardRef, Input, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { LucideAngularModule, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CalendarComponent),
            multi: true
        }
    ],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements ControlValueAccessor {
    @Input() label: string = 'Selecione uma data';
    @Input() placeholder: string = 'DD/MM/AAAA';
    @Input() minDate: Date | null = null;
    @Input() maxDate: Date | null = null;

    @ViewChild('calendarContainer') calendarContainer!: ElementRef;

    value: string = '';
    showCalendar = false;
    currentDate = new Date();
    selectedDate: Date | null = null;

    viewDate = new Date();
    days: (number | null)[] = [];
    weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    viewMode: 'days' | 'months' | 'years' = 'days';
    years: number[] = [];
    startYear: number = 2020;

    readonly CalendarIcon = CalendarIcon;
    readonly PrevIcon = ChevronLeft;
    readonly NextIcon = ChevronRight;

    onChange: any = () => { };
    onTouched: any = () => { };

    constructor() {
        this.generateCalendar();
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (this.showCalendar && !this.calendarContainer.nativeElement.contains(event.target)) {
            this.showCalendar = false;
        }
    }

    toggleCalendar() {
        this.showCalendar = !this.showCalendar;
        if (this.showCalendar) {
            this.viewMode = 'days';
            if (this.selectedDate) {
                this.viewDate = new Date(this.selectedDate);
            } else {
                this.viewDate = new Date();
            }
        }
        this.generateCalendar();
    }

    generateCalendar() {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

        this.days = [];

        // Fill empty days before first date
        for (let i = 0; i < firstDayOfMonth; i++) {
            this.days.push(null);
        }

        // Fill dates of month
        for (let i = 1; i <= lastDateOfMonth; i++) {
            this.days.push(i);
        }
    }

    generateYears() {
        this.years = [];
        const currentYear = this.viewDate.getFullYear();
        // Start year is roughly 10 years back from viewDate if not set or if we are navigating
        // To make it stable, let's use the startYear variable
        for (let i = 0; i < 12; i++) {
            this.years.push(this.startYear + i);
        }
    }

    canGoPrev(): boolean {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        if (this.viewMode === 'days') {
            if (!this.minDate) return true;
            const lastDayOfPrevMonth = new Date(year, month, 0);
            return lastDayOfPrevMonth >= this.minDate;
        } else if (this.viewMode === 'months') {
            if (!this.minDate) return true;
            return year > this.minDate.getFullYear();
        } else if (this.viewMode === 'years') {
            if (!this.minDate) return true;
            return this.startYear > this.minDate.getFullYear();
        }
        return true;
    }

    canGoNext(): boolean {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        if (this.viewMode === 'days') {
            if (!this.maxDate) return true;
            const firstDayOfNextMonth = new Date(year, month + 1, 1);
            return firstDayOfNextMonth <= this.maxDate;
        } else if (this.viewMode === 'months') {
            if (!this.maxDate) return true;
            return year < this.maxDate.getFullYear();
        } else if (this.viewMode === 'years') {
            if (!this.maxDate) return true;
            return (this.startYear + 11) < this.maxDate.getFullYear();
        }
        return true;
    }

    prev(event: Event) {
        event.stopPropagation();
        if (!this.canGoPrev()) return;

        if (this.viewMode === 'days') {
            this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
            this.generateCalendar();
        } else if (this.viewMode === 'years') {
            this.startYear -= 12;
            this.generateYears();
        } else if (this.viewMode === 'months') {
            this.viewDate = new Date(this.viewDate.getFullYear() - 1, this.viewDate.getMonth(), 1);
        }
    }

    next(event: Event) {
        event.stopPropagation();
        if (!this.canGoNext()) return;

        if (this.viewMode === 'days') {
            this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
            this.generateCalendar();
        } else if (this.viewMode === 'years') {
            this.startYear += 12;
            this.generateYears();
        } else if (this.viewMode === 'months') {
            this.viewDate = new Date(this.viewDate.getFullYear() + 1, this.viewDate.getMonth(), 1);
        }
    }

    switchMode(mode: 'days' | 'months' | 'years') {
        this.viewMode = mode;
        if (mode === 'years') {
            // Find the start year for the grid (multiples of 12)
            const year = this.viewDate.getFullYear();
            this.startYear = year - (year % 12);
            this.generateYears();
        }
    }

    selectMonth(index: number) {
        if (this.isDisabledMonth(index)) return;
        this.viewDate = new Date(this.viewDate.getFullYear(), index, 1);
        this.viewMode = 'days';
        this.generateCalendar();
    }

    selectYear(year: number) {
        if (this.isDisabledYear(year)) return;
        this.viewDate = new Date(year, this.viewDate.getMonth(), 1);
        this.viewMode = 'months';
    }

    selectDate(day: number | null) {
        if (day === null) return;

        const date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);

        if (this.minDate && date < this.minDate) {
            return;
        }

        if (this.maxDate && date > this.maxDate) {
            return;
        }

        this.selectedDate = date;
        const formatted = this.formatDate(date);
        this.value = formatted;
        this.onChange(this.toIsoDate(date));
        this.showCalendar = false;
    }

    isToday(day: number | null): boolean {
        if (day === null) return false;
        const date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isSelected(day: number | null): boolean {
        if (day === null || !this.selectedDate) return false;
        const date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        return date.toDateString() === this.selectedDate.toDateString();
    }

    isDisabled(day: number | null): boolean {
        if (day === null) return false;
        const date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);

        const isBeforeMin = this.minDate ? date < this.minDate : false;
        const isAfterMax = this.maxDate ? date > this.maxDate : false;

        return isBeforeMin || isAfterMax;
    }

    isDisabledMonth(monthIndex: number): boolean {
        const year = this.viewDate.getFullYear();
        const dateFirst = new Date(year, monthIndex, 1);
        const dateLast = new Date(year, monthIndex + 1, 0);

        if (this.maxDate && dateFirst > this.maxDate) return true;
        if (this.minDate && dateLast < this.minDate) return true;

        return false;
    }

    isDisabledYear(year: number): boolean {
        if (this.maxDate && year > this.maxDate.getFullYear()) return true;
        if (this.minDate && year < this.minDate.getFullYear()) return true;
        return false;
    }

    formatDate(date: Date): string {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }

    toIsoDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    onInputChange(event: any) {
        const value = event.target.value;
        // Basic mask DD/MM/AAAA
        let cleaned = value.replace(/\D/g, '');
        if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);

        let formatted = cleaned;
        if (cleaned.length > 2) formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
        if (cleaned.length > 4) formatted = formatted.substring(0, 5) + '/' + formatted.substring(5);

        this.value = formatted;
        event.target.value = formatted;

        if (cleaned.length === 8) {
            const d = parseInt(cleaned.substring(0, 2));
            const m = parseInt(cleaned.substring(2, 4)) - 1;
            const y = parseInt(cleaned.substring(4, 8));
            const date = new Date(y, m, d);
            if (!isNaN(date.getTime())) {
                this.selectedDate = date;
                this.viewDate = new Date(date);
                this.onChange(this.toIsoDate(date));
                this.generateCalendar();
            }
        }
    }

    // ControlValueAccessor methods
    writeValue(value: string): void {
        if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                this.selectedDate = date;
                this.viewDate = new Date(date);
                this.value = this.formatDate(date);
                this.generateCalendar();
            }
        } else {
            this.value = '';
            this.selectedDate = null;
        }
    }

    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
}
