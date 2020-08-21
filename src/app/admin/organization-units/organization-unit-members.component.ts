import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AddMemberModalComponent } from '@app/admin/organization-units/add-member-modal.component';
import { STColumn, STComponent } from '@delon/abc/st/table';
import { AppComponentBase, PagedListingComponentBase, PagedRequestDto } from '@shared/common/component-base';
import { OrganizationUnitServiceProxy, OrganizationUnitUserListDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { IUserWithOrganizationUnit } from './user-with-organization-unit';
import { IUsersWithOrganizationUnit } from './users-with-organization-unit';

@Component({
    selector: 'organization-unit-members',
    templateUrl: './organization-unit-members.component.html'
})
export class OrganizationUnitMembersComponent extends PagedListingComponentBase<OrganizationUnitUserListDto> implements OnInit {
    loading = false;
    columns: STColumn[] = [
        { type: 'checkbox', index: 'checked' },
        { title: this.l('UserName'), index: 'userName' },
        {
            buttons: [
                { text: this.l('Remove'), click: (e: any) => this.removeMember(e) }
            ]
        }
    ];
    constructor(injector: Injector, private _organizationUnitService: OrganizationUnitServiceProxy) {
        super(injector);
    }

    get organizationUnit(): IBasicOrganizationUnitInfo {
        return this._organizationUnit;
    }

    set organizationUnit(ou: IBasicOrganizationUnitInfo) {
        if (this._organizationUnit === ou) {
            return;
        }

        this._organizationUnit = ou;
        this.addMemberModal.organizationUnitId = ou.id;
        if (ou) {
            this.refreshMembers();
        }
    }
    @Output() memberRemoved = new EventEmitter<IUserWithOrganizationUnit>();
    @Output() membersAdded = new EventEmitter<IUsersWithOrganizationUnit>();

    @ViewChild('addMemberModal', { static: true }) addMemberModal: AddMemberModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: STComponent;

    data = [];

    private _organizationUnit: IBasicOrganizationUnitInfo = null;
    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.getOrganizationUnitUsers();
    }

    ngOnInit(): void {

    }

    getOrganizationUnitUsers(event?) {
        if (!this._organizationUnit) {
            return;
        }

        // if (this.primengTableHelper.shouldResetPaging(event)) {
        //     this.paginator.changePage(0);

        //     return;
        // }

        // this.primengTableHelper.showLoadingIndicator();
        this.loading = true;
        this._organizationUnitService
            .getOrganizationUnitUsers(
                this._organizationUnit.id,
                undefined,
                // this.primengTableHelper.getSorting(this.dataTable),
                this.pageSize,
                (this.pageNumber - 1) * this.pageSize
            )
            // .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
                this.totalItems = result.totalCount;
                this.dataList = result.items;
                this.loading = false;
                // this.primengTableHelper.hideLoadingIndicator();
            }, () => this.loading = false);
    }

    reloadPage(): void {

        this.getOrganizationUnitUsers();
        // this.paginator.changePage(this.paginator.getPage());
    }

    refreshMembers(): void {
        this.reloadPage();
    }

    openAddMemberModal(): void {
        this.addMemberModal.shown();
    }

    removeMember(user: OrganizationUnitUserListDto): void {
        this.message.confirm(this.l('RemoveUserFromOuWarningMessage', user.userName, this.organizationUnit.displayName), this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this._organizationUnitService.removeUserFromOrganizationUnit(user.id, this.organizationUnit.id).subscribe(() => {
                    this.notify.success(this.l('SuccessfullyRemoved'));
                    this.memberRemoved.emit({
                        userId: user.id,
                        ouId: this.organizationUnit.id
                    });

                    this.refreshMembers();
                });
            }
        });
    }

    addMembers(data: any): void {
        this.membersAdded.emit({
            userIds: data.userIds,
            ouId: data.ouId
        });

        this.refreshMembers();
    }
    public getSelectedItems() {
        return this.dataList.filter((item: any) => item.checked).length;
    }
    public removeMemberBat() {

        this.message.confirm(this.l('RemoveUserFromOuWarningMessage', '', this.organizationUnit.displayName), this.l('AreYouSure'), async isConfirmed => {
            if (isConfirmed) {
                for (const user of this.dataList.filter((item: any) => item.checked)) {
                    await this._organizationUnitService.removeUserFromOrganizationUnit(user.id, this.organizationUnit.id).toPromise();

                }
                this.notify.success(this.l('SuccessfullyRemoved'));
                this.refreshMembers();
            }
        });
    }
}
