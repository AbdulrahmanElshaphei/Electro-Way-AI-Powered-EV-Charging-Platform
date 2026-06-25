import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
@Component({ selector:'app-manage-users', standalone:true, imports:[RouterModule,CommonModule,FormsModule,NavbarComponent], templateUrl:'./manage-users.component.html', styleUrls:['./manage-users.component.css'] })
export class ManageUsersComponent {
  search = ''; roleFilter = ''; statusFilter = '';
  users = [
    { id:'1', initials:'AC', name:'Alex Carter',   email:'alex@mail.com',  role:'Driver', joined:'Jun 7',  sessions:14, status:'Active' },
    { id:'2', initials:'PR', name:'Priya Rajan',   email:'priya@mail.com', role:'Owner',  joined:'Jun 6',  sessions:0,  status:'Active' },
    { id:'3', initials:'JT', name:'Jamal Torres',  email:'jamal@mail.com', role:'Driver', joined:'Jun 5',  sessions:8,  status:'Suspended' },
    { id:'4', initials:'SL', name:'Sofia Lima',    email:'sofia@mail.com', role:'Driver', joined:'Jun 4',  sessions:22, status:'Active' },
    { id:'5', initials:'MD', name:'Marco Delvec',  email:'marco@mail.com', role:'Owner',  joined:'May 30', sessions:0,  status:'Active' },
    { id:'6', initials:'HK', name:'Hana Kim',      email:'hana@mail.com',  role:'Driver', joined:'May 28', sessions:5,  status:'Active' },
  ];
  filteredUsers() {
    return this.users.filter(u =>
      (!this.search || u.name.toLowerCase().includes(this.search.toLowerCase()) || u.email.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.roleFilter   || u.role   === this.roleFilter) &&
      (!this.statusFilter || u.status === this.statusFilter)
    );
  }
  toggleStatus(u: any) { u.status = u.status === 'Active' ? 'Suspended' : 'Active'; }
}
