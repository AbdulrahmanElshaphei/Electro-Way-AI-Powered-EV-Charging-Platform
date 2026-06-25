import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';

@Component({
  selector: 'app-owner-transactions',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './owner-transactions.component.html',
  styleUrls: ['./owner-transactions.component.css']
})
export class OwnerTransactionsComponent {
  transactions = [
    { id:'TX-9F4A21E0', car:'CAR-2241', port:'P-04A', date:'Jun 7, 09:12', energy:'32.4 kWh', total:'$11.02', fee:'$1.10', profit:'$9.92' },
    { id:'TX-8E12C7D2', car:'CAR-9981', port:'P-02A', date:'Jun 7, 08:31', energy:'41.2 kWh', total:'$16.07', fee:'$1.61', profit:'$14.46' },
    { id:'TX-7B92AC11', car:'CAR-3344', port:'P-01A', date:'Jun 6, 18:02', energy:'28.6 kWh', total:'$9.72',  fee:'$0.97', profit:'$8.75' },
    { id:'TX-6A04D540', car:'CAR-7710', port:'P-03A', date:'Jun 6, 14:33', energy:'35.9 kWh', total:'$10.41', fee:'$1.04', profit:'$9.37' },
    { id:'TX-5C12E9A7', car:'CAR-1190', port:'P-05A', date:'Jun 6, 11:20', energy:'22.1 kWh', total:'$4.64',  fee:'$0.46', profit:'$4.18' },
    { id:'TX-4D88BB02', car:'CAR-6650', port:'P-02A', date:'Jun 5, 19:47', energy:'48 kWh',   total:'$16.32', fee:'$1.63', profit:'$14.69' },
  ];

  exportCSV() {
    const headers = ['Transaction ID', 'Car ID', 'Port ID', 'Date', 'Energy', 'Total', 'Platform Fee', 'Your Profit'];
    const rows = this.transactions.map(t =>
      [t.id, t.car, t.port, t.date, t.energy, t.total, t.fee, t.profit]
    );
    this.downloadCSV([headers, ...rows], 'owner-transactions.csv');
  }

  private downloadCSV(data: string[][], filename: string) {
    const csv = data.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
