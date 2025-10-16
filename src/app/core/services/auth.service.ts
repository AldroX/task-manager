import { Injectable } from '@angular/core';
interface User {
  username: string;
  password: string;
}

const USERS: User[] = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' },
];
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private currentUser: string | null = null;
  private loggedInKey = 'isLoggedIn';
  private readonly usernameKey = 'username';

  constructor() {
    const loggedIn = localStorage.getItem(this.loggedInKey);
    this.isAuthenticated = loggedIn === 'true';
    this.currentUser = localStorage.getItem(this.usernameKey);
  }

  login(username: string, password: string): boolean {
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      this.isAuthenticated = true;
      this.currentUser = username;
      localStorage.setItem(this.loggedInKey, 'true');
      localStorage.setItem(this.currentUser, username);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem(this.loggedInKey);
    localStorage.removeItem(this.usernameKey);
  }
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUser(): string | null {
    return this.currentUser;
  }

  getUsername(): string {
    return this.currentUser || 'Usuario';
  }
}
