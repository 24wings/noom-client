import * as ngCommon from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { LayoutModule } from '@app/shared/layout/layout.module';
import { CommonModule } from '../../shared/common/common.module';
import { ServiceProxyModule } from '../../shared/service-proxies/service-proxy.module';
import { UtilsModule } from '../../shared/utils/utils.module';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AuditLogDetailModalComponent } from './audit-logs/audit-log-detail-modal.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { CreateOrEditDistributComponent } from './distribut/create-or-edit-distribut/create-or-edit-distribut.component';
import { DistributComponent } from './distribut/distribut.component';
import { CreateEditionModalComponent } from './editions/create-edition-modal.component';
import { EditEditionModalComponent } from './editions/edit-edition-modal.component';
import { EditionsComponent } from './editions/editions.component';
import { MoveTenantsToAnotherEditionModalComponent } from './editions/move-tenants-to-another-edition-modal.component';
import { CreateOrEditLanguageModalComponent } from './languages/create-or-edit-language-modal.component';
import { EditTextModalComponent } from './languages/edit-text-modal.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { AddMemberModalComponent } from './organization-units/add-member-modal.component';
import { AddRoleModalComponent } from './organization-units/add-role-modal.component';
import { CreateOrEditUnitModalComponent } from './organization-units/create-or-edit-unit-modal.component';
import { OrganizationTreeComponent } from './organization-units/organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-units/organization-unit-members.component';
import { OrganizationUnitRolesComponent } from './organization-units/organization-unit-roles.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { CreateOrEditPickupComponent } from './pickup/create-or-edit-pickup/create-or-edit-pickup.component';
import { PickupComponent } from './pickup/pickup.component';
import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { EditionComboComponent } from './shared/edition-combo.component';
import { FeatureTreeComponent } from './shared/feature-tree.component';
import { OrganizationUnitsTreeComponent } from './shared/organization-unit-tree/organization-unit-tree.component';
import { PermissionComboComponent } from './shared/permission-combo.component';
import { PermissionTreeModalComponent } from './shared/permission-tree-modal.component';
import { PermissionTreeComponent } from './shared/permission-tree.component';
import { RoleComboComponent } from './shared/role-combo.component';
import { CreateTenantModalComponent } from './tenants/create-tenant-modal.component';
import { EditTenantModalComponent } from './tenants/edit-tenant-modal.component';
import { TenantFeaturesModalComponent } from './tenants/tenant-features-modal.component';
import { TenantsComponent } from './tenants/tenants.component';
import { CreateOrEditTopicComponent } from './topic/create-or-edit-topic/create-or-edit-topic.component';
import { TopicComponent } from './topic/topic.component';
import { CreateOrEditUserModalComponent } from './users/create-or-edit-user-modal/create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './users/edit-user-permissions-modal/edit-user-permissions-modal.component';
import { ImpersonationService } from './users/impersonation.service';
import { UsersComponent } from './users/users.component';

@NgModule({
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
    ServiceProxyModule
  ],
  declarations: [
    HostDashboardComponent,
    AuditLogsComponent,
    AuditLogDetailModalComponent,
    UsersComponent,
    CreateOrEditUserModalComponent,
    OrganizationUnitsTreeComponent,
    EditUserPermissionsModalComponent,
    OrganizationUnitsComponent,
    OrganizationUnitRolesComponent,
    OrganizationUnitMembersComponent,
    OrganizationTreeComponent,
    CreateOrEditUnitModalComponent,
    AddRoleModalComponent,
    AddMemberModalComponent,
    RoleComboComponent,
    PermissionTreeComponent,
    PermissionComboComponent,
    PermissionTreeModalComponent,
    RolesComponent,
    CreateOrEditRoleModalComponent,
    LanguagesComponent,
    LanguageTextsComponent,
    EditTextModalComponent,
    CreateOrEditLanguageModalComponent,
    MaintenanceComponent,
    HostSettingsComponent,
    TenantsComponent,
    TenantFeaturesModalComponent,
    EditTenantModalComponent,
    CreateTenantModalComponent,
    FeatureTreeComponent,
    EditionComboComponent,
    EditionsComponent,
    EditEditionModalComponent,
    MoveTenantsToAnotherEditionModalComponent,
    CreateEditionModalComponent,
    PickupComponent,
    TopicComponent,
    CreateOrEditTopicComponent,
    CreateOrEditPickupComponent,
    DistributComponent,
    CreateOrEditDistributComponent
  ],
  entryComponents: [CreateOrEditUserModalComponent],
  providers: [ImpersonationService],
})
export class AdminModule { }
