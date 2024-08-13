import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TableViewComponent } from '../../../shared/table-view.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { PostulationService } from '../../../core/services/postulation.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { CommonService } from '../../../core/services/common.service';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TEXT } from '../../../constants/text';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-my-postulations',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    PaginatorModule,
    ToastModule,
  ],
  templateUrl: './my-postulations.component.html',
  providers: [
    MessageService,
    PostulationService,
    NotificationService,
    CommonService,
    ConfirmationService,
  ]
})
export class MyPostulationsComponent extends TableViewComponent<any> implements OnInit {

  columns: any[] = [];
  ref: DynamicDialogRef | undefined;
  constructor() {
    super();
  }

  private service = inject(PostulationService);
  private commonService = inject(CommonService);
  private notificationService = inject(NotificationService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  override ngOnInit(): void {
    super.ngOnInit();

    this.columns = [
      { field: 'name', header: 'Puesto de Trabajo' },
      { field: 'companyName', header: 'Contratista' },
      { field: 'dateInscription', header: 'Fecha de contratación' },
      { field: 'statusName', header: 'Estado' },
    ];
  }

  deletePostulation(id: any): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar la postulación al empleo?',
      header: TEXT.DELETE_TITLE,
      icon: 'pi pi-info-circle custom-icon',
      rejectButtonStyleClass: 'p-button-outlined',
      acceptLabel: TEXT.ACCEPT,
      rejectLabel: TEXT.REJECT,
      accept: () => {
        this.handleDeleteConfirmation(id);
      }
    });
  }

  handleDeleteConfirmation(id: any): void {
    this.service.deletePostulation(id)
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

  override getListService(): Observable<any> {
    const id = this.commonService.getPersonId();
    return this.service.postulationList(id, this.getCollectionQueryParams(true));
  }
}
