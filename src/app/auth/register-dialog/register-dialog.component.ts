import { Component, Injector } from '@angular/core';
import { FormDialogComponent } from '../../shared/form-dialog.component';
import { DOCUMENT_TYPE, GENDER } from './types-select';
import { REGISTER_DIALOG_FIELDS } from './register-dialog.field';
import { FormFields } from '../../shared/form-builder-helper';
import { Observable } from 'rxjs';
import { PostulationService } from '../../core/services/postulation.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Person } from '../../core/interfaces/person';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportsModule } from '../../shared/import';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ImportsModule,
    FormsModule,
  ],
  templateUrl: './register-dialog.component.html',
  providers: [PostulationService]
})
export class RegisterDialogComponent extends FormDialogComponent<any> {

  today = new Date();
  dataSourceDocumentType = DOCUMENT_TYPE;
  dataSourceGender = GENDER;
  filesUpload: File[] = [];

  protected override formFields: FormFields = REGISTER_DIALOG_FIELDS;

  constructor(
    injector: Injector,
    dialogRef: DynamicDialogRef,
    private service: PostulationService,
  ) {
    super(injector, dialogRef, null);
  }

  getSaveService(model: Person): Observable<any> {
    return this.service.saveInfoPersona(model);
  }
}
