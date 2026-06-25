import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  filter = 'all';

  notifications = [
    { type:'bookings', icon:'bi-calendar-check-fill', bg:'#dcfce7', color:'#16a34a', title:'Booking confirmed',     body:'Mission Bay Supercharger · Port P-04A, today 09:00.',          time:'2m ago',    read:false },
    { type:'charging', icon:'bi-lightning-charge-fill',bg:'#ede9fe', color:'#7c3aed', title:'Charger now available', body:'Embarcadero Hub — your waiting list spot is ready.',            time:'18m ago',   read:false },
    { type:'payments', icon:'bi-credit-card-fill',    bg:'#fef3c7', color:'#92400e', title:'Payment completed',     body:'$11.02 paid to Electro Way · TX-9F4A21E0.',                     time:'1h ago',    read:false },
    { type:'charging', icon:'bi-battery-charging',    bg:'#dcfce7', color:'#16a34a', title:'Charging complete',     body:'32.4 kWh delivered at Presidio Green Station.',                 time:'Yesterday', read:true  },
    { type:'bookings', icon:'bi-x-circle-fill',       bg:'#fee2e2', color:'#dc2626', title:'Booking cancelled',     body:'Your reservation at SoMa Garage was cancelled (free cancel).',  time:'2 days ago',read:true  },
    { type:'payments', icon:'bi-arrow-counterclockwise',bg:'#fef3c7',color:'#92400e',title:'Refund processed',      body:'$6.85 refunded for session TX-5C12E9A7 at Marina Quick Charge.', time:'3 days ago',read:true  },
  ];

  unreadCount() { return this.notifications.filter(n => !n.read).length; }

  filtered() {
    if (this.filter === 'all')      return this.notifications;
    if (this.filter === 'unread')   return this.notifications.filter(n => !n.read);
    return this.notifications.filter(n => n.type === this.filter);
  }

  markAllRead() { this.notifications.forEach(n => n.read = true); }
}
