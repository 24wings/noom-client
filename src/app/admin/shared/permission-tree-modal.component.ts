import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/component-base';
import { FlatPermissionDto, PermissionServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzTreeNode } from 'ng-zorro-antd';
import { getCheckedTreeNodes, getSelectedTreeNodes, list2Tree, listToNzTreeNode } from '../../shared/utils/list-to-tree.service';
import { PermissionTreeComponent } from './permission-tree.component';

@Component({
  selector: 'permission-tree-modal',
  templateUrl: './permission-tree-modal.component.html'
})
export class PermissionTreeModalComponent extends AppComponentBase implements OnInit {
  @Output() closed = new EventEmitter<string[]>();


  visible = false;
  selectedPermissions: any[] = [];
  NumberOfFilteredPermission = 0;
  treeNodes: NzTreeNode[] = [];

  constructor(injector: Injector, private _permissionService: PermissionServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadAllPermissionsToFilterTree();
  }

  openPermissionTreeModal(): void {
    // this.permissionTreeModal.show();
  }

  closePermissionTreeModal(): void {
    this.NumberOfFilteredPermission = this.getSelectedPermissions().length;
    abp.notify.success(this.l('XCountPermissionFiltered', this.NumberOfFilteredPermission));
    // this.permissionTreeModal.hide();

    this.closed.emit(this.getSelectedPermissions());
  }

  getSelectedPermissions(): string[] {
    // if (!this.permissionTree) {
    // return [];
    // }
    return getSelectedTreeNodes(this.treeNodes).map(item => item.origin.name);


  }
  change() {
    this.closed.emit();
  }

  private loadAllPermissionsToFilterTree() {
    const treeModel: FlatPermissionDto[] = [];
    this._permissionService.getAllPermissions().subscribe(result => {
      if (result.items) {
        result.items.forEach(item => {
          treeModel.push(
            new FlatPermissionDto({
              name: item.name,
              description: item.description,
              displayName: item.displayName,
              isGrantedByDefault: item.isGrantedByDefault,
              parentName: item.parentName
            })
          );
        });
      }
      this.treeNodes = list2Tree(treeModel, 'name', 'parentName', 'displayName') as any;


    });
  }
}
