import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';

import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import { ListResultDtoOfOrganizationUnitDto, MoveOrganizationUnitInput, OrganizationUnitDto, OrganizationUnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import * as _ from 'lodash';

import { AppComponentBase } from '@shared/common/component-base';
import { NzContextMenuService, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { list2Tree } from '../../shared/utils/list-to-tree.service';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { CreateOrEditUnitModalComponent, IOrganizationUnitOnEdit } from './create-or-edit-unit-modal.component';
import { IRoleWithOrganizationUnit } from './role-with-organization-unit';
import { IRolesWithOrganizationUnit } from './roles-with-organization-unit';
import { IUserWithOrganizationUnit } from './user-with-organization-unit';
import { IUsersWithOrganizationUnit } from './users-with-organization-unit';

export interface IOrganizationUnitOnTree extends IBasicOrganizationUnitInfo {
    id: number;
    parent: string | number;
    code: string;
    displayName: string;
    memberCount: number;
    roleCount: number;
    text: string;
    state: any;
}

@Component({
    selector: 'organization-tree',
    templateUrl: './organization-tree.component.html'
})
export class OrganizationTreeComponent extends AppComponentBase implements OnInit {
    @Output() ouSelected = new EventEmitter<IBasicOrganizationUnitInfo>();
    @ViewChild('treeComponent') treeComponent: NzTreeComponent;
    @ViewChild('createOrEditOrganizationUnitModal', { static: true }) createOrEditOrganizationUnitModal: CreateOrEditUnitModalComponent;
    @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;

    treeData: any;
    selectedOu;
    ouContextMenuItems = [];
    canManageOrganizationUnits = false;

    _entityTypeFullName = 'Abp.Organizations.OrganizationUnit';
    totalUnitCount = 0;
    contextMenuData: NzTreeNode;
    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private _treeDataHelperService: TreeDataHelperService,
        private nzContextMenuService: NzContextMenuService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.canManageOrganizationUnits = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');
        this.ouContextMenuItems = this.getContextMenuItems();
        this.getTreeDataFromServer();
    }

    nodeSelect(event) {
        if (event.origin) {
            this.ouSelected.emit({
                id: event.origin.id,
                displayName: event.origin.displayName
            } as IBasicOrganizationUnitInfo);
        }
    }

    contextMenu($event, data, menu) {
        this.contextMenuData = data;
        this.nzContextMenuService.create($event, menu);

    }
    isDroppingBetweenTwoNodes(event: any): boolean {
        return event.originalEvent.target.nodeName === 'LI';
    }

    nodeDrop(event) {
        const input = new MoveOrganizationUnitInput();
        input.id = event.dragNode.data.id;
        let dropNodeDisplayName: string;

        if (this.isDroppingBetweenTwoNodes(event)) {
            // between two item
            input.newParentId = event.dropNode.parent ? event.dropNode.parent.data.id : null;
            dropNodeDisplayName = event.dropNode.parent ? event.dropNode.parent.data.displayName : this.l('Root');
        } else {
            input.newParentId = event.dropNode.data.id;
            dropNodeDisplayName = event.dropNode.data.displayName;
        }

        this.message.confirm(this.l('OrganizationUnitMoveConfirmMessage', event.dragNode.data.displayName, dropNodeDisplayName), this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this._organizationUnitService
                    .moveOrganizationUnit(input)
                    .pipe(
                        catchError(error => {
                            this.revertDragDrop();
                            return throwError(error);
                        })
                    )
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyMoved'));
                        this.reload();
                    });
            } else {
                this.revertDragDrop();
            }
        });
    }

    revertDragDrop() {
        this.reload();
    }

    reload(): void {
        this.getTreeDataFromServer();
    }

    addUnit(parentId?: number): void {
        this.createOrEditOrganizationUnitModal.show({
            parentId
        });
    }

    unitCreated(ou: OrganizationUnitDto): void {
        this.getTreeDataFromServer();
        if (ou.parentId) {
            const unit = this._treeDataHelperService.findNode(this.treeData, { data: { id: ou.parentId } });
            if (!unit) {
                return;
            }

            unit.children.push({
                label: ou.displayName,
                expandedIcon: 'fa fa-folder-open m--font-warning',
                collapsedIcon: 'fa fa-folder m--font-warning',
                selected: true,
                children: [],
                data: ou,
                memberCount: ou.memberCount,
                roleCount: ou.roleCount
            });
        } else {
            this.treeData.push({
                label: ou.displayName,
                expandedIcon: 'fa fa-folder-open m--font-warning',
                collapsedIcon: 'fa fa-folder m--font-warning',
                selected: true,
                children: [],
                data: ou,
                memberCount: ou.memberCount,
                roleCount: ou.roleCount
            });
        }

        this.totalUnitCount += 1;
    }

    deleteUnit(id) {
        this.message.confirm(this.l('OrganizationUnitDeleteWarningMessage', this.contextMenuData.origin.displayName), this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this._organizationUnitService.deleteOrganizationUnit(this.contextMenuData.origin.id).subscribe(() => {
                    // this.deleteUnit(this.selectedOu.data.id);
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    this.selectedOu = null;
                    this.reload();
                });
            }
        });

    }

    unitUpdated(ou: OrganizationUnitDto): void {
        this.getTreeDataFromServer();
        const item = this._treeDataHelperService.findNode(this.treeData, { data: { id: ou.id } });
        if (!item) {
            return;
        }

        item.data.displayName = ou.displayName;
        item.label = ou.displayName;
        item.memberCount = ou.memberCount;
        item.roleCount = ou.roleCount;

    }

    membersAdded(data: IUsersWithOrganizationUnit): void {
        this.incrementMemberCount(data.ouId, data.userIds.length);
    }

    memberRemoved(data: IUserWithOrganizationUnit): void {
        this.incrementMemberCount(data.ouId, -1);
    }

    incrementMemberCount(ouId: number, incrementAmount: number): void {
        const item = this._treeDataHelperService.findNode(this.treeData, { data: { id: ouId } });
        if (item) {
            item.data.memberCount += incrementAmount;
            item.memberCount = item.data.memberCount;
        }

    }

    rolesAdded(data: IRolesWithOrganizationUnit): void {
        this.incrementRoleCount(data.ouId, data.roleIds.length);
    }

    roleRemoved(data: IRoleWithOrganizationUnit): void {
        this.incrementRoleCount(data.ouId, -1);
    }

    incrementRoleCount(ouId: number, incrementAmount: number): void {
        const item = this._treeDataHelperService.findNode(this.treeData, { data: { id: ouId } });
        if (item) {
            item.data.roleCount += incrementAmount;
            item.roleCount = item.data.roleCount;
        }

    }

    private getTreeDataFromServer(): void {
        const self = this;
        this._organizationUnitService.getOrganizationUnits().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
            this.totalUnitCount = result.items.length;
            this.treeData = list2Tree(result.items, 'id', 'parentId', 'displayName');
        });
    }

    private isEntityHistoryEnabled(): boolean {
        const customSettings = (abp as any).custom;
        return (
            customSettings.EntityHistory &&
            customSettings.EntityHistory.isEnabled &&
            _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1
        );
    }

    private getContextMenuItems(): any[] {
        const canManageOrganizationTree = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');

        const items = [
            {
                label: this.l('Edit'),
                disabled: !canManageOrganizationTree,
                command: event => {
                    this.createOrEditOrganizationUnitModal.show({
                        id: this.selectedOu.data.id,
                        displayName: this.selectedOu.data.displayName
                    });
                }
            },
            {
                label: this.l('AddSubUnit'),
                disabled: !canManageOrganizationTree,
                command: () => {
                    this.addUnit(this.selectedOu.data.id);
                }
            },
            {
                label: this.l('Delete'),
                disabled: !canManageOrganizationTree,
                command: () => {
                    this.message.confirm(this.l('OrganizationUnitDeleteWarningMessage', this.selectedOu.data.displayName), this.l('AreYouSure'), isConfirmed => {
                        if (isConfirmed) {
                            this._organizationUnitService.deleteOrganizationUnit(this.selectedOu).subscribe(() => {
                                this.deleteUnit(this.selectedOu.data.id);
                                this.notify.success(this.l('SuccessfullyDeleted'));
                                this.selectedOu = null;
                                this.reload();
                            });
                        }
                    });
                }
            }
        ];

        if (this.isEntityHistoryEnabled()) {
            items.push({
                label: this.l('History'),
                disabled: false,
                command: event => {
                    this.entityTypeHistoryModal.show({
                        entityId: this.selectedOu.data.id.toString(),
                        entityTypeFullName: this._entityTypeFullName,
                        entityTypeDescription: this.selectedOu.data.displayName
                    });
                }
            });
        }

        return items;
    }
    edit(e) {

        this.createOrEditOrganizationUnitModal.show({ id: this.contextMenuData.origin.id, displayName: this.contextMenuData.origin.displayName });
        // const nodes = this.treeComponent.
    }
    addChild() {
        this.createOrEditOrganizationUnitModal.show({ parentId: this.contextMenuData.origin.id, displayName: this.contextMenuData.origin.displayName });
    }
}
