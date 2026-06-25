import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { PortsService, ChargingPort } from '../../../../core/services/ports.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats = [
    { label:'TOTAL USERS',        value:'48,291', trend:'↗ +8.4%',  icon:'bi-people-fill',       bg:'#dbeafe', color:'#1d4ed8' },
    { label:'TOTAL PORTS',        value:'12,084', trend:'↗ +3.1%',  icon:'bi-lightning-fill',    bg:'#dcfce7', color:'#16a34a' },
    { label:'REVENUE THIS MONTH', value:'$284k',  trend:'↗ +12.4%', icon:'bi-currency-dollar',   bg:'#fef3c7', color:'#92400e' },
    { label:'ACTIVE SESSIONS',    value:'1,204',  trend:'↗ live',   icon:'bi-activity',          bg:'#ede9fe', color:'#7c3aed' },
  ];
  recentUsers = [
    { initials:'AC', name:'Alex Carter',  role:'Driver', joined:'Jun 7', active:true },
    { initials:'PR', name:'Priya Rajan',  role:'Owner',  joined:'Jun 6', active:true },
    { initials:'JT', name:'Jamal Torres', role:'Driver', joined:'Jun 5', active:false },
    { initials:'SL', name:'Sofia Lima',   role:'Driver', joined:'Jun 4', active:true },
  ];

  pendingPorts: ChargingPort[] = [];

  constructor(private portsSvc: PortsService) {}

  ngOnInit() {
    this.pendingPorts = this.portsSvc.getPending();
  }

  approve(p: ChargingPort) {
    this.portsSvc.approve(p.id);
    this.pendingPorts = this.portsSvc.getPending();
  }
  reject(p: ChargingPort) {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;
    this.portsSvc.reject(p.id, reason);
    this.pendingPorts = this.portsSvc.getPending();
  }
}
