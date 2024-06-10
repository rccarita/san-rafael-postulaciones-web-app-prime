import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CommonService } from '../services/common.service';

export const PostulateGuard: CanActivateFn = () => {
    const service = inject(CommonService);
    const router = inject(Router);

    let token = service.getToken();
    if (token == null) {
        router.navigateByUrl('/login');
    }
    return !!((token !== null && token !== undefined));
};
