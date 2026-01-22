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
        if (this.showCalendar && this.selectedDate) {
            this.viewDate = new Date(this.selectedDate);
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

    prevMonth(event: Event) {
        event.stopPropagation();
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
        this.generateCalendar();
    }

    nextMonth(event: Event) {
        event.stopPropagation();
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
        this.generateCalendar();
    }

    selectDate(day: number | null) {
        if (day === null) return;

        const date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);

        if (this.minDate && date < this.minDate) {
            // Option to handle disabled dates visually, for now we just return
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
        if (day === null || !this.minDate) return false;
        const date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        return date < this.minDate;
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
