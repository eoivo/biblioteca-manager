import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.isLoggedIn().pipe(
        take(1),
        map(isLoggedIn => {
            if (!isLoggedIn) {
                return router.createUrlTree(['/login']);
            }
            return true;
        })
    );
};
