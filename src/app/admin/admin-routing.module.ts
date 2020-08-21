import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
// import { LayoutProComponent } from '../shared/layout/pro.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { EditionsComponent } from './editions/editions.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantsComponent } from './tenants/tenants.component';
import { UsersComponent } from './users/users.component';
import { PickupComponent } from './pickup/pickup.component';
import { TopicComponent } from './topic/topic.component';
import { DistributComponent } from './distribut/distribut.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        // component: LayoutProComponent,
        children: [
          { path: 'hostDashboard', component: HostDashboardComponent, },
          { path: 'users', component: UsersComponent, data: { permission: 'Pages.Administration.Users' } },
          { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Administration.Roles' } },
          { path: 'auditLogs', component: AuditLogsComponent, data: { permission: 'Pages.Administration.AuditLogs' } },
          { path: 'organization-units', component: OrganizationUnitsComponent, data: { permission: 'Pages.Administration.OrganizationUnits' } },
          { path: 'maintenance', component: MaintenanceComponent, data: { permission: 'Pages.Administration.Host.Maintenance' } },
          { path: 'hostSettings', component: HostSettingsComponent, data: { permission: 'Pages.Administration.Host.Settings' } },
          { path: 'editions', component: EditionsComponent, data: { permission: 'Pages.Editions' } },
          { path: 'languages', component: LanguagesComponent, data: { permission: 'Pages.Administration.Languages' } },
          { path: 'languages/:name/texts', component: LanguageTextsComponent, data: { permission: 'Pages.Administration.Languages.ChangeTexts' } },
          { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' } },
          { path: "pickup", component: PickupComponent, data: {} },
          { path: "topic", component: TopicComponent, data: {} },
          { path: 'distribut', component: DistributComponent, data: {} }

          // { path: "subscription-management", component: SubscriptionManagementComponent, data: { permission: "Pages.Administration.Tenant.SubscriptionManagement" } },
          // { path: "invoice/:paymentId", component: InvoiceComponent, data: { permission: "Pages.Administration.Tenant.SubscriptionManagement" } },
          // { path: "tenantSettings", component: TenantSettingsComponent, data: { permission: "Pages.Administration.Tenant.Settings" } },
          // { path: "ui-customization", component: UiCustomizationComponent },
          // { path: "", redirectTo: "hostDashboard", pathMatch: "full" }
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
