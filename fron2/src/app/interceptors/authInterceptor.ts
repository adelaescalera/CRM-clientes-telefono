// import { HttpInterceptorFn } from '@angular/common/http';
 
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('auth_token');
 
//   if (token) {
//     const cloned = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return next(cloned);
//   }
 
//   return next(req);
// };



import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const token = localStorage.getItem('authToken');
    const cloned = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;
    return next(cloned);
};
 