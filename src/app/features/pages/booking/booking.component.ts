import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({ selector:'app-booking', standalone:true, imports:[RouterModule,CommonModule], templateUrl:'./booking.component.html', styleUrls:['./booking.component.css'] })
export class BookingComponent {}
