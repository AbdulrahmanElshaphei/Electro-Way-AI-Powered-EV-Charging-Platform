import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
@Component({ selector:'app-station-review', standalone:true, imports:[RouterModule,CommonModule,FormsModule,NavbarComponent], templateUrl:'./station-review.component.html', styleUrls:['./station-review.component.css'] })
export class StationReviewComponent {
  showReject = false; rejectReason = ''; customMsg = '';
  station = { name:'Oakland Fast Charge', owner:'Green Grid LLC', address:'500 Broadway, Oakland, CA 94607', ports:4, price:'$0.29', submitted:'Jun 10, 2026', speed:150, notes:'Covered parking lot, 24/7 access, security cameras installed. Near BART station.' };
  approve() { alert('✅ Station approved! 🎉 Congratulations notification sent to owner: "Your station Oakland Fast Charge has been approved and is now live on the map!"'); }
  confirmReject() { alert('❌ Rejection sent.\n\nNotification to owner: "Your station ' + this.station.name + ' was rejected.\nReason: ' + this.rejectReason + '\nYou can edit and resubmit."'); this.showReject=false; this.rejectReason=''; }
  sendMsg() { alert('Message sent to owner: "' + this.customMsg + '"'); this.customMsg=''; }
}
