import * as ngCommon from '@angular/common';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from '@app/admin/admin-routing.module';
import { SharedModule } from '@app/shared';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { LayoutModule } from '@app/shared/layout/layout.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { DragulaModule } from 'ng2-dragula';
import { ConfigModalComponent } from './components/config-modal/config-modal.component';
import { DragContainerComponent } from './components/drag-container/drag-container.component';
import { DynamicEditFormComponent } from './components/dynamic-edit-form/dynamic-edit-form.component';
import { NativeGridComponent } from './components/native/native-grid/native-grid.component';
import { NativeInputComponent } from './components/native/native-input/native-input.component';
import { StableTableComponent } from './components/stable-table/stable-table.component';
import { DynamicDirective } from './directives/dynamic-directive';
import { DesignPageComponent } from './pages/design-page/design-page.component';
import { DynamicPageComponent } from './pages/dynamic-page/dynamic-page.component';
import { ActionLogService } from './services/action-log.service';
const COMPONENTS = [
  DesignPageComponent, DragContainerComponent,
  NativeInputComponent, DynamicDirective, ConfigModalComponent,
  NativeGridComponent,
  DynamicPageComponent,
  StableTableComponent,
  DynamicEditFormComponent
];
@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    ReactiveFormsModule,
    ngCommon.CommonModule,
    AdminRoutingModule,
    AppCommonModule,
    SharedModule,
    UtilsModule,
    ServiceProxyModule,
    DragulaModule.forRoot(),
    RouterModule.forChild([
      {
        path: '', redirectTo: '/app/design/design', pathMatch: 'full'
      },
      { path: 'design', component: DesignPageComponent },
      { path: 'dynamic/:id', component: DynamicPageComponent }
    ])

  ],
  providers: [ActionLogService],
  entryComponents: [...COMPONENTS]

})
export class DesignModule {

}
