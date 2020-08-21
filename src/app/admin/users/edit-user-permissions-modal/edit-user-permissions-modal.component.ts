import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { EntityDtoOfInt64, LinkedUserDto, UpdateUserPermissionsInput, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzTreeNode, NzTreeSelectComponent } from 'ng-zorro-antd';
import { AppComponentBase } from '../../../../shared/common/component-base/app-component-base';
import { getCheckedTreeNodes, list2Tree } from '../../../shared/utils/list-to-tree.service';

@Component({
  selector: 'app-edit-user-permissions-modal',
  templateUrl: './edit-user-permissions-modal.component.html',
  styleUrls: ['./edit-user-permissions-modal.component.css']
})
export class EditUserPermissionsModalComponent extends AppComponentBase implements OnInit {
  visible = false;
  @Output() modalSave = new EventEmitter();
  @ViewChild('treeSelect') treeSelect: NzTreeSelectComponent;
  saving = false;
  nodes: NzTreeNode[] = [

  ];
  value = [];
  userId: number;
  userName: string;
  constructor(private injector: Injector, private _userService: UserServiceProxy) { super(injector); }
  ngOnInit(): void {
  }


  show(userId: number, userName?: string) {
    this.userId = userId;
    this.userName = userName;

    this._userService.getUserPermissionsForEdit(userId).subscribe(result => {
      this.value = result.grantedPermissionNames;
      this.nodes = list2Tree(result.permissions, 'name', 'parentName', 'displayName');

      this.visible = true;
    });

  }
  hide() {
    this.visible = false;
  }
  submit() {
    const nodes = getCheckedTreeNodes(this.nodes);
    const input = new UpdateUserPermissionsInput();
    input.grantedPermissionNames = nodes.map(n => n.origin.name);
    input.id = this.userId;
    this.saving = true;
    this._userService
      .updateUserPermissions(input)

      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.saving = false;
        this.close();
      }, () => { this.saving = false; this.close(); });
  }
  close() {
    this.modalSave.emit();
    this.visible = false;
  }

  resetPermissions() {
    const input = new EntityDtoOfInt64();

    input.id = this.userId;

    this.saving = true;
    this._userService.resetUserSpecificPermissions(input).subscribe({
      next: () => {
        this.notify.info(this.l('ResetSuccessfully'));
        this._userService.getUserPermissionsForEdit(this.userId).subscribe(result => {
          this.value = result.grantedPermissionNames;
          this.nodes = list2Tree(result.permissions, 'name', 'parentName', 'displayName');

        });
      },
      complete: () => {
        this.close();
        this.saving = false;
      }
    });
  }

}

