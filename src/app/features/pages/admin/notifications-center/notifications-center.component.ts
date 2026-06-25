import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
@Component({ selector:'app-notifications-center', standalone:true, imports:[RouterModule,CommonModule,FormsModule,NavbarComponent], templateUrl:'./notifications-center.component.html', styleUrls:['./notifications-center.component.css'] })
export class NotificationsCenterComponent {
  audience = 'all'; targetUser = ''; notifType = 'Info'; title = ''; message = '';
  sentHistory = [
    { audience:'All Users',    title:'Scheduled maintenance Jun 15', body:'The platform will be down for 2 hours on Jun 15 at 2:00 AM UTC.', time:'Jun 10, 09:00', reach:'48,291' },
    { audience:'Owners Only',  title:'New payout feature available', body:'You can now withdraw to digital wallets instantly.',            time:'Jun 8, 14:30',  reach:'3,204' },
    { audience:'Drivers Only', title:'Summer charging discount',     body:'Get 20% off your next 3 sessions this week.',                  time:'Jun 5, 10:00',  reach:'45,087' },
  ];
  getTypeIcon() {
    const m: Record<string, string> = { Info:'bi-info-circle-fill', Success:'bi-check-circle-fill', Warning:'bi-exclamation-triangle-fill', Alert:'bi-bell-fill' };
    return m[this.notifType] || 'bi-info-circle-fill';
  }
  send() {
    this.sentHistory.unshift({ audience: this.audience==='all'?'All Users':this.audience==='drivers'?'Drivers Only':this.audience==='owners'?'Owners Only':this.targetUser, title: this.title, body: this.message, time: 'Just now', reach: this.audience==='all'?'48,291':this.audience==='drivers'?'45,087':'3,204' });
    alert('✅ Notification sent!'); this.title=''; this.message='';
  }
}
