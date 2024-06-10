import { Component, OnInit, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilderHelper } from '../../../../../shared/form-builder-helper';
import { PERSON_DATA_BIRTH_FIELDS } from '../register-data.fields';
import { CboModel } from '../../../../../core/interfaces/cbo-model';
import { Person } from '../../../../../core/interfaces/person';
import { ImportsModule } from '../../../../../shared/import';

@Component({
  selector: 'app-personal-information-data-birth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ImportsModule,
  ],
  templateUrl: './personal-information-data-birth.component.html',
})
export class PersonalInformationDataBirthComponent implements OnInit {

  provinces = input<CboModel[]>();
  districts = input<CboModel[]>();
  departments = input<CboModel[]>();
  personId = input<Person>();

  personDataBirthFormGroup!: FormGroup;

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
    this.personDataBirthFormGroup = this.formBuilderHelper.buildFormGroup(PERSON_DATA_BIRTH_FIELDS, values);
  }

  _SetData(): void {
    this.setPersonaForm(this.personId()!);
  }

  setPersonaForm(person: Person): void {
    if (person.birthUbigeo) {
      this.personDataBirthFormGroup.patchValue({ birthUbigeo: person.birthUbigeo });
    }
  }
}
