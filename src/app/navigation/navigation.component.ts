import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { observable,of as observableOf  } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  constructor(public authService: AuthService,private router: Router) {}

  logout(){
    this.router.navigate(['/']);
    localStorage.removeItem('token');
    this.authService.isLoggedIn$=observableOf(false);
    // location reload is called to forcefully refresh login form after logout else it doesnt triger ondestroy() second time and dasboard doesnt show after login
    location.reload();
  }
}
