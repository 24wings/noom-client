import { Component, Injector, ViewChild } from '@angular/core';
import { STComponent } from '@delon/abc/st/table';
import { AppComponentBase } from '@shared/common/component-base';
import { AuditLogServiceProxy, EntityChangeListDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { EntityChangeDetailModalComponent } from './entity-change-detail-modal.component';

export interface IEntityTypeHistoryModalOptions {
    entityTypeFullName: string;
    entityTypeDescription: string;
    entityId: string;
}

@Component({
    selector: 'entityTypeHistoryModal',
    templateUrl: './entity-type-history-modal.component.html'
})
export class EntityTypeHistoryModalComponent extends AppComponentBase {
    @ViewChild('entityChangeDetailModal', { static: true }) entityChangeDetailModal: EntityChangeDetailModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: STComponent;
    // @ViewChild('paginator', { static: true }) paginator: Paginator;

    options: IEntityTypeHistoryModalOptions;
    isShown = false;
    isInitialized = false;
    filterText = '';
    tenantId?: number;
    entityHistoryEnabled: false;

    constructor(injector: Injector, private _auditLogService: AuditLogServiceProxy) {
        super(injector);
    }

    show(options: IEntityTypeHistoryModalOptions): void {
        this.options = options;
        // this.modal.show();
    }

    refreshTable(): void {
        // this.paginator.changePage(this.paginator.getPage());
    }

    close(): void {
        // this.modal.hide();
    }

    shown(): void {
        this.isShown = true;
        this.getRecordsIfNeeds(null);
    }

    getRecordsIfNeeds(event?): void {
        if (!this.isShown) {
            return;
        }

        this.getRecords(event);
        this.isInitialized = true;
    }

    getRecords(event?): void {
        // this.primengTableHelper.showLoadingIndicator();

        // this._auditLogService
        //     .getEntityTypeChanges(
        //         this.options.entityTypeFullName,
        //         this.options.entityId,
        //         this.primengTableHelper.getSorting(this.dataTable),
        //         this.primengTableHelper.getMaxResultCount(this.paginator, event),
        //         this.primengTableHelper.getSkipCount(this.paginator, event)
        //     )
        //     .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
        //     .subscribe(result => {
        //         this.primengTableHelper.totalRecordsCount = result.totalCount;
        //         this.primengTableHelper.records = result.items;
        //         this.primengTableHelper.hideLoadingIndicator();
        //     });
    }

    showEntityChangeDetails(record: EntityChangeListDto): void {
        this.entityChangeDetailModal.show(record);
    }
}
