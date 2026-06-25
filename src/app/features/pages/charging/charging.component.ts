import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';

@Component({
  selector: 'app-charging',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './charging.component.html',
  styleUrls: ['./charging.component.css']
})
export class ChargingComponent implements OnInit, OnDestroy {
  targetPct = 80;
  currentPct = 42;   // start at 42% (existing battery)
  energyKwh  = 12.4;
  cost       = '4.22';
  elapsedTime = '00:00';
  etaMin     = 18;
  isDone     = false;

  readonly circumference = 2 * Math.PI * 88; // r=88

  get dashOffset() {
    return this.circumference * (1 - this.currentPct / 100);
  }

  private timer: any;
  private seconds = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.timer = setInterval(() => {
      this.seconds++;
      const m = Math.floor(this.seconds / 60).toString().padStart(2, '0');
      const s = (this.seconds % 60).toString().padStart(2, '0');
      this.elapsedTime = `${m}:${s}`;

      if (this.currentPct < this.targetPct) {
        this.currentPct = Math.min(this.targetPct, this.currentPct + 0.5);
        this.energyKwh  = +(this.energyKwh + 0.15).toFixed(1);
        this.cost       = (this.energyKwh * 0.34).toFixed(2);
        this.etaMin     = Math.max(0, this.etaMin - 1);
      } else {
        this.isDone = true;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  stopCharging() {
    this.isDone = true;
    clearInterval(this.timer);
    setTimeout(() => this.router.navigate(['/receipt']), 300);
  }

  ngOnDestroy() { clearInterval(this.timer); }
}
