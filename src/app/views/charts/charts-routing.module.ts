import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RoleGuard} from '../../core/guards/role.guard';
import {RoleType} from '../../views/system/models/user.model';
import { ChartsComponent } from './charts.component';

const routes: Routes = [
  {
    path: '',
    component: ChartsComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Charts',
      roles: [RoleType.ADMIN, RoleType.MEMBER,]
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsRoutingModule {}

