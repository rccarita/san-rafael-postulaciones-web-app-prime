import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostulationService } from '../../../../../core/services/postulation.service';
import { FormFields } from '../../../../../shared/form-builder-helper';
import { FormDialogComponent } from '../../../../../shared/form-dialog.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ImportsModule } from '../../../../../shared/import';
import { CboModel } from '../../../../../core/interfaces/cbo-model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-work-experience-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImportsModule,
  ],
  templateUrl: './work-experience-editor.component.html',
})
export class WorkExperienceEditorComponent extends FormDialogComponent<any> implements OnInit {

  today = new Date();
  molType: CboModel[];
  personId: number;

  protected override formFields: FormFields = {
    personId: {},
    id: {},
    companyName: {
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    typeId: {
      required: true,
    },
    areaName: {
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    positionName: {
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    start_date: {
      required: true,
    },
    end_date: {},
    description: {
      required: true,
      minLength: 4,
      maxLength: 200,
    },
  };

  constructor(
    injector: Injector,
    dialogRef: DynamicDialogRef,
    @Inject(DynamicDialogConfig) public data: any,
    private service: PostulationService,
  ) {
    super(injector, dialogRef, data);
    this.molType = data.data.molType;
    this.personId = data.data.personId;
  }

  protected override getFormGroupInitialValues(): any {
    const initialValues = { ...this.model };
    if (initialValues.end_date) initialValues.end_date = new Date(initialValues.end_date);
    if (initialValues.start_date) initialValues.start_date = new Date(initialValues.start_date);
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
    return this.service.saveWorkExperience(model);
  }
}
