import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CommonService } from '../services/common.service';

export const NoAuthGuard: CanActivateFn = () => {
    const service = inject(CommonService);
    const router = inject(Router);

    const token = service.getToken();
        if(token!== null && token!== undefined){
            router.navigateByUrl('/postulation');
        }
        return !((token!== null && token!== undefined));
};
