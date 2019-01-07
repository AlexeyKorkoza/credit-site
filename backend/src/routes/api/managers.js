import { Router } from 'express';

import {
    createNewManager,
    updateAttributesManager,
    updateProfileManager,
    changePassword,
    blockManager,
} from '../../controllers/api/managers';
import { jwtMiddleware } from '../../middlewares/jwt';
import authMiddleware from '../../middlewares/auth';

const router = Router();

router.post('/managers',
    jwtMiddleware,
    authMiddleware.isAdmin,
    createNewManager);

router.put('/managers/:id',
    jwtMiddleware,
    authMiddleware.isManager,
    updateAttributesManager);

router.put('/managers/update-profile',
    jwtMiddleware,
    authMiddleware.isAdmin,
    updateProfileManager);

router.put('/managers/change-password',
    jwtMiddleware,
    authMiddleware.isAdmin,
    changePassword);

router.put('/managers/block',
    jwtMiddleware,
    authMiddleware.isAdmin,
    blockManager);

export default router;
