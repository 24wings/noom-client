import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { Injector, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permission'
})
export class PermissionPipe implements PipeTransform {
  permission: PermissionCheckerService;

  constructor(injector: Injector) {
    this.permission = injector.get(PermissionCheckerService);
  }

  transform(permission: string): boolean {
    return this.permission.isGranted(permission);
  }
}
