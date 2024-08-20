import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PostulationService } from '../../../../core/services/postulation.service';
import { TableViewComponent } from '../../../../shared/table-view.component';
import { AcademicTrainingEditorComponent } from './academic-training-editor/academic-training-editor.component';
import { CommonModule } from '@angular/common';
import { CboModel } from '../../../../core/interfaces/cbo-model';
import { Person } from '../../../../core/interfaces/person';
import { CommonService } from '../../../../core/services/common.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TEXT } from '../../../../constants/text';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { Column } from '../../../../core/interfaces/column';
import { MultiSelectModule } from 'primeng/multiselect';
import { ExportColumn } from '../../../../core/interfaces/export-column';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-academic-training',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    PaginatorModule,
    MultiSelectModule,
    ToastModule,
  ],
  templateUrl: './academic-training.component.html',
  providers: [
    MessageService,
    DialogService,
    NotificationService,
    PostulationService,
    CommonService,
    ConfirmationService,
  ]
})
export class AcademicTrainingComponent extends TableViewComponent<any> implements OnInit {

  @Input() educationLevels!: CboModel[];
  @Input() personId!: Person;
  ref: DynamicDialogRef | undefined;
  _selectedColumns: Column[] = [];
  columns: Column[] = [];
  exportColumns!: ExportColumn[];
  constructor() {
    super();
  }

  private service = inject(PostulationService)
  private commonService = inject(CommonService)
  private dialogService = inject(DialogService)
  private notificationService = inject(NotificationService)
  private messageService = inject(MessageService)
  private confirmationService = inject(ConfirmationService)

  override ngOnInit(): void {
    super.ngOnInit();

    this.columns = [
      { field: 'id_level', header: 'Grado de instrucción', type: 'level' },
      { field: 'specialty', header: 'Especialización', type: 'text' },
      { field: 'center', header: 'Centro de estudios', type: 'text' },
      { field: 'date_start', header: 'Fecha de inicio', type: 'date' },
      { field: 'date_end', header: 'Fecha de fin', type: 'date' }
    ];
    this._selectedColumns = this.columns;
    this.exportColumns = this.columns.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  override getListService(): Observable<any> {
    const id = this.commonService.getPersonId();
    return this.service.academicTrainingList(id, this.getCollectionQueryParams(true));
  }

  formatCell(element: any, column: any): any {
    switch (column.type) {
      case 'level':
        return this.filterEducationLevels(element[column.field]);
      case 'date':
        return new Date(element[column.field]).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      default:
        return element[column.field];
    }
  }

  get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  filterEducationLevels(type: any) {
    if (this.educationLevels) {
      const education = this.educationLevels.filter(dis => dis.id == type);
      if (education.length > 0 && education[0].text) {
        return education[0].text;
      } else {
        return 'Texto no disponible';
      }
    }
    return 'Nivel educativo no encontrado';
  }

  editAcademicTraining(model: any): void {
    this.ref = this.dialogService.open(AcademicTrainingEditorComponent, {
      data: {
        model,
        educationLevels: this.educationLevels,
      },
      width: '50%',
      header: TEXT.REGISTER_TITLE,
      contentStyle: { 'overflow': 'scroll' },
      draggable: true,
      styleClass: 'custom-header-dialog',
    });
    this.ref.onClose.subscribe((res: any) => {
      if (res) {
        this.loadData();
      }
    });
  }

  openDialogAcademicTraining(): void {
    this.ref = this.dialogService.open(AcademicTrainingEditorComponent, {
      data: {
        educationLevels: this.educationLevels,
        personId: this.personId.id,
      },
      width: '50%',
      header: TEXT.REGISTER_TITLE,
      contentStyle: { 'overflow': 'scroll' },
      draggable: true,
      styleClass: 'custom-header-dialog',
    });
    this.ref.onClose.subscribe((res: any) => {
      if (res) {
        this.loadData();
      }
    });
  }

  deleteAcademicTraining(id: any): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el registro?',
      header: TEXT.DELETE_TITLE,
      icon: 'pi pi-info-circle custom-icon',
      acceptLabel: TEXT.ACCEPT,
      rejectLabel: TEXT.REJECT,
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this.handleDeleteConfirmation(id);
      }
    });
  }

  handleDeleteConfirmation(academicTrainingId: any): void {
    this.service.academicTrainingDelete(academicTrainingId)
      .subscribe({
        next: (res: any) => {
          this.messageService.add({ severity: 'success', detail: TEXT.CONFIRM_DELETE, life: 3000, });
          this.loadData();
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }
}
