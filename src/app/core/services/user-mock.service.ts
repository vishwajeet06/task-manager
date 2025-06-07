import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export interface AccountSettings {
  notificationsEnabled: boolean;
  timezone: string;
}

export interface UserData {
  profile: UserProfile;
  settings: AccountSettings;
}

@Injectable({
  providedIn: 'root',
})
export class UserMockService {
  private userData: UserData = {
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Developer',
    },
    settings: {
      notificationsEnabled: true,
      timezone: 'UTC',
    },
  };

  getUserData(): Observable<UserData> {
    return of(this.userData);
  }

  updateUserData(data: UserData): Observable<UserData> {
    this.userData = { ...this.userData, ...data };
    return of(this.userData);
  }
}
