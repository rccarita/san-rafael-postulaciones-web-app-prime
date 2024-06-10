import { Directive, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { SortEvent } from 'primeng/api';
import { CollectionFilter } from '../core/interfaces/collection-filter';
import { CollectionQueryParams } from '../core/interfaces/collection-query-params';

@Directive()
export class TableViewComponent<T> implements OnInit, AfterViewInit {

    @ViewChild(Table) table?: Table;
    @ViewChild(Paginator) paginator?: Paginator;
    @Output() selectionChange = new EventEmitter<T[]>();
    autoLoad = true;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 25, 50, 100];
    serviceResponseDataProperty = 'data';
    filters: CollectionFilter[] = [];
    _loadSubscription?: Subscription;
    _isLoadingData = false;
    _didLoadDataFailed = false;
    selectionMultiple: boolean = false;
    _rawData!: T[];
    _rawTransformedData!: T[];
    data!: T[];
    totalRecords = 0;
    protected loadObs = new Subject();
    protected load = this.loadObs.asObservable();
    ngOnInit(): void {
        const me = this;
        me._subscribeLoadEvent();
        if (me.autoLoad) {
            me.loadData();
        }
    }

    ngAfterViewInit(): void {
        const me = this;
        if (me.paginator) {
            me.paginator.showCurrentPageReport = true;
            me.paginator.currentPageReportTemplate = 'Registros por página: {first} a {last} de {totalRecords}';

            me.paginator.onPageChange.subscribe(() => {
                me.loadData();
            });
        }

        if (me.table) {
            me.table.onSort.subscribe((event: SortEvent) => {
                me.pageIndex = 0;
                me.loadData();
            });
        }
    }

    loadDatasets(): void {
        'TODO:loadDatasets';
    }

    getPageIndex(): number {
        return this.paginator ? this.paginator.getPage() : this.pageIndex;
    }

    getPageSize(): number {
        return this.paginator ? this.paginator.rows : this.pageSize;
    }

    getItemNumber(index: number): number {
        return this.getPageIndex() * this.getPageSize() + index + 1;
    }

    getItem(element: any): number {
        return this.data.indexOf(element) + 1;
    }

    getCollectionQueryParams(includePage: boolean = false): CollectionQueryParams {
        const me = this;
        const paginator = me.paginator;
        const filters = me.getFilters();
        const out: CollectionQueryParams = {};
        if (paginator) {
            out.skip = paginator.getPage() * paginator.rows;
            out.take = paginator.rows;
            if (includePage) {
                out.page = paginator.getPage();
            }
        } else {
            out.skip = me.pageIndex;
            out.take = me.pageSize;
            if (includePage) {
                out.page = me.pageIndex;
            }
        }
        if (filters?.length) {
            out.filter = filters;
        }
        if (me.table?.sortField && me.table?.sortOrder) {
            out.sorter = [{ field: me.table.sortField, direction: me.table.sortOrder === 1 ? 'ASC' : 'DESC' }];
        }
        return out;
    }

    getFilters(): CollectionFilter[] {
        return this.filters;
    }

    onFiltersChange(filters: CollectionFilter[]): void {
        this.applyFilters(filters);
    }

    onSearchFilterChange(filter: CollectionFilter): void {
        console.log(filter);
    }

    applyFilters(filters: CollectionFilter[]): void {
        const me = this;
        me.filters = filters;
        me.resetPageIndex();
        me.loadData();
    }

    resetPageIndex(): void {
        const me = this;
        if (me.paginator) {
            me.paginator.first = 0;
        }
    }

    loadData(): void {
        this.loadObs.next(null);
    }

    _subscribeLoadEvent(): void {
        const me = this;
        me._loadSubscription = me.load
            .pipe(
                switchMap(() => {
                    me._isLoadingData = true;
                    me._didLoadDataFailed = false;
                    return me.getListService().pipe(
                        catchError((xhr) => {
                            me._isLoadingData = false;
                            me._didLoadDataFailed = true;
                            me.handleServerError(xhr);
                            return of(null);
                        })
                    );
                })
            )
            .subscribe((res: any) => {
                if (me._didLoadDataFailed) {
                    return;
                }
                let data: T[] = [];
                let total = 0;
                if (
                    Object.prototype.toString.call(res) === '[object Object]' &&
                    Array.isArray(res[me.serviceResponseDataProperty])
                ) {
                    data = res[me.serviceResponseDataProperty];
                    if (isNaN(res.total)) {
                        total = data.length;
                    } else {
                        total = +res.total > data.length ? +res.total : data.length;
                    }
                } else if (Array.isArray(res)) {
                    data = res;
                    total = res.length;
                }
                me._rawData = data.map(e => ({ ...e }));
                me._rawTransformedData = me.transformServiceResponseData(data);
                me.data = me._rawTransformedData.map(e => ({ ...e }));
                me.totalRecords = total;
                me._isLoadingData = false;
            });
    }

    transformServiceResponseData(data: any): T[] {
        return data;
    }

    filterData(text: string): void {
        const me = this;
        text = (text || '').toString().trimStart().toLowerCase();
        me.data = me._rawTransformedData.filter((item: any) =>
            Object.keys(item).some((key) => {
                const value = (item[key] || '').toString().toLowerCase();
                return value.includes(text.toLowerCase());
            })
        );
    }

    getListService(): Observable<any> {
        return of(null);
    }

    handleServerError(xhr: any): void {
        console.log("first")
    }
}
