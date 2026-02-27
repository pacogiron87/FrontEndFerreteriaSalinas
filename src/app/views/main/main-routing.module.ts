import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from '../../core/guards/role.guard';
import {RoleType} from '../../views/system/models/user.model';
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Dashboard',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
