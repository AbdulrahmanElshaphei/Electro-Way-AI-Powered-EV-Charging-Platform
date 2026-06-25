import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChargeReceiptService, ChargeSession } from '../../../core/services/charge-receipt.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  session: ChargeSession;

  cardName = '';
  cardNum = '';
  expiry = '';
  cvv = '';
  processing = false;

  constructor(private receiptSvc: ChargeReceiptService, private router: Router) {
    this.session = this.receiptSvc.get();
  }

  get formValid(): boolean {
    return !!(this.cardName && this.cardNum.replace(/\s/g, '').length >= 12 && this.expiry && this.cvv.length >= 3);
  }

  pay() {
    if (!this.formValid || this.processing) return;
    this.processing = true;

    const digits = this.cardNum.replace(/\s/g, '');
    this.receiptSvc.setCardLast4(digits.slice(-4));

    // Simulate payment gateway processing delay
    setTimeout(() => {
      this.router.navigate(['/payment-success']);
    }, 1400);
  }
}
