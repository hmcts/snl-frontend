import { SortDirection } from '@angular/material';

export interface TableSettings {
    sortByProperty: string;
    sortDirection: SortDirection;
    pageIndex: number;
    pageSize: number;
}
