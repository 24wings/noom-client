import * as ngCommon from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared';
import { STWidgetModule } from './shared/st-widget/st-widget.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AppCommonModule } from './shared/common/app-common.module';

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
})
export class AppModule {}
