import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

// Guard against unauthenticated users: https://www.youtube.com/watch?v=4dgCArSsyS4

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {

  constructor(public authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    // return false;
    return this.authService.isLoggedIn$.pipe(tap(isloggedin => {
      if (!isloggedin) {
        this.router.navigate(['/']); // go to login page if not logged in
      }
    })
    );
  }


}
