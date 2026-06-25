import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/layout/navbar/navbar.component';
import { OwnerVerificationService, OwnerVerificationData, OcrResult } from '../../../../core/services/owner-verification.service';
import { PortsService, ChargingPort } from '../../../../core/services/ports.service';

export type Port = ChargingPort;

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NavbarComponent],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
export class OwnerDashboardComponent implements AfterViewChecked, OnInit {
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  ports: Port[] = [];
  private readonly OWNER_NAME = 'Mahmoud Saeed'; // demo: in a real app this comes from the logged-in user

  editingPort:  Port | null = null;
  editSnapshot: Port | null = null;
  qrPort:       Port | null = null;
  addingPort = false;
  newPort: { id:string; speed:string; price:string; connector:string; notes:string; images:{url:string;name:string}[] } = { id:'', speed:'150', price:'', connector:'CCS', notes:'', images:[] };
  private qrDrawn = false;

  // ── Identity verification lockout ───────────────────────────────
  ocrResult: OcrResult | null = null;
  get isLocked(): boolean { return !!this.ocrResult && !this.ocrResult.passed; }

  fixingVerification = false;
  fixVerification: OwnerVerificationData = { idFrontUrl: '', idBackUrl: '', selfieUrl: '' };
  fixError = '';
  fixOcrRunning = false;

  constructor(private verificationSvc: OwnerVerificationService, private portsSvc: PortsService) {}

  ngOnInit() {
    this.ocrResult = this.verificationSvc.getRecord()?.ocr ?? null;
    this.loadPorts();
  }

  private loadPorts() {
    this.ports = this.portsSvc.getByOwner(this.OWNER_NAME);
  }

  // ── QR data string unique per port ──────────────────────────────
  getQRData(p: Port): string {
    return `ELECTROWAY:PORT:${p.id}:SPEED:${p.speed}:PRICE:${p.price}:STATION:MISSION-BAY`;
  }

  // ── Draw QR on canvas after modal opens ─────────────────────────
  ngAfterViewChecked() {
    if (this.qrPort && this.qrCanvas?.nativeElement && !this.qrDrawn) {
      this.qrDrawn = true;
      this.drawQR(this.qrCanvas.nativeElement, this.getQRData(this.qrPort));
    }
  }

  /**
   * Minimal QR-like visual generator using the port data string.
   * In production replace with a real QR library (e.g. qrcode-generator or ngx-qrcode).
   * The pattern here is deterministic per portId so each port gets a visually unique code.
   */
  drawQR(canvas: HTMLCanvasElement, data: string) {
    const ctx = canvas.getContext('2d')!;
    const size = 200;
    const modules = 21; // 21x21 grid
    const cellSize = size / modules;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);

    // Generate pseudo-random pattern seeded by data string
    const seed = data.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const rng = (i: number) => ((seed * 9301 + i * 49297 + 233) % 233280) / 233280;

    ctx.fillStyle = '#000';
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // skip finder pattern zones (corners)
        const inTopLeft     = r < 8 && c < 8;
        const inTopRight    = r < 8 && c >= modules - 8;
        const inBottomLeft  = r >= modules - 8 && c < 8;
        if (inTopLeft || inTopRight || inBottomLeft) continue;
        if (rng(r * modules + c) > 0.5) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }

    // Draw 3 finder patterns (squares in corners)
    this.drawFinder(ctx, 0, 0, cellSize);
    this.drawFinder(ctx, (modules - 7) * cellSize, 0, cellSize);
    this.drawFinder(ctx, 0, (modules - 7) * cellSize, cellSize);
  }

  drawFinder(ctx: CanvasRenderingContext2D, x: number, y: number, cell: number) {
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, cell * 7, cell * 7);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + cell, y + cell, cell * 5, cell * 5);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + cell * 2, y + cell * 2, cell * 3, cell * 3);
  }

  // ── Edit ────────────────────────────────────────────────────────
  openEdit(p: Port) { this.editSnapshot = {...p}; this.editingPort = p; }
  closeEdit()       { if (this.editSnapshot && this.editingPort) Object.assign(this.editingPort, this.editSnapshot); this.editingPort = null; }
  saveEdit()        {
    if (this.editingPort) this.portsSvc.update(this.editingPort.id, this.editingPort);
    this.editingPort = null;
  }

  // ── QR modal ────────────────────────────────────────────────────
  openQR(p: Port)   { this.qrPort = p; this.qrDrawn = false; }
  printQR()         { window.print(); }
  downloadQR() {
    if (!this.qrCanvas?.nativeElement) return;
    const link = document.createElement('a');
    link.download = `QR-${this.qrPort?.id}.png`;
    link.href = this.qrCanvas.nativeElement.toDataURL('image/png');
    link.click();
  }

  // ── Add port ────────────────────────────────────────────────────
  openAddPort() { this.addingPort = true; this.newPort = { id:'', speed:'150', price:'', connector:'CCS', notes:'', images:[] }; }
  closeAdd()    { this.addingPort = false; }
  saveAdd() {
    // New ports start as Pending and stay invisible to drivers until an
    // admin approves them individually on the Manage Ports screen.
    this.portsSvc.add({
      id: this.newPort.id,
      speed: +this.newPort.speed,
      price: this.newPort.price,
      status: 'Pending',
      connector: this.newPort.connector,
      notes: this.newPort.notes,
      images: this.newPort.images,
      ownerName: this.OWNER_NAME,
      stationName: 'Nasr City Fast Charge'
    });
    this.loadPorts();
    this.addingPort = false;
  }

  onImagesSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    Array.from(files).forEach(f => {
      const reader = new FileReader();
      reader.onload = (e) => this.newPort.images.push({ url: e.target?.result as string, name: f.name });
      reader.readAsDataURL(f);
    });
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (!files) return;
    Array.from(files).forEach(f => {
      if (!f.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => this.newPort.images.push({ url: e.target?.result as string, name: f.name });
      reader.readAsDataURL(f);
    });
  }

  removeImage(i: number, event: Event) { event.stopPropagation(); this.newPort.images.splice(i, 1); }

  // ── Fix verification (re-submit KYC docs when OCR previously failed) ─
  openFixVerification() {
    const prevData = this.verificationSvc.getRecord()?.data;
    this.fixVerification = { idFrontUrl: prevData?.idFrontUrl || '', idBackUrl: prevData?.idBackUrl || '', selfieUrl: '' };
    this.fixError = '';
    this.fixingVerification = true;
  }
  closeFixVerification() { this.fixingVerification = false; }

  onFixFileSelected(event: Event, field: 'idFrontUrl' | 'idBackUrl' | 'selfieUrl') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { this.fixVerification[field] = e.target?.result as string; };
    reader.readAsDataURL(file);
  }
  removeFixImage(field: 'idFrontUrl' | 'idBackUrl' | 'selfieUrl', event: Event) {
    event.stopPropagation();
    this.fixVerification[field] = '';
  }
  get fixVerificationComplete(): boolean {
    return !!(this.fixVerification.idFrontUrl && this.fixVerification.idBackUrl && this.fixVerification.selfieUrl);
  }

  resubmitVerification() {
    if (!this.fixVerificationComplete) {
      this.fixError = 'Please upload all three images before resubmitting.';
      return;
    }
    this.fixError = '';
    this.fixOcrRunning = true;
    setTimeout(() => {
      const result = this.verificationSvc.runOcrCheck(this.fixVerification);
      this.ocrResult = result;
      this.fixOcrRunning = false;
      if (result.passed) this.fixingVerification = false;
    }, 1400);
  }
}
