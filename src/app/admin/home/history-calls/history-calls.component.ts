import { Component, OnInit, inject } from '@angular/core';
import { TableViewComponent } from '../../../shared/table-view.component';
import { Router } from '@angular/router';
import { PostulationService } from '../../../core/services/postulation.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../shared/import';
import { Column } from '../../../core/interfaces/column';
import { HistoryCallsFiltersComponent } from './history-calls-filters/history-calls-filters.component';
import { ViewRequirementsComponent } from '../../view-requirements/view-requirements.component';
import { TEXT } from '../../../constants/text';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { JobPosition } from '../../../models/job-position';

@Component({
  selector: 'app-history-calls',
  standalone: true,
  imports: [
    CommonModule,
    ImportsModule,
    HistoryCallsFiltersComponent,
  ],
  templateUrl: './history-calls.component.html',
  providers: [
    PostulationService,
    DialogService,
  ]
})
export class HistoryCallsComponent extends TableViewComponent<JobPosition> implements OnInit {
  ref: DynamicDialogRef | undefined;
  columns: Column[] = [];

  constructor(
  ) {
    super();
  }

  router = inject(Router);
  service = inject(PostulationService);
  dialogService = inject(DialogService);

  override ngOnInit(): void {
    super.ngOnInit();

    this.columns = [
      { field: 'jobPositionName', header: 'Puesto de Trabajo' },
      { field: 'quantity', header: 'Nro. de Vacantes' },
      { field: 'requirements', header: 'Requisitos' },
      { field: 'companyName', header: 'Contratista' },
      { field: 'statusName', header: 'Estado' }
    ];
  }

  override getListService(): Observable<any> {
    return this.service.getOffersHistory(this.getCollectionQueryParams());
  }

  openDialog(id: string): void {
    this.ref = this.dialogService.open(ViewRequirementsComponent, {
      data: {
        id: id,
        postulate: false,
      },
      width: '100vh',
      contentStyle: { overflow: 'visible' },
      header: TEXT.CALLS_TITLE,
      draggable: true,
      styleClass: 'custom-header-dialog'
    });
  }

  refreshData() {
    this.loadData();
  }
}
