import { Component, Injector, OnChanges, OnInit, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostulationService } from '../../../../core/services/postulation.service';
import { CboModel } from '../../../../core/interfaces/cbo-model';
import { Person } from '../../../../core/interfaces/person';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImportsModule } from '../../../../shared/import';
import { FormBaseComponent } from '../../../../shared/form-base.component';
import { Observable } from 'rxjs';
import { PERSON_DATA_FIELDS } from './register-data.fields';
import dayjs from 'dayjs';
@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ImportsModule,
    FormsModule,
  ],
  templateUrl: './personal-information.component.html',
  providers: [PostulationService, MessageService, ConfirmationService]

})
export class PersonalInformationComponent extends FormBaseComponent<Person> implements OnInit {

  licenseDrives = input<CboModel[]>();
  genders = input<CboModel[]>();
  documentTypes = input<CboModel[]>();
  civilStates = input<CboModel[]>();
  personId = input<Person>();
  today = new Date();

  private service = inject(PostulationService);
  protected override formFields = PERSON_DATA_FIELDS;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();
    this._SetData();
  }

  _SetData(): void {
    this.setPersonaForm(this.personId()!);
  }
  setPersonaForm(person: Person): void {
    if (!person) return;
    person.birthDate = this.formatDate(person.birthDate);
    this.formGroup.patchValue(person);
  }

  override onSaveSuccess(rec: any): void {
    const me = this;
    const message = me.getSuccessUpdateMessage(rec);
    me.messageService.add({ severity: 'success', detail: `${message}`, life: 3000 });
    me.setStatusReady();
    me.setPersonaForm(rec.data);
  }

  private formatDate(fieldName: string): string {
    return dayjs(fieldName).format('DD/MM/YYYY');
  }

  private buildFullName(model: any): string {
    return `${model.firstName} ${model.lastPatName} ${model.lastMatName}`;
  }

  override getPostData(): any {
    const model = super.getPostData();
    return {
      ...model,
      name: this.buildFullName(model),
    };
  };

  override getSaveService(model: any): Observable<any> {
    return this.service.updateInfoPersona(model, model.id)
  }
}
