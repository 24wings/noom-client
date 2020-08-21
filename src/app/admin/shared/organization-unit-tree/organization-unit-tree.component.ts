import { Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/component-base';
import { OrganizationUnitDto } from '@shared/service-proxies/service-proxies';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import * as _ from 'lodash';
import { NzTreeNode } from 'ng-zorro-antd';
import { AbstractTree } from '../../../shared/utils/abstract-tree';
import { list2Tree, listToNzTreeNode } from '../../../shared/utils/list-to-tree.service';

export interface IOrganizationUnitsTreeComponentData {
    allOrganizationUnits: OrganizationUnitDto[];
    selectedOrganizationUnits: string[];
}

@Component({
    selector: 'organization-unit-tree',
    template: `
    <div class="form-group">
      <input
      nz-input
        id="OrganizationUnitsTreeFilter"
        type="text"
        (keyup)="filterOrganizationUnits($event)"
        (change)="filterOrganizationUnits(filter)"
        [(ngModel)]="filter"
        class="form-control"
        placeholder="{{ 'SearchWithThreeDot' | localize }}"
      />
    </div>
    <!-- <p-tree
      [value]="treeData"
      selectionMode="checkbox"
      [(selection)]="selectedOus"
      (onNodeSelect)="nodeSelect($event)"
      (onNodeUnselect)="onNodeUnselect($event)"
      [propagateSelectionUp]="false"
      [propagateSelectionDown]="cascadeSelectEnabled"
    ></p-tree> -->

      <nz-tree-select
      [nzNodes]="treeData"
      nzShowSearch
      nzPlaceHolder="Please select"
      (ngModelChange)="onChange($event)"
      [(ngModel)]="selectedOus"
    >
    </nz-tree-select>
  `
})
export class OrganizationUnitsTreeComponent extends AppComponentBase {
    @Input() cascadeSelectEnabled = true;
    treeData: any;
    selectedOus: NzTreeNode[] = [];
    filter = '';
    private _allOrganizationUnits: OrganizationUnitDto[];
    private _selectedOrganizationUnits: string[];

    constructor(private _treeDataHelperService: TreeDataHelperService, injector: Injector) {
        super(injector);
    }
    onChange(e) {
        console.log(e);
    }

    set data(data: IOrganizationUnitsTreeComponentData) {
        this.setTreeData(data.allOrganizationUnits);
        this.setSelectedNodes(data.selectedOrganizationUnits);

        this._allOrganizationUnits = data.allOrganizationUnits;
        this._selectedOrganizationUnits = data.selectedOrganizationUnits;
    }

    setTreeData(organizationUnits: OrganizationUnitDto[]) {
        this.treeData = list2Tree(organizationUnits, 'id', 'parentId', 'displayName');
    }

    setSelectedNodes(selectedOrganizationUnits: string[]) {
        this.selectedOus = [];
        _.forEach(selectedOrganizationUnits, ou => {
            const item = this._treeDataHelperService.findNode(this.treeData, { data: { code: ou } });
            if (item) {
                this.selectedOus.push(item);
            }
        });
    }

    getSelectedOrganizations(): number[] {
        if (!this.selectedOus) {
            return [];
        }

        const organizationIds = [];

        _.forEach(this.selectedOus, ou => {
            organizationIds.push(ou.origin.id);
        });

        return organizationIds;
    }

    filterOrganizationUnit(nodes, filterText): any {
        _.forEach(nodes, node => {
            if (node.data.displayName.toLowerCase().indexOf(filterText.toLowerCase()) >= 0) {
                node.styleClass = this.showParentNodes(node);
            } else {
                node.styleClass = 'hidden-tree-node';
            }

            if (node.children) {
                this.filterOrganizationUnit(node.children, filterText);
            }
        });
    }

    showParentNodes(node): void {
        if (!node.parent) {
            return;
        }

        node.parent.styleClass = '';
        this.showParentNodes(node.parent);
    }

    filterOrganizationUnits(event): void {
        this.filterOrganizationUnit(this.treeData, this.filter);
    }

    nodeSelect(event) {
        if (!this.cascadeSelectEnabled) {
            return;
        }

        let parentNode = this._treeDataHelperService.findParent(this.treeData, { data: { id: event.node.data.id } });

        while (parentNode != null) {
            this.selectedOus.push(parentNode);
            parentNode = this._treeDataHelperService.findParent(this.treeData, { data: { id: parentNode.data.id } });
        }
    }

    onNodeUnselect(event) {
        const childrenNodes = this._treeDataHelperService.findChildren(this.treeData, { data: { name: event.node.data.name } });
        childrenNodes.push(event.node.data.name);
        _.remove(this.selectedOus, x => childrenNodes.indexOf(x.origin.name) !== -1);
    }
}
