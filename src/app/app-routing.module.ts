import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from '../root.component';
import { CallbackComponent } from './main/callback/callback.component';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { LayoutProComponent } from './shared/layout/pro';

const routes: Routes = [
  {
    path: 'app',
    component: RootComponent,
    canActivate: [AppRouteGuard],
    canActivateChild: [AppRouteGuard],
    children: [
      {
        path: '',
        children: [
          // {path:'notifications'}
          { path: '', redirectTo: 'app/main/dashboard', pathMatch: 'full' },
        ],
      },
      {
        path: 'main',
        component: LayoutProComponent,
        loadChildren: () =>
          import('app/main/main.module').then((m) => {
            return m.MainModule;
          }),
        data: { preload: true },
      },
      {
        path: 'admin',
        component: LayoutProComponent,
        loadChildren: () => import('app/admin/admin.module').then((m) => m.AdminModule),
        data: { preload: true },
        canLoad: [AppRouteGuard],
      },
      {
        path: 'design',
        component: LayoutProComponent,
        loadChildren: () => import('app/design/design.module').then((m) => m.DesignModule),
        data: { preload: true },
        canLoad: [AppRouteGuard],
      },
      {
        path: 'exception',
        loadChildren: () => import('app/exception/exception.module').then((m) => m.ExceptionModule),
      },
      // 单页不包裹Layout
      { path: 'callback/:type', component: CallbackComponent },
      { path: '**', redirectTo: 'exception/404' },
      {
        path: '**',
        redirectTo: 'notifications',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // useHash: environment.useHash,
      // // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // // Pls refer to https://ng-alain.com/components/reuse-tab
      // scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
