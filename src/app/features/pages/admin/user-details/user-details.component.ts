import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
@Component({ selector:'app-user-details', standalone:true, imports:[RouterModule,CommonModule,NavbarComponent], templateUrl:'./user-details.component.html', styleUrls:['./user-details.component.css'] })
export class UserDetailsComponent {
  user = {
    initials:'AC', name:'Alex Carter', email:'alex@mail.com', role:'Driver',
    sessions:14, spent:'$132.40', joined:'Jun 7, 2026', status:'Active',
    sessions_list:[
      { station:'Mission Bay Supercharger', date:'Jun 7, 09:12', energy:'32.4 kWh', total:'$11.02' },
      { station:'Presidio Green Station',   date:'Jun 4, 17:48', energy:'41.2 kWh', total:'$16.07' },
      { station:'SoMa Garage Charging',     date:'Jun 1, 08:02', energy:'28.6 kWh', total:'$7.72' },
    ],
    notifications:[
      { icon:'bi-check-circle', bg:'#dcfce7', color:'#16a34a', title:'Account approved',   body:'Your account has been verified.',       time:'Jun 7' },
      { icon:'bi-bell',         bg:'#dbeafe', color:'#1d4ed8', title:'Booking confirmed',  body:'Mission Bay Supercharger · P-04A.',     time:'Jun 7' },
      { icon:'bi-credit-card',  bg:'#fef3c7', color:'#92400e', title:'Payment completed',  body:'$11.02 paid · TX-9F4A21E0.',            time:'Jun 7' },
    ],
  };
  toggleSuspend() { this.user.status = this.user.status==='Active' ? 'Suspended' : 'Active'; }
  banUser()       { if(confirm('Ban this user?')) alert('User banned.'); }
  sendNotif()     { alert('Notification sent to ' + this.user.name); }
}
