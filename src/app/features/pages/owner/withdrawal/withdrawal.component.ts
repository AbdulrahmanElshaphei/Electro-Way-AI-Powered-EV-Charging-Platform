import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
@Component({ selector:'app-withdrawal', standalone:true, imports:[RouterModule,CommonModule,FormsModule,NavbarComponent], templateUrl:'./withdrawal.component.html', styleUrls:['./withdrawal.component.css'] })
export class WithdrawalComponent {
  step = 1; method = ''; amount = ''; holderName = ''; bankName = ''; accountNum = ''; routingNum = '';
  walletType = 'PayPal'; walletId = ''; cardNum = ''; expiry = ''; cvv = '';
  refId = Math.random().toString(16).slice(2,10).toUpperCase();
  methods = [
    { id:'bank',   name:'Bank Transfer',       desc:'Direct deposit to your bank account (2-3 days)', icon:'bi-bank',         bg:'#dbeafe', color:'#1d4ed8' },
    { id:'wallet', name:'Digital Wallet',       desc:'PayPal, Venmo, or Cash App (instant)',           icon:'bi-wallet2',      bg:'#ede9fe', color:'#7c3aed' },
    { id:'card',   name:'Debit / Credit Card',  desc:'Withdraw directly to your card (1-2 days)',      icon:'bi-credit-card',  bg:'#dcfce7', color:'#16a34a' },
  ];
  getMethodName() { return this.methods.find(m => m.id === this.method)?.name || ''; }
}
