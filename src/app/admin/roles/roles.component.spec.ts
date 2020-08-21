import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "@app/app-routing.module";
import { AppModule } from "@app/app.module";
import { ListResultDtoOfRoleListDto, RoleServiceProxy } from "@shared/service-proxies/service-proxies";
import { ServiceProxyModule } from "@shared/service-proxies/service-proxy.module";
import { UtilsModule } from "@shared/utils/utils.module";
import { ModalModule } from "ngx-bootstrap";
import { RootModule } from "root.module";
import { Observable, Observer } from "rxjs";
import { PermissionTreeModalComponent } from "../shared/permission-tree-modal.component";
import { RolesComponent } from "./roles.component";

describe("RolesComponent", () => {
  let fixture: ComponentFixture<RolesComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule, UtilsModule, AppRoutingModule, RouterModule.forRoot([]), RootModule, ServiceProxyModule, ModalModule],
      declarations: [RolesComponent, PermissionTreeModalComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(RolesComponent);

    const _roleService = fixture.debugElement.injector.get(RoleServiceProxy);

    spyOn(_roleService, "getRoles").and.returnValue(
      new Observable((observer: Observer<ListResultDtoOfRoleListDto>) => {
        const list = ListResultDtoOfRoleListDto.fromJS(
          JSON.parse(
            `{"items":[{"name":"Admin","displayName":"Admin","isStatic":true,"isDefault":true,"creationTime":"2019-08-22T09:39:10.227975","id":1},{"name":"test","displayName":"test","isStatic":false,"isDefault":false,"creationTime":"2019-08-22T17:19:55.3166397","id":8}]}`
          )
        );
        observer.next(list);
      })
    );
  });

  it(`should primengTableHelper has two records`, () => {
    const component = fixture.debugElement.componentInstance as RolesComponent;
    component.getRoles();

    const helper = component.primengTableHelper;
    expect(helper.records).not.toBe(undefined);
    expect(helper.records.length).toBe(2);
  });
});
