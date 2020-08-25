import * as ngCommon from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared';
import { AppCommonModule } from './shared/common/app-common.module';
import { STWidgetModule } from './shared/st-widget/st-widget.module';

const COMPONENTS = [
  // // single pages
  // CallbackComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  imports: [
    ngCommon.CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    STWidgetModule,
    SharedModule,
    AppRoutingModule,
    UtilsModule,
    AppCommonModule.forRoot(),
  ],
  exports: [AppRoutingModule],
  providers: [],
  entryComponents: COMPONENTS_NOROUNT,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
