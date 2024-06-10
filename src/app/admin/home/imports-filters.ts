// Import PrimeNG modules
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';

@NgModule({
    imports: [
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        DropdownModule,
        FloatLabelModule,
    ],
    exports: [
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        DropdownModule,
        FloatLabelModule,
    ],
})
export class ImportsFiltersModule { }
