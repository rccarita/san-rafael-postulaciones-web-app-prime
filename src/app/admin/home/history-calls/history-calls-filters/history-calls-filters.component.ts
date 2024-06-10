import { Component, OnInit } from '@angular/core';
import { FiltersContainerComponent } from '../../../../shared/filters-container.component';
import { Filter } from '../../../../core/interfaces/filter';
import { FormsModule } from '@angular/forms';
import { ImportsFiltersModule } from '../../imports-filters';

@Component({
  selector: 'app-history-calls-filters',
  standalone: true,
  imports: [
    FormsModule,
    ImportsFiltersModule,
  ],
  templateUrl: './history-calls-filters.component.html',
})
export class HistoryCallsFiltersComponent extends FiltersContainerComponent implements OnInit {
  states: any;

  ngOnInit(): void {
    this.states = [
      { id: 'CANCELLED', name: 'Cancelado' },
      { id: 'CLOSED', name: 'Concluido' },
      { id: 'PROCESS', name: 'En proceso' }
    ];
  }
  textSearch: any;
  selectedState: any;
  override filters: Filter[] = [
    { id: 'stateId', type: 'string', field: 'stateId', operator: '=' },
    { id: '_query', type: 'string', field: '_query', operator: '~' },
  ];



  override setSearchFilterValue(event: any): void {
    const searchText = event.target.value;
    this.setFilterValue('_query', searchText);
  }

  onStateChange(e: any): void {
    this.setFilterValue('stateId', e);
  }

  clearFilters(): void {
    this.textSearch = null;
    this.selectedState = null;
    this.resetFilters();
  }
}
