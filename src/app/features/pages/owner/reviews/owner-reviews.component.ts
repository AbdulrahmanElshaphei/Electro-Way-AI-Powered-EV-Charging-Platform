import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
@Component({ selector:'app-owner-reviews', standalone:true, imports:[RouterModule,CommonModule,NavbarComponent], templateUrl:'./owner-reviews.component.html', styleUrls:['./owner-reviews.component.css'] })
export class OwnerReviewsComponent {
  reviews = [
    { initials:'A', name:'Alex C.',  date:'Jun 7', stars:'★★★★★', text:'Fast, reliable, and the lounge area is a huge plus. My go-to station.' },
    { initials:'P', name:'Priya R.', date:'Jun 6', stars:'★★★★☆', text:'Easy to find and the QR scan worked first try. Could use more lighting at night.' },
    { initials:'M', name:'Marco D.', date:'Jun 5', stars:'★★★★★', text:'Best price per kWh in the neighborhood. Always available when I drop by.' },
    { initials:'S', name:'Sofia L.', date:'Jun 4', stars:'★★★☆☆', text:'Port P-03A was a bit slow today, but service was overall good.' },
    { initials:'J', name:'Jamal T.', date:'Jun 3', stars:'★★★★★', text:'Lovely staff and an extremely smooth booking experience through the app.' },
    { initials:'H', name:'Hana K.',  date:'Jun 1', stars:'★★★★☆', text:'Great location, easy access from the freeway. Will be back.' },
  ];
}
