import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OwnerVerificationService, OwnerVerificationData, OcrResult } from '../../services/owner-verification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  step = 1;
  type: 'driver' | 'owner' | '' = '';
  fullName = ''; email = ''; phone = ''; password = ''; confirmPassword = '';
  errorMsg = '';

  // Egyptian mobile format: 01 followed by 9 digits (11 digits total)
  private readonly EG_PHONE_RE = /^01[0-9]{9}$/;

  // ── Owner verification (Step 3) ──────────────────────────────────────
  verification: OwnerVerificationData = { idFrontUrl: '', idBackUrl: '', selfieUrl: '' };
  verifyError = '';
  ocrRunning = false;
  ocrResult: OcrResult | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private verificationSvc: OwnerVerificationService
  ) {}

  nextStep() { if (this.type) this.step = 2; }

  // Step 2 -> Step 3 (owner only) or finish (driver)
  continueFromDetails() {
    if (!this.fullName || !this.email || !this.phone || !this.password || !this.confirmPassword) {
      this.errorMsg = 'Please fill in all fields.';
      return;
    }
    if (!this.EG_PHONE_RE.test(this.phone)) {
      this.errorMsg = 'Please enter a valid Egyptian phone number (e.g. 01XXXXXXXXX).';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Passwords do not match.';
      return;
    }
    this.errorMsg = '';
    if (this.type === 'owner') {
      this.step = 3;
    } else {
      this.finishRegistration();
    }
  }

  // ── Image pickers for ID front / back / selfie ──────────────────────
  onFileSelected(event: Event, field: 'idFrontUrl' | 'idBackUrl' | 'selfieUrl') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { this.verification[field] = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  removeImage(field: 'idFrontUrl' | 'idBackUrl' | 'selfieUrl', event: Event) {
    event.stopPropagation();
    this.verification[field] = '';
  }

  get verificationComplete(): boolean {
    return !!(this.verification.idFrontUrl && this.verification.idBackUrl && this.verification.selfieUrl);
  }

  // ── Submit verification docs -> run mock OCR -> create account ──────
  submitVerification() {
    if (!this.verificationComplete) {
      this.verifyError = 'Please upload all three images (front ID, back ID, and a selfie) to continue.';
      return;
    }
    this.verifyError = '';
    this.ocrRunning = true;
    this.ocrResult = null;

    // Simulate OCR/face-match processing delay
    setTimeout(() => {
      this.ocrResult = this.verificationSvc.runOcrCheck(this.verification);
      this.ocrRunning = false;
      // Account is created regardless of OCR outcome — the dashboard will
      // gate features based on verification status (handled in OwnerDashboard).
      this.finishRegistration();
    }, 1400);
  }

  private finishRegistration() {
    // For demo: auto-login as driver or owner based on selection
    const demoEmail = this.type === 'driver' ? 'driver@electroway.app' : 'owner@electroway.app';
    const demoPass  = this.type === 'driver' ? 'driver123' : 'owner123';
    this.auth.login(demoEmail, demoPass);
    this.auth.redirectAfterLogin();
  }
}
