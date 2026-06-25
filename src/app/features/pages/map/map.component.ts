import { Component, AfterViewInit, NgZone, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
import { CarInfoService, CarInfo } from '../../../core/services/car-info.service';
import { PortsService, ChargingPort } from '../../../core/services/ports.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NavbarComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  aiQuery = '';
  aiChips = ['Find nearest available charger.', 'Find fastest charger.', 'Cheapest station nearby.', 'I have 15% battery.', 'Shortest waiting time.'];
  filters = ['Nearest', 'Fast Charging', 'Cheapest', 'Highest Rated', 'Available Only'];
  activeFilter = 'Nearest';
  selectedStation: any = null;
  loadingLocation = true;

  messages: { role: 'bot'|'user'; text: string }[] = [
    { role: 'bot', text: "Hi 👋 I'm your Electro AI assistant. Tell me what kind of charger you need — I'll rank the best options for you." }
  ];

  private map: any = null;
  private L: any = null;
  userLat = 30.0444; // Cairo, Egypt
  userLng = 31.2357;

  /**
   * "Stations" shown on the map are just groups of approved, driver-visible
   * ports (status Available/Busy) that share the same stationName/location —
   * there's no separate station entity anymore, only ports.
   */
  stations: any[] = [];

  private buildStationsFromPorts() {
    const ports = this.portsSvc.getDriverVisible().filter(p => p.lat != null && p.lng != null);
    const groups = new Map<string, ChargingPort[]>();
    ports.forEach(p => {
      const key = p.stationName || p.id;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(p);
    });

    this.stations = Array.from(groups.entries()).map(([name, groupPorts]) => {
      const anyAvailable = groupPorts.some(p => p.status === 'Available');
      const fastest = groupPorts.reduce((a, b) => (b.speed > a.speed ? b : a));
      const cheapest = groupPorts.reduce((a, b) => (+b.price < +a.price ? b : a));
      return {
        name,
        address: groupPorts[0].address || '',
        rating: groupPorts[0].rating || '4.5',
        lat: groupPorts[0].lat,
        lng: groupPorts[0].lng,
        status: anyAvailable ? 'Available' : 'Busy',
        speed: fastest.speed >= 250 ? 'Ultra Fast' : fastest.speed >= 100 ? 'Fast' : 'Standard',
        speedKw: fastest.speed + 'kW',
        price: 'EGP ' + cheapest.price + '/kWh',
        dist: '—',
        ports: groupPorts,
      };
    });
  }

  constructor(private zone: NgZone, private carInfoSvc: CarInfoService, private portsSvc: PortsService) {}

  // ── "My Car" popup ────────────────────────────────────────────────
  showCarPopup = false;
  carInfo: CarInfo = { make:'', model:'', year:'', color:'', plateNumber:'', connectorType:'CCS', batteryCapacity:'' };
  savedCarInfo: CarInfo | null = null;

  ngOnInit() {
    this.savedCarInfo = this.carInfoSvc.get();
    this.buildStationsFromPorts();
  }

  openCarPopup() {
    this.carInfo = this.savedCarInfo ? { ...this.savedCarInfo } : { make:'', model:'', year:'', color:'', plateNumber:'', connectorType:'CCS', batteryCapacity:'' };
    this.showCarPopup = true;
  }
  closeCarPopup() { this.showCarPopup = false; }
  saveCarInfo() {
    if (!this.carInfo.make || !this.carInfo.model || !this.carInfo.plateNumber) return;
    this.carInfoSvc.save(this.carInfo);
    this.savedCarInfo = { ...this.carInfo };
    this.showCarPopup = false;
  }

  ngAfterViewInit() { this.loadLeaflet(); }

  private loadLeaflet() {
    if (!document.getElementById('leaflet-css')) {
      const l = document.createElement('link');
      l.id = 'leaflet-css'; l.rel = 'stylesheet';
      l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(l);
    }
    if ((window as any)['L']) { this.L = (window as any)['L']; this.requestLocation(); return; }
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.onload = () => this.zone.run(() => { this.L = (window as any)['L']; this.requestLocation(); });
    document.head.appendChild(s);
  }

  private requestLocation() {
    if (!navigator.geolocation) { this.loadingLocation = false; this.initMap(); return; }
    navigator.geolocation.getCurrentPosition(
      p  => this.zone.run(() => { this.userLat = p.coords.latitude; this.userLng = p.coords.longitude; this.loadingLocation = false; this.initMap(); }),
      () => this.zone.run(() => { this.loadingLocation = false; this.initMap(); }),
      { timeout: 8000, enableHighAccuracy: true }
    );
  }

  private initMap() {
    const el = document.getElementById('gmap');
    if (!el || !this.L) return;
    const L = this.L;

    this.map = L.map('gmap', { zoomControl: true }).setView([this.userLat, this.userLng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    // User dot
    const userIcon = L.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;background:#3b82f6;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 4px rgba(59,130,246,.25),0 2px 6px rgba(0,0,0,.3)"></div>`,
      iconSize:[16,16], iconAnchor:[8,8],
    });
    L.marker([this.userLat, this.userLng], { icon: userIcon, zIndexOffset:1000 }).addTo(this.map);

    // Station pins
    this.stations.forEach(s => {
      const color = s.status==='Available'?'#22c55e': s.status==='Busy'?'#ef4444':'#9ca3af';
      const pin = L.divIcon({
        className:'',
        html:`<div style="width:36px;height:36px;background:${color};border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;cursor:pointer">⚡</div>`,
        iconSize:[36,36], iconAnchor:[18,18],
      });
      const popup = `<div style="font-family:Inter,sans-serif;min-width:160px;padding:4px 0">
        <div style="font-size:13px;font-weight:700;margin-bottom:3px">${s.name}</div>
        <div style="font-size:11px;color:#6b7280;margin-bottom:6px">${s.address}</div>
        <div style="display:flex;gap:6px;align-items:center">
          <span style="background:${color};color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px">${s.status}</span>
          <span style="font-size:12px;font-weight:600">${s.price}</span>
        </div>
      </div>`;
      L.marker([s.lat, s.lng], { icon:pin }).addTo(this.map).bindPopup(popup)
       .on('click', () => this.zone.run(() => this.selectedStation = s));
    });
  }

  selectStation(s: any) {
    this.selectedStation = s;
    if (this.map) this.map.setView([s.lat, s.lng], 15);
  }

  sendChip(c: string) { this.aiQuery = c; this.sendAI(); }

  sendAI() {
    if (!this.aiQuery.trim()) return;
    this.messages.push({ role:'user', text: this.aiQuery });
    const q = this.aiQuery.toLowerCase();
    this.aiQuery = '';
    setTimeout(() => {
      let reply = '';
      if (q.includes('fast') || q.includes('speed'))
        reply = '⚡ Fastest nearby: Nasr City Fast Charge (250kW) — available now in Nasr City, Cairo.';
      else if (q.includes('cheap') || q.includes('price'))
        reply = '💰 Cheapest nearby: Fifth Settlement Charge Point at EGP 3.20/kWh in New Cairo.';
      else if (q.includes('15%') || q.includes('20%') || q.includes('battery') || q.includes('low'))
        reply = '🔋 With low battery, I recommend Nasr City Fast Charge — 250kW, available right now in Nasr City, Cairo!';
      else if (q.includes('nearest') || q.includes('closest'))
        reply = '📍 Nearest available: Nasr City Fast Charge — available now, 250kW at EGP 4.50/kWh.';
      else if (q.includes('wait'))
        reply = '⏱ Shortest wait: Nasr City Fast Charge and Fifth Settlement Charge Point are both available right now with no queue.';
      else
        reply = '🤖 Got it! Based on your request, I\'d recommend Nasr City Fast Charge — ultra-fast 250kW charging at EGP 4.50/kWh.';
      this.messages.push({ role:'bot', text: reply });
      setTimeout(() => {
        const el = this.messagesContainer?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
    }, 600);
  }

  ngOnDestroy() { if (this.map) { this.map.remove(); this.map = null; } }
}
