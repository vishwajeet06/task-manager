import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadActivities } from './core/state/activity.actions';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isDarkTheme = false;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadActivities());
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
}
