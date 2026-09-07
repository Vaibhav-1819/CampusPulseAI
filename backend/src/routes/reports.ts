import { Router } from 'express';
import { ReportsController } from '../controllers/reportsController';

const router = Router();

router.post('/', ReportsController.createReport);
router.get('/', ReportsController.getReports);
router.get('/:id', ReportsController.getReportById);

export default router;
