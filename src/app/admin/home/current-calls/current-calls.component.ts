import { Component, OnInit, inject } from '@angular/core';
import { TableViewComponent } from '../../../shared/table-view.component';
import { Router } from '@angular/router';
import { PostulationService } from '../../../core/services/postulation.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../shared/import';
import { CurrentCallsFiltersComponent } from './current-calls-filters/current-calls-filters.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViewRequirementsComponent } from '../../view-requirements/view-requirements.component';
import { TEXT } from '../../../constants/text';
import { JobPosition } from '../../../models/job-position';

@Component({
  selector: 'app-current-calls',
  standalone: true,
  imports: [
    ImportsModule,
    CommonModule,
    CurrentCallsFiltersComponent,
  ],
  templateUrl: './current-calls.component.html',
  providers: [
    PostulationService,
    DialogService,
  ],
})
export class CurrentCallsComponent extends TableViewComponent<JobPosition> implements OnInit {

  ref: DynamicDialogRef | undefined;

  constructor() {
    super();
  }
  router = inject(Router);
  service = inject(PostulationService);
  dialogService = inject(DialogService);

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override getListService(): Observable<any> {
    return this.service.getOffers(this.getCollectionQueryParams());
  }

  postulate() {
    this.router.navigate(['/login']);
  }

  openDialog(id: string): void {
    this.ref = this.dialogService.open(ViewRequirementsComponent, {
      data: {
        id: id,
        postulate: false,
      },
      width: '100vh',
      contentStyle: { overflow: 'auto' },
      header: TEXT.CALLS_TITLE,
      draggable: true,
      styleClass: 'custom-header-dialog'
    });
  }
  
  refreshData() {
    this.loadData();
  }
}
