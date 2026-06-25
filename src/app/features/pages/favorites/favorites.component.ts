import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
@Component({ selector:'app-favorites', standalone:true, imports:[RouterModule,CommonModule,NavbarComponent], templateUrl:'./favorites.component.html', styleUrls:['./favorites.component.css'] })
export class FavoritesComponent {
  stations = [
    { name:'Mission Bay Supercharger', address:'275 Berry St, San Francisco',   rating:'4.8', dist:'0.4 mi', price:'$0.34/kWh', status:'Available',    gradient:'linear-gradient(135deg,#dcfce7,#e0f2fe)' },
    { name:'Embarcadero Hub',          address:'1 Ferry Building, San Francisco',rating:'4.6', dist:'1.1 mi', price:'$0.29/kWh', status:'Busy',         gradient:'linear-gradient(135deg,#e0f2fe,#ede9fe)' },
    { name:'SoMa Garage Charging',     address:'525 Harrison St, San Francisco', rating:'4.4', dist:'1.4 mi', price:'$0.27/kWh', status:'Available',    gradient:'linear-gradient(135deg,#fef3c7,#dcfce7)' },
    { name:'Presidio Green Station',   address:'104 Montgomery St, SF',          rating:'4.9', dist:'2.2 mi', price:'$0.39/kWh', status:'Available',    gradient:'linear-gradient(135deg,#dcfce7,#f0fdf4)' },
    { name:'Mission District Plug',    address:'2200 Mission St, SF',            rating:'4.2', dist:'2.8 mi', price:'$0.21/kWh', status:'Out of Service',gradient:'linear-gradient(135deg,#f3f4f6,#e5e7eb)' },
    { name:'Marina Quick Charge',      address:'3200 Marina Blvd, SF',           rating:'4.7', dist:'3.1 mi', price:'$0.31/kWh', status:'Busy',         gradient:'linear-gradient(135deg,#ede9fe,#e0f2fe)' },
  ];
}
