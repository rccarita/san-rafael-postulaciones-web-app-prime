import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../core/services/common.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PostulationService } from '../../../../core/services/postulation.service';
import { WorkExperienceEditorComponent } from './work-experience-editor/work-experience-editor.component';
import { TableViewComponent } from '../../../../shared/table-view.component';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Column } from '../../../../core/interfaces/column';
import { ExportColumn } from '../../../../core/interfaces/export-column';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CboModel } from '../../../../core/interfaces/cbo-model';
import { Person } from '../../../../core/interfaces/person';
import { TEXT } from '../../../../constants/text';

@Component({
  selector: 'app-work-experience',
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
  templateUrl: './work-experience.component.html',
  providers: [
    PostulationService,
    MessageService,
    NotificationService,
    CommonService,
    ConfirmationService,
    DialogService,
  ],
})
export class WorkExperienceComponent extends TableViewComponent<any> implements OnInit {
  @Input() molType!: CboModel[];
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
      { field: 'companyName', header: 'Empresa Contratista', type: 'text' },
      { field: 'areaName', header: 'Area/Unidad/Dpto', type: 'text' },
      { field: 'positionName', header: 'Puesto Trabajo', type: 'text' },
      { field: 'start_date', header: 'Fecha de Inicio', type: 'date' },
      { field: 'end_date', header: 'Fecha de Fin', type: 'date' },
      { field: 'current', header: 'Empleo Actual?', type: 'boolean' },
    ];
    this._selectedColumns = this.columns;
    this.exportColumns = this.columns.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  formatCell(element: any, column: any): any {
    switch (column.type) {
      case 'date':
        return new Date(element[column.field]).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      case 'boolean':
        return element[column.field] ? 'Si' : 'No';
      case 'text':
      default:
        return element[column.field];
    }
  }

  override getListService(): Observable<any> {
    const id = this.commonService.getPersonId();
    return this.service.workExperienceList(id, this.getCollectionQueryParams(true));
  }

  openWorkExperience(): void {
    this.ref = this.dialogService.open(WorkExperienceEditorComponent, {
      data: {
        molType: this.molType,
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

  get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  editWorkExperience(model: any): void {
    this.ref = this.dialogService.open(WorkExperienceEditorComponent, {
      data: {
        model,
        molType: this.molType,
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

  deleteWorkExperience(id: any): void {
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

  handleDeleteConfirmation(workExperienceId: any): void {
    this.service.workExperienceDelete(workExperienceId)
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
