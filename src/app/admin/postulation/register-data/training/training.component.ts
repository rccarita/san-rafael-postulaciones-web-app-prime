import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PostulationService } from '../../../../core/services/postulation.service';
import { TrainingEditorComponent } from './training-editor/training-editor.component';
import { TableViewComponent } from '../../../../shared/table-view.component';
import { CboModel } from '../../../../core/interfaces/cbo-model';
import { Person } from '../../../../core/interfaces/person';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from '../../../../core/services/common.service';
import { ExportColumn } from '../../../../core/interfaces/export-column';
import { Column } from '../../../../core/interfaces/column';
import { TEXT } from '../../../../constants/text';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-training',
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
  templateUrl: './training.component.html',
  providers: [
    PostulationService,
    MessageService,
    NotificationService,
    CommonService,
    ConfirmationService,
    DialogService,
  ]
})
export class TrainingComponent extends TableViewComponent<any> implements OnInit {
  @Input() trainingLevel!: CboModel[];
  @Input() personId!: Person;
  @Input() capacitationType!: CboModel[];
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
      { field: 'typeId', header: 'Tipo de Estudios', type: 'typeId' },
      { field: 'levelId', header: 'Nivel', type: 'levelId' },
      { field: 'institution', header: 'Institución', type: 'text' },
      { field: 'description', header: 'Descripción', type: 'text' },
      { field: 'date_start', header: 'Fecha de Inicio', type: 'date' },
      { field: 'date_end', header: 'Fecha de Fin', type: 'date' },
      { field: 'hours', header: 'Horas lectivas', type: 'text' },
      { field: 'is_internal', header: 'Capacitac. Interna?', type: 'boolean' },
    ];

    this._selectedColumns = this.columns;
    this.exportColumns = this.columns.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  formatCell(element: any, column: any): any {
    switch (column.type) {
      case 'typeId':
        return this.filterCapacitationType(element[column.field]);
      case 'levelId':
        return this.filterTrainingLevel(element[column.field]);
      case 'date':
        return new Date(element[column.field]).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      case 'boolean':
        return element[column.field] ? 'Si' : 'No';
      case 'text':
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


  filterTrainingLevel(type: any) {
    if (this.trainingLevel) {
      const training = this.trainingLevel.filter(dis => dis.id == type);
      if (training.length > 0 && training[0].text) {
        return training[0].text;
      } else {
        return 'Texto no disponible';
      }
    }
    return 'Capacitación no encontrada';
  }

  filterCapacitationType(type: any) {
    if (this.capacitationType) {
      let capacitation = this.capacitationType.filter(dis => dis.id == type);
      if (capacitation.length > 0 && capacitation[0].text) {
        return capacitation[0].text;
      } else {
        return 'Texto no disponible';
      }
    }
    return 'Tipo de Capacitación no encontrada';
  }

  override getListService(): Observable<any> {
    const id = this.commonService.getPersonId();
    return this.service.trainingList(id, this.getCollectionQueryParams(true));
  }

  openTraining(): void {
    this.ref = this.dialogService.open(TrainingEditorComponent, {
      data: {
        capacitationType: this.capacitationType,
        trainingLevel: this.trainingLevel,
        personId: this.personId.id,
      },
      width: '50vh',
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

  editTraining(model: any): void {
    this.ref = this.dialogService.open(TrainingEditorComponent, {
      data: {
        model,
        capacitationType: this.capacitationType,
        trainingLevel: this.trainingLevel
      },
      width: '50vh',
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

  deleteTraining(id: any): void {
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

  handleDeleteConfirmation(trainingId: any): void {
    this.service.trainingDelete(trainingId)
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
