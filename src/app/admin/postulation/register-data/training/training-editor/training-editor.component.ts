import { CommonModule } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostulationService } from '../../../../../core/services/postulation.service';
import { FormFields } from '../../../../../shared/form-builder-helper';
import { FormDialogComponent } from '../../../../../shared/form-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImportsModule } from '../../../../../shared/import';
import { CboModel } from '../../../../../core/interfaces/cbo-model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-training-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImportsModule,
  ],
  templateUrl: './training-editor.component.html',
})
export class TrainingEditorComponent extends FormDialogComponent<any> implements OnInit {

  today = new Date()
  capacitationType: CboModel[];
  trainingLevel: CboModel[];
  personId: number;

  protected override formFields: FormFields = {
    personId: {},
    id: {},
    typeId: {
      required: true,
    },
    levelId: {
      required: true,
    },
    institution: {
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    description: {
      required: true,
      minLength: 4,
      maxLength: 200,
    },
    date_start: {
      required: true,
    },
    date_end: {
      required: true,
    },
    hours: {
      required: true,
    },
    is_internal: {
      required: true,
    },
  };

  constructor(
    injector: Injector,
    dialogRef: DynamicDialogRef,
    @Inject(DynamicDialogConfig) public data: any,
    private service: PostulationService,
  ) {
    super(injector, dialogRef, data);
    this.capacitationType = data.data.capacitationType;
    this.trainingLevel = data.data.trainingLevel;
    this.personId = data.data.personId
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected override getFormGroupInitialValues(): any {
    const initialValues = { ...this.model };
    if (initialValues.date_start) initialValues.date_start = new Date(initialValues.date_start);
    if (initialValues.date_end) initialValues.date_end = new Date(initialValues.date_end);
    return initialValues;
  }

  override getPostData() {
    const model = super.getPostData();
    return {
      ...model,
      personId: this.personId
    }
  }

  getSaveService(model: any): Observable<any> {
    return this.service.saveTraining(model);
  }
}
