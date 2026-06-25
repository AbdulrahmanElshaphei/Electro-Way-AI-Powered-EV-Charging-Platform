import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
@Component({ selector:'app-reports', standalone:true, imports:[RouterModule,CommonModule,NavbarComponent], templateUrl:'./reports.component.html', styleUrls:['./reports.component.css'] })
export class ReportsComponent {
  kpis = [
    { label:'TOTAL REVENUE',   value:'$284k',  trend:'↗ +12.4% vs last month' },
    { label:'TOTAL SESSIONS',  value:'48,291', trend:'↗ +8.4% vs last month' },
    { label:'AVG SESSION VALUE',value:'$12.40', trend:'↗ +3.1% vs last month' },
    { label:'NEW USERS',       value:'3,204',  trend:'↗ +18% vs last month' },
  ];
  revenueData = [
    { month:'Jan', val:'$210k', pct:60 }, { month:'Feb', val:'$195k', pct:55 }, { month:'Mar', val:'$230k', pct:65 },
    { month:'Apr', val:'$250k', pct:71 }, { month:'May', val:'$270k', pct:77 }, { month:'Jun', val:'$284k', pct:100 },
  ];
  usersData = [
    { month:'Jan', val:'1.8k', pct:56 }, { month:'Feb', val:'2.1k', pct:65 }, { month:'Mar', val:'2.4k', pct:75 },
    { month:'Apr', val:'2.6k', pct:81 }, { month:'May', val:'2.7k', pct:84 }, { month:'Jun', val:'3.2k', pct:100 },
  ];
  topStations = [
    { name:'Mission Bay Supercharger', city:'San Francisco', sessions:'4,120', pct:100 },
    { name:'Presidio Green Station',   city:'San Francisco', sessions:'3,840', pct:93 },
    { name:'Embarcadero Hub',          city:'San Francisco', sessions:'3,210', pct:78 },
    { name:'SoMa Garage Charging',     city:'San Francisco', sessions:'2,980', pct:72 },
    { name:'Marina Quick Charge',      city:'San Francisco', sessions:'2,450', pct:59 },
  ];
  speedLegend = [{ label:'Ultra Fast (250kW)', color:'#22c55e', pct:60 }, { label:'Fast (150kW)', color:'#3b82f6', pct:25 }, { label:'Standard (50kW)', color:'#e5e7eb', pct:15 }];
}
