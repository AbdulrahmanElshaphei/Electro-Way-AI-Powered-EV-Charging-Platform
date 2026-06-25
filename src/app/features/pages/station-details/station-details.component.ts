import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';

@Component({
  selector: 'app-station-details',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.css']
})
export class StationDetailsComponent {
  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    const msg = this.isFavorite ? '❤️ Added to favorites!' : 'Removed from favorites';
    // In real app: call favorites service
    console.log(msg);
  }

  reviews = [
    { initials:'AC', name:'Alex C.',  stars:'★★★★★', text:'Fast, reliable, and the lounge area is a huge plus.' },
    { initials:'PR', name:'Priya R.', stars:'★★★★☆', text:'Easy to find and QR scan worked first try.' },
    { initials:'JT', name:'Jamal T.', stars:'★★★★★', text:'Extremely smooth booking experience through the app.' },
  ];
}
