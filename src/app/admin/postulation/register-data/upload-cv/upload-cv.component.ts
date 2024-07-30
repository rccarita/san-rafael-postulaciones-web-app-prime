import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import * as FileSaver from 'file-saver';
import { ImportsModule } from '../../../../shared/import';
import { Person } from '../../../../core/interfaces/person';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PostulationService } from '../../../../core/services/postulation.service';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { TEXT } from '../../../../constants/text';

@Component({
  selector: 'app-upload-cv',
  standalone: true,
  imports: [
    CommonModule,
    ImportsModule,
  ],
  templateUrl: './upload-cv.component.html',
  providers: [
    MessageService,
    NotificationService,
    PostulationService,
  ]
})
export class UploadCvComponent {

  files = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  person = input<Person>();
  fileBlob: SafeResourceUrl | null = null;
  fileUpload: File | null = null;
  fileName: string = "";
  fileSelected: boolean = false;
  fileChange: boolean = true;
  @Output() documentsUpdated = new EventEmitter<void>();

  private service = inject(PostulationService);
  private sanitizer = inject(DomSanitizer);
  private notificationService = inject(NotificationService);
  private messageService = inject(MessageService);
  private config = inject(PrimeNGConfig);
  private confirmationService = inject(ConfirmationService);

  clearUploadFile() {
    this.files = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.fileUpload = null;
    this.fileName = "";
    this.fileSelected = false;
  }

  choose(event: any, callback: any) {
    callback();
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: any) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.clearUploadFile();
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes![0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes![i]}`;
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles.slice(0, 1);
    if (this.files.length > 0) {
      const file: File = this.files[0];
      this.fileUpload = file;
      this.fileName = file.name;
      this.fileSelected = true;
      this.totalSize = parseInt(this.formatSize(file.size));
      this.totalSizePercent = this.totalSize / 10;
    }
  }

  uploadFileEvent(event: any) {
    this.fileUpload = event.target.files[0];
    this.fileName = this.fileUpload!.name;
    this.fileSelected = !!this.fileUpload;
  }

  uploadFile(callback: any): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cargar el documento?',
      header: TEXT.CV_TITLE,
      icon: 'pi pi-info-circle custom-icon-info',
      acceptLabel: TEXT.ACCEPT,
      rejectLabel: TEXT.REJECT,
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this.handleUploadConfirmation(callback);
      },
    });
  }

  handleUploadConfirmation(callback: any): void {
    const formData = new FormData();
    formData.append("file", this.fileUpload!);
    formData.append("objectId", this.person()!.uuid);
    formData.append("objectKey", JSON.stringify(this.person()!.id));
    formData.append("objectType", "PERSON");
    formData.append("className", this.person()!.className);
    formData.append("type", "COMMON_DOCUMENT");

    this.service.uploadCV(formData)
      .subscribe({
        next: (res: any) => {
          callback();
          this.documentsUpdated.emit();
          this.messageService.add({ severity: 'success', detail: TEXT.CV_MESSAGE, life: 3000, });
          this.clearUploadFile();
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  downloadFile() {
    this.service.downloadCV(this.person()!.cvId)
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          FileSaver.saveAs(blob, this.person()!.numdoc + "_CV.pdf");
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  viewFile() {
    this.service.downloadCV(this.person()!.cvId)
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const fileUrl = URL.createObjectURL(blob);
          this.fileBlob = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }
}
