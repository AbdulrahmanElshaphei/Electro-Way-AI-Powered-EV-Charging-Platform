import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';

interface Booking {
  id: string;
  driverName: string;
  driverEmail: string;
  driverInitials: string;
  port: string;
  speed: number;
  priceKwh: string;
  date: string;
  time: string;
  duration: string;
  estCost: string;
  status: 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
}

@Component({
  selector: 'app-owner-bookings',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NavbarComponent],
  templateUrl: './owner-bookings.component.html',
  styleUrls: ['./owner-bookings.component.css']
})
export class OwnerBookingsComponent {
  tab        = 'all';
  search     = '';
  portFilter = '';
  selectedBooking: Booking | null = null;

  tabs = [
    { key:'all',       label:'All' },
    { key:'Confirmed', label:'Confirmed' },
    { key:'Active',    label:'Active' },
    { key:'Completed', label:'Completed' },
    { key:'Cancelled', label:'Cancelled' },
  ];

  ports = ['P-01A','P-02A','P-03A','P-04A','P-05A','P-06A'];

  bookings: Booking[] = [
    { id:'BK-001A2B', driverName:'Alex Carter',   driverEmail:'alex@mail.com',   driverInitials:'AC', port:'P-04A', speed:150, priceKwh:'0.29', date:'Jun 15, 2026', time:'09:00 AM', duration:'~25 min', estCost:'$11.90', status:'Confirmed' },
    { id:'BK-002C3D', driverName:'Sofia Lima',    driverEmail:'sofia@mail.com',  driverInitials:'SL', port:'P-01A', speed:250, priceKwh:'0.34', date:'Jun 15, 2026', time:'10:30 AM', duration:'~20 min', estCost:'$14.28', status:'Confirmed' },
    { id:'BK-003E4F', driverName:'Jamal Torres',  driverEmail:'jamal@mail.com',  driverInitials:'JT', port:'P-02A', speed:250, priceKwh:'0.34', date:'Jun 15, 2026', time:'08:30 AM', duration:'~30 min', estCost:'$16.07', status:'Active'    },
    { id:'BK-004G5H', driverName:'Hana Kim',      driverEmail:'hana@mail.com',   driverInitials:'HK', port:'P-03A', speed:150, priceKwh:'0.29', date:'Jun 14, 2026', time:'06:00 PM', duration:'~35 min', estCost:'$10.41', status:'Completed' },
    { id:'BK-005I6J', driverName:'Marco Delvec',  driverEmail:'marco@mail.com',  driverInitials:'MD', port:'P-05A', speed:50,  priceKwh:'0.21', date:'Jun 14, 2026', time:'02:00 PM', duration:'~45 min', estCost:'$6.85',  status:'Completed' },
    { id:'BK-006K7L', driverName:'Priya Rajan',   driverEmail:'priya@mail.com',  driverInitials:'PR', port:'P-06A', speed:50,  priceKwh:'0.21', date:'Jun 13, 2026', time:'11:00 AM', duration:'~30 min', estCost:'$4.64',  status:'Cancelled' },
    { id:'BK-007M8N', driverName:'Alex Carter',   driverEmail:'alex@mail.com',   driverInitials:'AC', port:'P-01A', speed:250, priceKwh:'0.34', date:'Jun 13, 2026', time:'09:12 AM', duration:'~28 min', estCost:'$11.02', status:'Completed' },
    { id:'BK-008O9P', driverName:'Lena Müller',   driverEmail:'lena@mail.com',   driverInitials:'LM', port:'P-04A', speed:150, priceKwh:'0.29', date:'Jun 16, 2026', time:'03:00 PM', duration:'~25 min', estCost:'$9.22',  status:'Confirmed' },
  ];

  // ── Filters ────────────────────────────────────────────
  filtered(): Booking[] {
    return this.bookings.filter(b => {
      const matchTab    = this.tab === 'all' || b.status === this.tab;
      const matchPort   = !this.portFilter || b.port === this.portFilter;
      const matchSearch = !this.search ||
        b.id.toLowerCase().includes(this.search.toLowerCase()) ||
        b.driverName.toLowerCase().includes(this.search.toLowerCase()) ||
        b.port.toLowerCase().includes(this.search.toLowerCase());
      return matchTab && matchPort && matchSearch;
    });
  }

  countByTab(key: string) {
    return this.bookings.filter(b => b.status === key).length;
  }

  // ── Stats ───────────────────────────────────────────────
  todayCount()     { return this.bookings.filter(b => b.date === 'Jun 15, 2026').length; }
  upcomingCount()  { return this.bookings.filter(b => b.status === 'Confirmed').length; }
  cancelledCount() { return this.bookings.filter(b => b.status === 'Cancelled').length; }

  // ── Actions ─────────────────────────────────────────────
  viewDetails(b: Booking) { this.selectedBooking = b; }

  cancelBooking(b: Booking) {
    if (!confirm(`Cancel booking ${b.id} for ${b.driverName}?\nA notification will be sent to the driver.`)) return;
    b.status = 'Cancelled';
    // In production: call API + trigger notification to driver
    alert(`✅ Booking ${b.id} cancelled.\n📬 Notification sent to ${b.driverName}.`);
  }

  // ── CSV Export ──────────────────────────────────────────
  exportCSV() {
    const rows = this.filtered();
    const headers = ['Booking ID','Driver','Email','Port','Date','Time','Duration','Est. Cost','Status'];
    const data = rows.map(b =>
      [b.id, b.driverName, b.driverEmail, b.port, b.date, b.time, b.duration, b.estCost, b.status]
    );
    const csv = [headers, ...data]
      .map(row => row.map(c => `"${String(c).replace(/"/g,'""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `bookings-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
