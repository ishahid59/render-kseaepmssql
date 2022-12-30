import { Injectable } from '@angular/core';
import {HttpRequest,HttpHandler,HttpEvent,HTTP_INTERCEPTORS, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';


// Interceptor used to add authorization headers to all http calls
//https://www.youtube.com/watch?v=ErToLPJHHLE&list=PLhzRPVQgdM8XDD5abg0helsgs_o5nEF06&index=3


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      headers: request.headers.set('authorization', 'Bearer ' + this.authService.token)
        .set('Accept', 'application/json')
        // .set('Content-Type', 'application/json')
    });
    return next.handle(request);
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
