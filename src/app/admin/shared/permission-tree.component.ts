import { Component, Injector, ViewChild } from '@angular/core';
import { PermissionTreeEditModel } from '@app/admin/shared/permission-tree-edit.model';
import { AppComponentBase } from '@shared/common/component-base';
import { FlatPermissionDto } from '@shared/service-proxies/service-proxies';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import * as _ from 'lodash';
import { NzTreeComponent } from 'ng-zorro-antd';
import { getCheckedTreeNodes, list2Tree } from '../../shared/utils/list-to-tree.service';

@Component({
  selector: 'permission-tree',
  template: `
    <div class="form-group">
      <input nz-input type="text" (input)="filterPermissions($event)" [(ngModel)]="filter" class="form-control" placeholder="{{ 'SearchWithThreeDot' | localize }}" />
    </div>

      <nz-tree
      [nzData]="treeData"
      nzCheckable
      nzMultiple
      [nzExpandAll]="true"
      [nzCheckedKeys]="selectedPermissions"
    
      (nzCheckBoxChange)="onNodeUnselect($event)"
      #tree
    >
    </nz-tree>
  `
})
export class PermissionTreeComponent extends AppComponentBase {
  treeData: any;
  selectedPermissions: any[] = [];
  filter = '';
  @ViewChild('tree') tree: NzTreeComponent;

  constructor(private _treeDataHelperService: TreeDataHelperService, injector: Injector) {
    super(injector);
  }

  set editData(val: PermissionTreeEditModel) {
    this.setTreeData(val);

  }

  setTreeData(editData: PermissionTreeEditModel) {
    const noChildren = editData.permissions.filter(p => (!editData.permissions.some(p2 => p2.parentName === p.name))).filter(p => editData.grantedPermissionNames.indexOf(p.name) !== -1);
    this.selectedPermissions = noChildren.map(n => n.name);

    this.treeData = list2Tree(editData.permissions, 'name', 'parentName', 'displayName');

  }



  getGrantedPermissionNames(): string[] {
    const nodes = this.tree.getTreeNodes();
    return getCheckedTreeNodes(nodes).map(item => item.origin.name);
  }



  onNodeUnselect(event) {
    // this.selectedPermissions = getCheckedTreeNodes(nodes).map(item => item.origin.name);

  }

  filterPermissions(event): void {
    const nodes = this.tree.getTreeNodes();
    this.filterPermission(nodes, this.filter);
  }

  filterPermission(nodes, filterText): any {
    _.forEach(nodes, node => {
      if (node.data.displayName.toLowerCase().indexOf(filterText.toLowerCase()) >= 0) {
        node.styleClass = this.showParentNodes(node);
      } else {
        node.styleClass = 'hidden-tree-node';
      }

      if (node.children) {
        this.filterPermission(node.children, filterText);
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
}
