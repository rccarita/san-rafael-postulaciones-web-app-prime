// Import PrimeNG modules
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { OnlyNumbersDirective } from '../core/directives/only-numbers.directive';
import { ConfirmationService } from 'primeng/api';
import { DateMaskDirective } from '../core/directives/date-mask.directive';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';

@NgModule({
    declarations: [
        OnlyNumbersDirective,
        DateMaskDirective,
    ],
    imports: [
        InputTextModule,
        MessageModule,
        TableModule,
        PaginatorModule,
        MultiSelectModule,
        ButtonModule,
        ToolbarModule,
        ToastModule,
        ConfirmDialogModule,
        InputNumberModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        RadioButtonModule,
        FileUploadModule,
        BadgeModule,
    ],
    exports: [
        InputTextModule,
        MessageModule,
        TableModule,
        PaginatorModule,
        MultiSelectModule,
        ButtonModule,
        ToolbarModule,
        ToastModule,
        ConfirmDialogModule,
        InputNumberModule,
        OnlyNumbersDirective,
        DateMaskDirective,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        RadioButtonModule,
        FileUploadModule,
        BadgeModule,
    ],
    providers: [
        ConfirmationService,
    ]
})
export class ImportsModule { }
