import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import FileSaver from 'file-saver';
import { CommonModule } from '@angular/common';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { ImportsModule } from '../../../../shared/import';
import { FilesUpload } from '../../../../core/interfaces/files-upload';
import { Person } from '../../../../core/interfaces/person';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PostulationService } from '../../../../core/services/postulation.service';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { TEXT } from '../../../../constants/text';

@Component({
  selector: 'app-other-documents',
  standalone: true,
  imports: [
    CommonModule,
    ImportsModule,
  ],
  templateUrl: './other-documents.component.html',
  providers: [
    MessageService,
    NotificationService,
    PostulationService,
    DialogService,
  ]
})
export class OtherDocumentsComponent {

  documents = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  person = input<Person>();
  filesUploaded = input<FilesUpload[]>();
  documentUpload: any;
  documentName: string = "";
  urlViewer: any;
  documentSelected: boolean = false;
  @Output() documentsUpdated = new EventEmitter<void>();

  service = inject(PostulationService);
  notificationService = inject(NotificationService);
  dialogService = inject(DialogService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private config = inject(PrimeNGConfig);

  onSelectedDocuments(event: any) {
    this.documents = event.currentFiles.slice(0, 1);
    if (this.documents.length > 0) {
      const file: File = this.documents[0];
      this.documentUpload = file;
      this.documentName = file.name;
      this.totalSize = parseInt(this.formatSize(file.size));
      this.totalSizePercent = this.totalSize / 10;
    }
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
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

  uploadFile(callback: any): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cargar el documento?',
      header: TEXT.DELETE_TITLE,
      icon: 'pi pi-info-circle custom-icon',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this.handleUploadConfirmation(callback);
      }
    });
  }

  handleUploadConfirmation(callback: any): void {
    const formData = new FormData();
    formData.append("file", this.documentUpload);
    formData.append("objectId", this.person()!.uuid);
    formData.append("objectKey", JSON.stringify(this.person()!.id));
    formData.append("objectType", "COMMON_DOCUMENT");
    formData.append("className:", this.person()!.className);
    formData.append("type:", "COMMON_DOCUMENT");
    this.service.uploadDocument(formData)
      .subscribe({
        next: (res: any) => {
          callback();
          this.documentsUpdated.emit();
          this.messageService.add({ severity: 'success', detail: TEXT.CV_MESSAGE, life: 3000, });
          this.clearUploadDocument();
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  deleteDocument(id: any): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el registro?',
      header: 'Eliminar documento!',
      icon: 'pi pi-info-circle custom-icon',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this.handleDeleteConfirmation(id);
      },
      key: 'document'
    });
  }

  handleDeleteConfirmation(id: any): void {
    this.service.removeDocument(id)
      .subscribe({
        next: (res: any) => {
          this.messageService.add({ severity: 'success', detail: TEXT.CV_MESSAGE, life: 3000, });
          this.documentsUpdated.emit();
          this.clearUploadDocument();
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  downloadDocument(uuid: string, fileName: string) {
    this.service.downloadDocument(uuid).subscribe({
      next: (response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        FileSaver.saveAs(blob, fileName);
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }

  viewDocument(urlViewer: string): void {
    this.dialogService.open(ViewDocumentComponent, {
      data: {
        urlViewer: urlViewer
      },
      width: '70vh',
      contentStyle: { 'overflow': 'auto' },
      draggable: true,
      styleClass: 'custom-header-dialog'
    })
  }

  clearUploadDocument() {
    this.documentUpload = null;
    this.documentName = "";
    this.documents = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }
}
