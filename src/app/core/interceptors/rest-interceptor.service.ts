import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SpinnerOverlayService } from '../services/spinner/spinner-animation.service';
import { inject } from '@angular/core';

export const restInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
    const spinnerOverlayService = inject(SpinnerOverlayService);
    const spinnerSubscription: Subscription = spinnerOverlayService.spinner$.subscribe();

    return next(req).pipe(
        finalize(() => spinnerSubscription.unsubscribe()),
        catchError((err) => {
            return throwError(() => err);
        })
    );
};
