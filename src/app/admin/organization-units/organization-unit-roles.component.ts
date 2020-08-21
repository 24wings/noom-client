import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AddRoleModalComponent } from '@app/admin/organization-units/add-role-modal.component';
import { STColumn, STComponent } from '@delon/abc/st/table';
import { AppComponentBase, PagedListingComponentBase, PagedRequestDto } from '@shared/common/component-base';
import { OrganizationUnitRoleListDto, OrganizationUnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { IRoleWithOrganizationUnit } from './role-with-organization-unit';
import { IRolesWithOrganizationUnit } from './roles-with-organization-unit';

@Component({
    selector: 'organization-unit-roles',
    templateUrl: './organization-unit-roles.component.html'
})
export class OrganizationUnitRolesComponent extends PagedListingComponentBase<OrganizationUnitRoleListDto> implements OnInit {
    // @ViewChild('paginator', { static: true }) paginator: Paginator;
    loading = false;
    columns: STColumn[] = [
        { type: 'checkbox', index: 'checked' },
        { title: this.l('Role'), index: 'displayName' },
        { buttons: [] }
    ];


    constructor(injector: Injector, private _changeDetector: ChangeDetectorRef, private _organizationUnitService: OrganizationUnitServiceProxy) {
        super(injector);
        const buttonsColumn = this.columns[this.columns.length - 1];
        if (this.permission.isGranted('Pages.Administration.OrganizationUnits.ManageRoles')) {
            buttonsColumn.buttons.push({
                text: this.l('Remove'),
                click: (e: any) => this.removeRole(e)
            });
        }
    }

    get organizationUnit(): IBasicOrganizationUnitInfo {
        return this._organizationUnit;
    }

    set organizationUnit(ou: IBasicOrganizationUnitInfo) {
        if (this._organizationUnit === ou) {
            return;
        }

        this._organizationUnit = ou;
        this.addRoleModal.organizationUnitId = ou.id;
        if (ou) {
            this.refreshRoles();
        }
    }
    @Output() roleRemoved = new EventEmitter<IRoleWithOrganizationUnit>();
    @Output() rolesAdded = new EventEmitter<IRolesWithOrganizationUnit>();


    @ViewChild('addRoleModal', { static: true }) addRoleModal: AddRoleModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: STComponent;

    private _organizationUnit: IBasicOrganizationUnitInfo = null;
    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.getOrganizationUnitRoles();
    }

    ngOnInit(): void {

    }

    getOrganizationUnitRoles(event?) {
        if (!this._organizationUnit) {
            return;
        }

        // if (this.primengTableHelper.shouldResetPaging(event)) {
        //     this.paginator.changePage(0);

        //     return;
        // }

        // this.primengTableHelper.showLoadingIndicator()
        this.loading = true;
        this._organizationUnitService
            .getOrganizationUnitRoles(
                this._organizationUnit.id,
                undefined,
                this.pageSize,
                this.pageSize * (this.pageNumber - 1)
            )
            // .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
                this.totalItems = result.totalCount;
                this.dataList = result.items;
                this.loading = false;
            }, () => this.loading = false);
    }

    reloadPage(): void {
        this.getOrganizationUnitRoles();
        // this.paginator.changePage(this.paginator.getPage());
    }

    refreshRoles(): void {
        this.reloadPage();
    }

    openAddRoleModal(): void {
        this.addRoleModal.shown();
    }

    removeRole(role: OrganizationUnitRoleListDto): void {
        this.message.confirm(this.l('RemoveRoleFromOuWarningMessage', role.displayName, this.organizationUnit.displayName), this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this._organizationUnitService.removeRoleFromOrganizationUnit(role.id, this.organizationUnit.id).subscribe(() => {
                    this.notify.success(this.l('SuccessfullyRemoved'));
                    this.roleRemoved.emit({
                        roleId: role.id,
                        ouId: this.organizationUnit.id
                    });

                    this.refreshRoles();
                });
            }
        });
    }

    addRoles(data: any): void {
        this.rolesAdded.emit({
            roleIds: data.roleIds,
            ouId: data.ouId
        });

        this.refreshRoles();
    }
    getSelectedItems() {
        return this.dataList.filter((item: any) => item.checked).length;
    }

    removeRoleBat() {
        const rolesSelected = this.dataList.filter((item: any) => item.checked);
        this.message.confirm(this.l('RemoveRoleFromOuWarningMessage', '', ''), this.l('AreYouSure'), async isConfirmed => {
            if (isConfirmed) {
                for (const role of rolesSelected) {
                    await this._organizationUnitService.removeRoleFromOrganizationUnit(role.id, this.organizationUnit.id).toPromise();
                    this.notify.success(this.l('SuccessfullyRemoved'));
                    this.refreshRoles();
                }

            }
        });
    }
}
