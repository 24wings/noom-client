import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { FindOrganizationUnitUsersInput, NameValueDto, OrganizationUnitServiceProxy, UsersToOrganizationUnitInput } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

import { STColumn, STComponent } from '@delon/abc/st/table';
import { AppComponentBase, PagedListingComponentBase, PagedRequestDto } from '@shared/common/component-base';
import { finalize } from 'rxjs/operators';
import { IUsersWithOrganizationUnit } from './users-with-organization-unit';

@Component({
    selector: 'addMemberModal',
    templateUrl: './add-member-modal.component.html'
})
export class AddMemberModalComponent extends PagedListingComponentBase<NameValueDto> {
    loading = false;
    organizationUnitId: number;

    @Output() membersAdded: EventEmitter<IUsersWithOrganizationUnit> = new EventEmitter<IUsersWithOrganizationUnit>();

    @ViewChild('dataTable', { static: true }) dataTable: STComponent;

    isShown = false;
    filterText = '';
    tenantId?: number;
    saving = false;
    columns: STColumn[] = [
        { type: 'checkbox', index: 'checked' },
        { title: this.l('Name'), index: 'name' },

    ];

    selectedMembers: NameValueDto[];

    constructor(injector: Injector, private _organizationUnitService: OrganizationUnitServiceProxy) {
        super(injector);
    }
    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        if (this.organizationUnitId) {
            this.getRecords();
        }

    }


    refreshTable(): void {
        this.pageNumber = 1;
        this.getRecords();
        // this.paginator.changePage(this.paginator.getPage());
    }

    close(): void {
        // this.modal.hide();
        this.isShown = false;
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
    }

    getRecords(event?): void {
        // if (this.primengTableHelper.shouldResetPaging(event)) {
        //     this.paginator.changePage(0);

        //     return;
        // }

        // this.primengTableHelper.showLoadingIndicator();

        const input = new FindOrganizationUnitUsersInput();
        input.organizationUnitId = this.organizationUnitId;
        input.filter = this.filterText;
        input.skipCount = (this.pageNumber - 1) * this.pageSize;
        input.maxResultCount = this.pageSize;
        this.loading = true;
        this._organizationUnitService
            .findUsers(input)

            .subscribe(result => {
                this.totalItems = result.totalCount;
                this.dataList = result.items;
                this.loading = false;
            }, () => this.loading = false);
    }

    addUsersToOrganizationUnit(): void {
        const input = new UsersToOrganizationUnitInput();
        input.organizationUnitId = this.organizationUnitId;
        input.userIds = _.map(this.dataList.filter((d: any) => d.checked).map(selectedMember => Number(selectedMember.value)));
        this.saving = true;

        this._organizationUnitService.addUsersToOrganizationUnit(input).subscribe(() => {
            // this.notify.success(this.l('SuccessfullyAdded'));
            this.membersAdded.emit({
                userIds: input.userIds,
                ouId: input.organizationUnitId
            });
            this.saving = false;
            this.close();
            this.selectedMembers = [];
        });
    }
}
