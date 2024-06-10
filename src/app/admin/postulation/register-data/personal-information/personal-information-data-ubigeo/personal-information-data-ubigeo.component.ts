import { Component, OnInit, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilderHelper } from '../../../../../shared/form-builder-helper';
import { PERSON_DATA_UBIGEO_FIELDS } from '../register-data.fields';
import { ImportsModule } from '../../../../../shared/import';
import { CboModel } from '../../../../../core/interfaces/cbo-model';
import { Person } from '../../../../../core/interfaces/person';

@Component({
  selector: 'app-personal-information-data-ubigeo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ImportsModule,
  ],
  templateUrl: './personal-information-data-ubigeo.component.html',
})
export class PersonalInformationDataUbigeoComponent implements OnInit {

  provinces = input<CboModel[]>();
  districts = input<CboModel[]>();
  departments = input<CboModel[]>();
  personId = input<Person>();

  personDataUbigeoFormGroup!: FormGroup;

  constructor(
    private formBuilderHelper: FormBuilderHelper
  ) {
    this.defineFormGroups();
  }

  ngOnInit() {
    this._SetData();
  }

  defineFormGroups(): void {
    const values = {};
    this.personDataUbigeoFormGroup = this.formBuilderHelper.buildFormGroup(PERSON_DATA_UBIGEO_FIELDS, values);
  }

  _SetData(): void {
    this.setPersonaForm(this.personId()!);
  }
  setPersonaForm(person: Person): void {
    if (person.ubigeo) {
      this.personDataUbigeoFormGroup.patchValue({ ubigeo: person.ubigeo });
    }
  }
}
