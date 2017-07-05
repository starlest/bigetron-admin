import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as aa from '../../actions/articles.actions';
import { Observable } from 'rxjs/Observable';
import { go } from "@ngrx/router-store";

@Component({
    selector: 'btr-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy {
    private articlesSubscription: Subscription;

    public rows: Array<any> = [];

    public columns: Array<any> = [
        {
            title: 'Title',
            name: 'Title',
            filtering: { filterString: '', placeholder: 'Filter by title' }
        },
        {
            title: 'Author',
            name: 'Author',
            filtering: { filterString: '', placeholder: 'Filter by author' }
        },
        {
            title: 'Date',
            name: 'Date',
            filtering: { filterString: '', placeholder: 'Filter by date' }
        },
    ];

    public page: number = 1;
    public itemsPerPage: number = 10;
    public maxSize: number = 5;
    public numPages: number = 1;
    public length: number = 0;

    public config: any = {
        paging: true,
        sorting: { columns: this.columns },
        className: ['table-bordered', 'table-hover']
    };

    private filter: any = {};
    private sortOrder: string = '';

    public constructor(private store: Store<fromRoot.State>,
                       private ref: ChangeDetectorRef) {
        this.setUpFiltering();
        this.setUpSortOrder();
        this.updateData(this.page, this.itemsPerPage);
    }

    private setUpFiltering(): void {
        this.columns.forEach((column: any) => {
            if (column.filtering) {
                const filterName = column.name + 'Filter';
                this.filter[filterName] = '';
            }
        });
    }

    private setUpSortOrder(): void {
        this.columns.forEach((column: any) => {
            if (column.sort)
                this.sortOrder = column.name.toLowerCase() + '_' + column.sort;
        });
    }
    ngOnInit() {
        const articlesSource = this.store.select(
            fromRoot.getArticles);
        const pageIndexSource = this.store.select(
            fromRoot.getArticlesPageIndex);
        const totalCountSource = this.store.select(
            fromRoot.getArticlesTotalCount);

        this.articlesSubscription =
            Observable.combineLatest(articlesSource, pageIndexSource,
                totalCountSource,
                (articles, pageIndex, totalCount) => {
                    this.rows = articles;
                    this.page = pageIndex + 1;
                    this.length = totalCount;
                    this.onChangeTable(this.config,
                        { page: this.page, itemsPerPage: this.itemsPerPage });
                })
                .subscribe();
    }

    ngOnDestroy() {
        if (this.articlesSubscription)
            this.articlesSubscription.unsubscribe();
    }

    public onChangeTable(config: any, page: any = {
        page: this.page, itemsPerPage: this.itemsPerPage
    }): void {
        // page changed
        if (this.page != page.page) {
            this.updateData(page.page, page.itemsPerPage);
            return;
        }
        this.changeFilter();
        this.changeSort(this.config);
        this.ref.detectChanges();
    }

    private changeFilter(): void {
        let flag = false; // indicates if filtering changed
        this.columns.forEach((column: any) => {
            if (column.filtering) {
                const filterName = column.name + 'Filter';
                if (this.filter[filterName] != column.filtering.filterString) {
                    this.filter = Object.assign({}, this.filter, {
                        [filterName]: column.filtering.filterString
                    });
                    flag = true;
                }
            }
        });
        if (flag) {
            this.page = 1;
            this.updateData(this.page, this.itemsPerPage);
        }
    }

    private changeSort(config: any): void {
        if (!config.sorting) return;

        let columns = this.config.sorting.columns || [];
        let columnName: string = void 0;
        let sort: string = void 0;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }

        if (!columnName || !sort) return;

        const sortOrder = columnName.toLowerCase() + '_' + sort;

        if (this.sortOrder != sortOrder) {
            this.sortOrder = sortOrder;
            this.updateData(this.page, this.itemsPerPage);
        }
    }

    private updateData(page: number, pageSize: number): void {
        const pageIndex = page - 1;
        this.store.dispatch(
            new aa.LoadAction({
                filter: this.filter,
                sortOrder: this.sortOrder,
                pageIndex: pageIndex,
                pageSize: pageSize
            }));
    }

    public onCellClick(data: any): any {
        this.store.dispatch(go(['/articles', data.row.Id]));
    }
}
