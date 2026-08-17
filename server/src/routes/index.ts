import { Router } from 'express';
import healthRoute from './healthRoute';

const router = Router();

// Mount Health Route
router.use('/', healthRoute);

export default router;
