import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { PortsService, ChargingPort } from '../../../../core/services/ports.service';

@Component({
  selector: 'app-manage-stations',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NavbarComponent],
  templateUrl: './manage-stations.component.html',
  styleUrls: ['./manage-stations.component.css']
})
export class ManageStationsComponent implements OnInit {
  // ── Port approvals (added by owners from their dashboard) ──────────
  // There's no separate "station" submission anymore — owners add
  // individual ports, and each one is approved/rejected on its own.
  portTab = 'pending';
  ports: ChargingPort[] = [];
  rejectingPort: ChargingPort | null = null;
  portRejectReason = '';
  viewingPort: ChargingPort | null = null;

  constructor(private portsSvc: PortsService) {}

  ngOnInit() { this.loadPorts(); }

  loadPorts() { this.ports = this.portsSvc.getAll(); }

  getFilteredPorts() {
    if (this.portTab === 'pending')  return this.ports.filter(p => p.status === 'Pending');
    if (this.portTab === 'live')     return this.ports.filter(p => p.status === 'Available' || p.status === 'Busy');
    if (this.portTab === 'rejected') return this.ports.filter(p => p.status === 'Rejected');
    return this.ports.filter(p => p.status === 'Out of Service');
  }

  pendingPortCount() { return this.ports.filter(p => p.status === 'Pending').length; }

  openViewPort(p: ChargingPort) { this.viewingPort = p; }
  closeViewPort() { this.viewingPort = null; }

  approvePort(p: ChargingPort) {
    this.portsSvc.approve(p.id);
    this.loadPorts();
    if (this.viewingPort?.id === p.id) this.viewingPort = null;
  }

  openRejectPort(p: ChargingPort) { this.rejectingPort = p; this.portRejectReason = ''; }
  closeRejectPort() { this.rejectingPort = null; }
  confirmRejectPort() {
    if (!this.rejectingPort || !this.portRejectReason) return;
    this.portsSvc.reject(this.rejectingPort.id, this.portRejectReason);
    this.loadPorts();
    if (this.viewingPort?.id === this.rejectingPort.id) this.viewingPort = null;
    this.rejectingPort = null;
  }
}
