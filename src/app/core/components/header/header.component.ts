import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn$!: Observable<boolean>;
  userName: string | null = null;
  private userSub!: Subscription;
  private _isDarkTheme = false;
  @Input() set isDarkTheme(value: boolean) {
    this._isDarkTheme = value;
    this.cdr.markForCheck(); // Force change detection
  }
  get isDarkTheme(): boolean {
    return this._isDarkTheme;
  }
  @Output() themeToggled = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.userSub = this.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        const user = this.authService.getCurrentUser();
        this.userName = user ? user.userName : null;
      } else {
        this.userName = null;
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.notificationService.success('Logged out successfully');
      this.router.navigate(['/login']);
    });
  }

  onThemeToggle(): void {
    this.themeToggled.emit();
  }
}
