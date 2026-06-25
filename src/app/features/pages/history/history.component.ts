import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
@Component({ selector:'app-history', standalone:true, imports:[RouterModule,CommonModule,NavbarComponent], templateUrl:'./history.component.html', styleUrls:['./history.component.css'] })
export class HistoryComponent {
  sessions = [
    { id:'TX-9F4A21E0', station:'Mission Bay Supercharger', date:'Jun 7, 2026 · 09:12', energy:'32.4 kWh', total:'$11.02', status:'Paid' },
    { id:'TX-8E12C7D2', station:'Presidio Green Station',   date:'Jun 4, 2026 · 17:48', energy:'41.2 kWh', total:'$16.07', status:'Paid' },
    { id:'TX-7B92AC11', station:'SoMa Garage Charging',     date:'Jun 1, 2026 · 08:02', energy:'28.6 kWh', total:'$7.72',  status:'Paid' },
    { id:'TX-6A04D540', station:'Castro Power Loop',        date:'May 28, 2026 · 19:33',energy:'35.9 kWh', total:'$11.85', status:'Paid' },
    { id:'TX-5C12E9A7', station:'Marina Quick Charge',      date:'May 24, 2026 · 14:20', energy:'22.1 kWh', total:'$6.85',  status:'Refunded' },
  ];
}
