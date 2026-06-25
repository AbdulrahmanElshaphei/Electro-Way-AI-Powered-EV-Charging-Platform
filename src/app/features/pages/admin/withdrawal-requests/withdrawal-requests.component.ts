import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
@Component({ selector:'app-withdrawal-requests', standalone:true, imports:[RouterModule,CommonModule,NavbarComponent], templateUrl:'./withdrawal-requests.component.html', styleUrls:['./withdrawal-requests.component.css'] })
export class WithdrawalRequestsComponent {
  tab = 'pending';
  requests = [
    { ref:'WD-A1B2C3', owner:'Green Grid LLC', amount:'$2,400.00', method:'Bank Transfer',  icon:'bi-bank',        date:'Jun 10', status:'Pending' },
    { ref:'WD-D4E5F6', owner:'SunPower Inc.',  amount:'$890.00',   method:'Digital Wallet', icon:'bi-wallet2',     date:'Jun 9',  status:'Pending' },
    { ref:'WD-G7H8I9', owner:'Alex Carter',    amount:'$320.50',   method:'Debit Card',     icon:'bi-credit-card', date:'Jun 8',  status:'Approved' },
    { ref:'WD-J1K2L3', owner:'Marina Co.',     amount:'$150.00',   method:'Bank Transfer',  icon:'bi-bank',        date:'Jun 7',  status:'Rejected' },
  ];
  getPending()  { return this.requests.filter(r => r.status==='Pending'); }
  getFiltered() {
    if(this.tab==='pending')  return this.requests.filter(r => r.status==='Pending');
    if(this.tab==='approved') return this.requests.filter(r => r.status==='Approved');
    return this.requests.filter(r => r.status==='Rejected');
  }
  approve(w: any) { w.status='Approved'; alert('✅ Approved! Notification sent to ' + w.owner + ': "Your withdrawal of ' + w.amount + ' has been approved."'); }
  reject(w: any)  { const r=prompt('Reason:'); if(r) { w.status='Rejected'; alert('❌ Rejected. Notification sent to ' + w.owner + ': "Your withdrawal was rejected. Reason: ' + r + '"'); } }
}
