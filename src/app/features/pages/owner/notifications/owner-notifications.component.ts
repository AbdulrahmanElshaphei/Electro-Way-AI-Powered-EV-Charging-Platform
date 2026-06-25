import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { OwnerVerificationService } from '../../../../core/services/owner-verification.service';

@Component({
  selector: 'app-owner-notifications',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './owner-notifications.component.html',
  styleUrls: ['./owner-notifications.component.css']
})
export class OwnerNotificationsComponent implements OnInit {
  filter = 'all';

  notifications = [
    { type:'stations', icon:'bi-check-circle-fill',   bg:'#dcfce7', color:'#16a34a', title:'Station Approved!',       body:'🎉 Congratulations! Your station "Oakland Fast Charge" has been approved and is now live on the map.',  time:'2m ago',    read:false },
    { type:'reviews',  icon:'bi-star-fill',            bg:'#fef3c7', color:'#92400e', title:'New 5-star review',       body:'Alex C. left a review: "Fast, reliable, and the lounge area is a huge plus. My go-to station."',      time:'18m ago',   read:false },
    { type:'payouts',  icon:'bi-currency-dollar',      bg:'#dbeafe', color:'#1d4ed8', title:'Payout approved',         body:'Your withdrawal of $2,400.00 has been approved. Funds arrive in 2-3 business days.',                   time:'1h ago',    read:false },
    { type:'stations', icon:'bi-lightning-charge-fill',bg:'#dcfce7', color:'#16a34a', title:'Port P-02A back online',  body:'Port P-02A at Mission Bay Supercharger is back to Available after maintenance.',                       time:'3h ago',    read:true  },
    { type:'reviews',  icon:'bi-star-half',            bg:'#fef3c7', color:'#92400e', title:'New review — 3 stars',   body:'Sofia L. said: "Port P-03A was a bit slow today, but service was overall good."',                      time:'5h ago',    read:true  },
    { type:'payouts',  icon:'bi-x-circle-fill',        bg:'#fee2e2', color:'#dc2626', title:'Payout request rejected', body:'Your withdrawal of $150.00 was rejected. Reason: Insufficient verification. Contact support.',         time:'Yesterday', read:true  },
    { type:'stations', icon:'bi-exclamation-triangle', bg:'#fef3c7', color:'#92400e', title:'Port P-04A Out of Service',body:'Port P-04A has been marked Out of Service. Please check and update its status.',                     time:'2 days ago',read:true  },
  ];

  constructor(private verificationSvc: OwnerVerificationService) {}

  ngOnInit() {
    const record = this.verificationSvc.getRecord();
    if (record?.ocr && !record.ocr.passed) {
      const reasonText = record.ocr.reasons.length
        ? record.ocr.reasons.join(' ')
        : 'We could not confirm your identity from the documents provided.';
      this.notifications.unshift({
        type: 'verification',
        icon: 'bi-shield-exclamation',
        bg: '#fee2e2',
        color: '#dc2626',
        title: 'Identity verification failed',
        body: `${reasonText} Your dashboard is locked until this is fixed — go to your dashboard and tap "Edit your data" to resubmit your documents.`,
        time: 'Just now',
        read: false
      });
    }
  }

  unreadCount() { return this.notifications.filter(n => !n.read).length; }

  filtered() {
    if (this.filter === 'all')      return this.notifications;
    if (this.filter === 'unread')   return this.notifications.filter(n => !n.read);
    return this.notifications.filter(n => n.type === this.filter);
  }

  markAllRead() { this.notifications.forEach(n => n.read = true); }
}
