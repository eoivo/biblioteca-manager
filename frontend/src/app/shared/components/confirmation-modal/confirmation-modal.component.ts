import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, X } from 'lucide-angular';

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
    @Input() title: string = 'Confirmar ação';
    @Input() message: string = 'Tem certeza que deseja prosseguir?';
    @Input() confirmText: string = 'Confirmar';
    @Input() cancelText: string = 'Cancelar';
    @Input() type: 'danger' | 'warning' | 'info' = 'danger';
    @Input() isOpen: boolean = false;

    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    readonly AlertIcon = AlertTriangle;
    readonly CloseIcon = X;

    onConfirm() {
        this.confirm.emit();
    }

    onCancel() {
        this.cancel.emit();
    }
}
