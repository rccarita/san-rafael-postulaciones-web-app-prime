import { Component } from '@angular/core';
import { FiltersContainerComponent } from '../../../../shared/filters-container.component';
import { Filter } from '../../../../../app/core/interfaces/filter';
import { FormsModule } from '@angular/forms';
import { ImportsFiltersModule } from '../../imports-filters';
@Component({
  selector: 'app-current-calls-filters',
  standalone: true,
  imports: [
    FormsModule,
    ImportsFiltersModule,
  ],
  templateUrl: './current-calls-filters.component.html',
})
export class CurrentCallsFiltersComponent extends FiltersContainerComponent {
  textSearch: any;
  override filters: Filter[] = [
    { id: '_query', type: 'string', field: '_query', operator: '~' },
  ];

  override setSearchFilterValue(event: any): void {
    const searchText = event.target.value;
    this.setFilterValue('_query', searchText);
  }

  onStateChange(e: any): void {
    this.setFilterValue('stateId', e.value);
  }

  clearFilters(): void {
    this.textSearch = null;
    this.resetFilters();
  }
}
