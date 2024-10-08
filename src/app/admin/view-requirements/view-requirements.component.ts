import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PostulationService } from '../../core/services/postulation.service';
import { CommonService } from '../../core/services/common.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from '../../core/services/notification/notification.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TEXT } from '../../constants/text';

@Component({
  selector: 'app-view-requirements',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './view-requirements.component.html',
  styleUrl: './view-requirements.component.scss',
  providers: [
    PostulationService,
    CommonService,
    ConfirmationService,
    MessageService,
    NotificationService,
  ]
})
export class ViewRequirementsComponent {

  workOffers: any = {};
  dataId!: string;
  viewPostulate!: boolean;
  endHour: string = '11:50 PM'

  private service = inject(PostulationService);
  private data = inject(DynamicDialogConfig);
  private commonService = inject(CommonService);
  private dialogRef = inject(DynamicDialogRef);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.dataId = this.data.data.id;
    this.viewPostulate = this.data.data.postulate;
    this.getWorkOffers();
  }

  getWorkOffers() {
    this.service.getWorkOffers(this.dataId)
      .subscribe({
        next:
          (res: any) => {
            this.workOffers = res.data;
          },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  zeroPad(num: any, places: any): string {
    return String(num).padStart(places, '0');
  }

  savePostulation(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea postular a este empleo?',
      header: 'Postulación',
      icon: 'pi pi-info-circle custom-icon-info',
      acceptLabel: TEXT.ACCEPT,
      rejectLabel: TEXT.REJECT,
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this.handleSaveConfirmation();
      }
    });
  }

  handleSaveConfirmation(): void {
    let personId = this.commonService.getPersonId();
    this.service.savePostulation(personId, this.dataId).subscribe({
      next: (_) => {
        this.messageService.add({ severity: 'success', detail: 'La postulación se realizó correctamente', life: 3000, });
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }
}
