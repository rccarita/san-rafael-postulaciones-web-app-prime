import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewRequirementsComponent } from '../../view-requirements/view-requirements.component';
import { CommonModule } from '@angular/common';
import { TableViewComponent } from '../../../shared/table-view.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PostulationService } from '../../../core/services/postulation.service';
import { CommonService } from '../../../core/services/common.service';
import { TEXT } from '../../../constants/text';
import { TableModule } from 'primeng/table';
import { Column } from '../../../core/interfaces/column';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-current-calls',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    ButtonModule
  ],
  templateUrl: './current-calls.component.html',
  providers: [DialogService]
})
export class CurrentCallsComponent extends TableViewComponent<any> implements OnInit {
  columns: any[] = [];
  ref: DynamicDialogRef | undefined;
  constructor() {
    super();
  }

  private service = inject(PostulationService);
  private commonService = inject(CommonService);
  private dialogService = inject(DialogService);

  override ngOnInit(): void {
    super.ngOnInit();

    this.columns = [
      { field: 'jobPositionName', header: 'Puesto de Trabajo' },
      { field: 'quantity', header: 'Nro. de Vacantes' },
      { field: 'companyName', header: 'Contratista' },
      { field: 'periodo', header: 'Periodo de Postulación' },
    ];
  }

  openDialog(id: string): void {
    this.ref = this.dialogService.open(ViewRequirementsComponent, {
      data: {
        id: id,
        postulate: true
      },
      width: '100vh',
      header: TEXT.CALLS_TITLE,
      contentStyle: { 'overflow': 'auto' },
      draggable: true,
      styleClass: 'custom-header-dialog'
    });
  }

  override getListService(): Observable<any> {
    const id = this.commonService.getPersonId();
    return this.service.myWorkOffersList(id, this.getCollectionQueryParams(true));
  }
}
