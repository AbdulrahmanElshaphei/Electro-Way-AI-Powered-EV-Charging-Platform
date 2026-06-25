import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnDestroy {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  cameraActive = false;
  detected = false;
  cameraError = '';
  private stream: MediaStream | null = null;

  async startCamera() {
    this.cameraError = '';
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      this.cameraActive = true;
      // give Angular time to render video element
      setTimeout(() => {
        if (this.videoEl?.nativeElement && this.stream) {
          this.videoEl.nativeElement.srcObject = this.stream;
        }
      }, 100);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        this.cameraError = 'Camera permission denied. Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError') {
        this.cameraError = 'No camera found on this device.';
      } else {
        this.cameraError = 'Could not access camera: ' + err.message;
      }
    }
  }

  simulateScan() {
    this.detected = true;
    this.stopCamera();
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    this.cameraActive = false;
  }

  ngOnDestroy() { this.stopCamera(); }
}
