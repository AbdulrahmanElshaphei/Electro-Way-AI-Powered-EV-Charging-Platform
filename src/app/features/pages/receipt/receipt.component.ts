import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChargeReceiptService, ChargeSession } from '../../../core/services/charge-receipt.service';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent {
  session: ChargeSession;
  constructor(private receiptSvc: ChargeReceiptService) {
    this.session = this.receiptSvc.get();
  }
}
