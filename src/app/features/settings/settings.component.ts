import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.settingsForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.settingsForm.patchValue({
        userName: user.userName,
        password: user.password,
      });
    }
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.notificationService.error('Please fill in all required fields');
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.notificationService.error('No user logged in');
      // this.errorMessage = 'No user logged in';
      return;
    }

    const updatedUser = {
      ...user,
      userName: this.settingsForm.value.userName,
      password: this.settingsForm.value.password,
    };

    this.http
      .put(`${this.apiUrl}/${user.id}`, updatedUser)
      .pipe(
        map(() => {
          localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
          // this.successMessage = 'Settings updated successfully';
          this.notificationService.success('Settings updated successfully');
          this.errorMessage = null;
        }),
        catchError(() => {
          // this.errorMessage = 'Failed to update settings';
          this.notificationService.error('Failed to update settings');
          this.successMessage = null;
          return of(null);
        })
      )
      .subscribe();
  }
}
