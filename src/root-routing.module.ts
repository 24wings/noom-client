import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/account/login', pathMatch: 'full' },
  {
    path: 'account',
    loadChildren: () => import('account/account.module').then((m) => m.AccountModule),
    data: { preload: true },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class RootRoutingModule {}
