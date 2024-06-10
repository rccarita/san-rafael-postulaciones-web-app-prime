import { Component, Inject, Injector, OnInit } from '@angular/core';
import { CboModel } from '../../../../../core/interfaces/cbo-model';
import { FormFields } from '../../../../../shared/form-builder-helper';
import { FormDialogComponent } from '../../../../../shared/form-dialog.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PostulationService } from '../../../../../core/services/postulation.service';
import { Observable } from 'rxjs';
import { ImportsModule } from '../../../../../shared/import';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-academic-training-editor',
  standalone: true,
  imports: [
    ImportsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './academic-training-editor.component.html',
})
export class AcademicTrainingEditorComponent extends FormDialogComponent<any> implements OnInit {

  today = new Date()
  educationLevels: CboModel[];
  personId: number;

  protected override formFields: FormFields = {
    id_person: {},
    id: {},
    id_level: {
      required: true,
    },
    specialty: {
      minLength: 4,
      maxLength: 100,
    },
    center: {
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    date_start: {
      required: true,
    },
    date_end: {
      required: true,
    }
  };
  datePipe: any;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  constructor(
    injector: Injector,
    dialogRef: DynamicDialogRef,
    @Inject(DynamicDialogConfig) public data: any,
    private service: PostulationService,
  ) {
    super(injector, dialogRef, data);
    this.educationLevels = data.data.educationLevels;
    this.personId = data.data.personId;
  }

  override getPostData(): any {
    const model = super.getPostData();
    return {
      ...model,
      id_person: this.personId,
    }
  }

  protected override getFormGroupInitialValues(): any {
    const initialValues = { ...this.model };
    if (initialValues.date_start) initialValues.date_start = new Date(initialValues.date_start);
    if (initialValues.date_end) initialValues.date_end = new Date(initialValues.date_end);
    return initialValues;
  }


  getSaveService(model: any): Observable<any> {
    return this.service.saveAcademicTraining(model);
  }
}
