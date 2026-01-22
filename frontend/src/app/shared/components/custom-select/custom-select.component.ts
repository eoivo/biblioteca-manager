import { Component, forwardRef, Input, ElementRef, HostListener, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronDown, Check, Search } from 'lucide-angular';

export interface SelectOption {
    label: string;
    value: any;
    icon?: any;
}

@Component({
    selector: 'app-custom-select',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomSelectComponent),
            multi: true
        }
    ],
    templateUrl: './custom-select.component.html',
    styleUrl: './custom-select.component.scss'
})
export class CustomSelectComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() placeholder: string = 'Selecione uma opção';
    @Input() options: SelectOption[] = [];
    @Input() error: boolean = false;
    @Input() searchable: boolean = false;

    @Output() selectionChange = new EventEmitter<any>();

    @ViewChild('selectContainer') selectContainer!: ElementRef;

    value: any = null;
    isOpen = false;
    searchTerm = '';
    filteredOptions: SelectOption[] = [];

    readonly ChevronDownIcon = ChevronDown;
    readonly CheckIcon = Check;
    readonly SearchIcon = Search;

    onChange: any = () => { };
    onTouched: any = () => { };

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (this.isOpen && !this.selectContainer.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

    toggleDropdown() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.filteredOptions = this.options;
            this.searchTerm = '';
        }
    }

    selectOption(option: SelectOption) {
        this.value = option.value;
        this.onChange(this.value);
        this.selectionChange.emit(this.value);
        this.isOpen = false;
    }

    get selectedOptionLabel(): string {
        const option = this.options.find(opt => opt.value === this.value);
        return option ? option.label : this.placeholder;
    }

    filterOptions() {
        if (!this.searchTerm) {
            this.filteredOptions = this.options;
            return;
        }
        const term = this.searchTerm.toLowerCase();
        this.filteredOptions = this.options.filter(opt =>
            opt.label.toLowerCase().includes(term)
        );
    }

    // ControlValueAccessor methods
    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }

    setDisabledState(isDisabled: boolean): void {
        // Implement if needed
    }
}
