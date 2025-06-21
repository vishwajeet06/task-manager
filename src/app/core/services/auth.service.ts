import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersUrl = 'http://localhost:3000/users';
  private loggedInUserKey = 'loggedInUser';
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem(this.loggedInUserKey)
  );
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .get<any[]>(`${this.usersUrl}?email=${email}&password=${password}`)
      .pipe(
        map((users) => {
          if (users.length > 0) {
            localStorage.setItem(
              this.loggedInUserKey,
              JSON.stringify(users[0])
            );
            this.isLoggedInSubject.next(true);
            return true;
          }
          return false;
        }),
        catchError(() => of(false))
      );
  }

  register(
    email: string,
    password: string,
    userName: string
  ): Observable<boolean> {
    return this.http.get<any[]>(`${this.usersUrl}?email=${email}`).pipe(
      map((users) => {
        if (users.length > 0) {
          throw new Error('Email already exists');
        }
        return true;
      }),
      catchError(() => of(false)),
      switchMap((canRegister) => {
        if (!canRegister) {
          return of(false); // Wrap the boolean in an Observable
        }
        const newUser = { email, password, role: 'admin', userName };
        return this.http.post<any>(this.usersUrl, newUser).pipe(
          map((user) => {
            localStorage.setItem(this.loggedInUserKey, JSON.stringify(user));
            this.isLoggedInSubject.next(true);
            return true;
          }),
          catchError(() => of(false))
        );
      })
    );
  }

  logout(): Observable<void> {
    localStorage.removeItem(this.loggedInUserKey);
    this.isLoggedInSubject.next(false);
    return of(undefined);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  isAdmin(): Observable<boolean> {
    return this.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          return false;
        }
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
      })
    );
  }

  getCurrentUser(): any {
    const user = localStorage.getItem(this.loggedInUserKey);
    // console.log(user);
    return user ? JSON.parse(user) : null;
  }
}

// login(): Authenticates users by querying json-server with email and password.
// register(): Registers a new user with email, password, and userName, setting role to "admin".
// logout(): Clears the user from localStorage.
// isLoggedIn(): Checks if a user is logged in.
// isAdmin(): Verifies if the logged-in user is an admin.
// getCurrentUser(): Retrieves the current user’s data, including userName, which will be used for features like task comments.
