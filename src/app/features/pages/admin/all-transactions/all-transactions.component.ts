import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';

@Component({
  selector: 'app-all-transactions',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NavbarComponent],
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.css']
})
export class AllTransactionsComponent {
  search = ''; statusFilter = ''; dateFrom = ''; dateTo = '';

  transactions = [
    { id:'TX-9F4A21E0', user:'Alex Carter',  station:'Mission Bay Supercharger', date:'Jun 7, 09:12', energy:'32.4 kWh', total:'$11.02', fee:'$1.10', status:'Paid' },
    { id:'TX-8E12C7D2', user:'Sofia Lima',   station:'Presidio Green Station',   date:'Jun 7, 08:31', energy:'41.2 kWh', total:'$16.07', fee:'$1.61', status:'Paid' },
    { id:'TX-7B92AC11', user:'Jamal Torres', station:'SoMa Garage Charging',     date:'Jun 6, 18:02', energy:'28.6 kWh', total:'$9.72',  fee:'$0.97', status:'Paid' },
    { id:'TX-6A04D540', user:'Hana Kim',     station:'Castro Power Loop',        date:'Jun 6, 14:33', energy:'35.9 kWh', total:'$10.41', fee:'$1.04', status:'Paid' },
    { id:'TX-5C12E9A7', user:'Alex Carter',  station:'Marina Quick Charge',      date:'Jun 6, 11:20', energy:'22.1 kWh', total:'$4.64',  fee:'$0.46', status:'Refunded' },
    { id:'TX-4D88BB02', user:'Marco Delvec', station:'Embarcadero Hub',          date:'Jun 5, 19:47', energy:'48 kWh',   total:'$16.32', fee:'$1.63', status:'Paid' },
  ];

  filteredRows() {
    return this.transactions.filter(t =>
      (!this.search || t.id.toLowerCase().includes(this.search.toLowerCase()) ||
                       t.user.toLowerCase().includes(this.search.toLowerCase()) ||
                       t.station.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.statusFilter || t.status === this.statusFilter)
    );
  }

  exportCSV() {
    const rows = this.filteredRows();
    const headers = ['Transaction ID', 'User', 'Station', 'Date', 'Energy', 'Total', 'Platform Fee', 'Status'];
    const data = rows.map(t =>
      [t.id, t.user, t.station, t.date, t.energy, t.total, t.fee, t.status]
    );
    this.downloadCSV([headers, ...data], `admin-transactions-${new Date().toISOString().slice(0,10)}.csv`);
  }

  private downloadCSV(data: string[][], filename: string) {
    const csv = data.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
}
