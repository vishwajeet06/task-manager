import { MatCardModule } from '@angular/material/card';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import {
  UserData,
  UserProfile,
  AccountSettings,
  UserMockService,
} from '../../core/services/user-mock.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatCardModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  userData$!: Observable<UserData>;
  profile: UserProfile = { name: '', email: '', role: '' };
  settings: AccountSettings = { notificationsEnabled: true, timezone: 'UTC' };

  constructor(private userService: UserMockService) {}

  ngOnInit() {
    this.userData$ = this.userService.getUserData();
    this.userData$.subscribe((data) => {
      this.profile = { ...data.profile };
      this.settings = { ...data.settings };
    });
  }

  saveSettings() {
    const updatedData: UserData = {
      profile: this.profile,
      settings: this.settings,
    };
    this.userService.updateUserData(updatedData).subscribe();
  }
}
