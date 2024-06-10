import { Component, OnInit, inject } from '@angular/core';
import { CboModel } from '../../core/interfaces/cbo-model';
import { Person } from '../../core/interfaces/person';
import { NotificationService } from '../../core/services/notification/notification.service';
import { PostulationService } from '../../core/services/postulation.service';
import { CommonService } from '../../core/services/common.service';
import { FilesUpload } from '../../core/interfaces/files-upload';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { CurrentCallsComponent } from './current-calls/current-calls.component';
import { MyPostulationsComponent } from './my-postulations/my-postulations.component';
import { forkJoin } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { AcademicTrainingComponent } from './register-data/academic-training/academic-training.component';
import { FieldsetModule } from 'primeng/fieldset';
import { TrainingComponent } from './register-data/training/training.component';
import { WorkExperienceComponent } from './register-data/work-experience/work-experience.component';
import { PersonalInformationComponent } from './register-data/personal-information/personal-information.component';
import { PersonalInformationDataBirthComponent } from './register-data/personal-information/personal-information-data-birth/personal-information-data-birth.component';
import { PersonalInformationDataUbigeoComponent } from './register-data/personal-information/personal-information-data-ubigeo/personal-information-data-ubigeo.component';
import { UploadCvComponent } from './register-data/upload-cv/upload-cv.component';
import { OtherDocumentsComponent } from './register-data/other-documents/other-documents.component';

@Component({
  selector: 'app-postulation',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CurrentCallsComponent,
    TabViewModule,
    AccordionModule,
    ButtonModule,
    MyPostulationsComponent,
    AcademicTrainingComponent,
    WorkExperienceComponent,
    TrainingComponent,
    FieldsetModule,
    PersonalInformationComponent,
    PersonalInformationDataBirthComponent,
    PersonalInformationDataUbigeoComponent,
    UploadCvComponent,
    OtherDocumentsComponent,
  ],
  templateUrl: './postulation.component.html',
  providers: [
    PostulationService,
    NotificationService,
    CommonService,
    ConfirmationService,
  ]
})
export class PostulationComponent implements OnInit {

  documentTypes!: CboModel[];
  civilStates!: CboModel[];
  genders!: CboModel[];
  licenseDrives!: CboModel[];
  departments!: CboModel[];
  provinces!: CboModel[];
  districts!: CboModel[];
  educationLevels!: CboModel[];
  capacitationType!: CboModel[];
  trainingLevel!: CboModel[];
  molType!: CboModel[];
  person!: Person;
  private sessionTimeout: number = 1200000;
  private inactiveTime: number = 0;
  filesUploaded: FilesUpload[] = [];

  isPostulationListActive = false;
  isRegisterDataUserActive = false;
  isCvUploadActive = false;
  isOtherDocumentsActive = false;

  private service = inject(PostulationService);
  private notificationService = inject(NotificationService);
  private commonService = inject(CommonService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this._loadData();
    this._loadListParameters();
    const token = this.commonService.getToken();
    if (token) {
      this.setupTimer();
    }
  }

  _loadData(): void {
    const personId = this.commonService.getPersonId();
    forkJoin({
      person: this.service.getInfoPersona(personId),
    }).subscribe({
      next: ({ person }) => {
        this.person = person.data;
        this._loadDocuments(this.person.uuid);
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }

  _loadListParameters() {
    this.service.getLisParameters().subscribe({
      next:
        (res: any) => {
          this.loadListsData(res);
        },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }

  _loadDocuments(uuid: string): void {
    this.service.getDocuments(uuid)
      .subscribe({
        next: (res: any) => {
          this.filesUploaded = res.data;
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  loadListsData(data: any) {
    this.documentTypes = data.COM_IDT.items;
    this.genders = data.COM_SEX.items;
    this.licenseDrives = data.COM_TYPE_LICENCE_DRIVE.items;
    this.civilStates = data.COM_CIVILSTATUS.items;
    this.departments = data.TBL_LEVEL1.items;
    this.provinces = data.TBL_LEVEL2.items;
    this.districts = data.TBL_LEVEL3.items;
    this.educationLevels = data.COM_EDUCATION_LEVEL.items;
    this.capacitationType = data.MOL_TRANING_TYPE.items;
    this.trainingLevel = data.MOL_TRANING_LEVEL.items;
    this.molType = data.MOL_MOL_TYPE.items;
  }

  setupTimer(): void {
    this.inactiveTime = 0;
    window.addEventListener('mousemove', () => {
      this.inactiveTime = 0;
    });
    window.addEventListener('keypress', () => {
      this.inactiveTime = 0;
    });
    const timer = setInterval(() => {
      this.inactiveTime += 1000;
      if (this.inactiveTime >= this.sessionTimeout) {
        clearInterval(timer);
        this.onSessionTimeout();
      }
    }, 1000);
  }

  onDocumentsUpdated(): void {
    this._loadData();
  }

  onSessionTimeout(): void {
    this.commonService.removeSession();
    this.showSessionTimeoutModal();
  }

  reload(): void {
    window.location.reload();
  }

  showSessionTimeoutModal(): void {
    this.confirmationService.confirm({
      header: '¡Tu sesión ha expirado!',
      message: 'Por favor, inicia sesión nuevamente para continuar.',
      icon: 'pi pi-info-circle custom-icon',
      rejectVisible: false,
      accept: () => {
        this.reload();
      }
    });
  }
}

