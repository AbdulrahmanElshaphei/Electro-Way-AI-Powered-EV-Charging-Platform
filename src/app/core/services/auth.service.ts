import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'driver' | 'owner' | 'admin';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  initials: string;
}

const MOCK_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'admin@electroway.app',
    password: 'admin123',
    user: { email: 'admin@electroway.app', name: 'Admin ElectroWay', role: 'admin', initials: 'AD' }
  },
  {
    email: 'owner@electroway.app',
    password: 'owner123',
    user: { email: 'owner@electroway.app', name: 'Station Owner', role: 'owner', initials: 'OW' }
  },
  {
    email: 'driver@electroway.app',
    password: 'driver123',
    user: { email: 'driver@electroway.app', name: 'Alex Carter', role: 'driver', initials: 'AC' }
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'ew_user';

  constructor(private router: Router) {}

  login(email: string, password: string): { success: boolean; message?: string } {
    const found = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Invalid email or password.' };
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(found.user));
    return { success: true };
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getRole(): UserRole | null {
    return this.getCurrentUser()?.role ?? null;
  }

  redirectAfterLogin() {
    const role = this.getRole();
    if (role === 'admin')  this.router.navigate(['/admin']);
    else if (role === 'owner')  this.router.navigate(['/owner']);
    else this.router.navigate(['/dashboard']);
  }
}
