import { Router } from 'express';
import { IncidentsController } from '../controllers/incidentsController';

const router = Router();

router.get('/', IncidentsController.getIncidents);
router.get('/:id', IncidentsController.getIncidentById);
router.patch('/:id/status', IncidentsController.updateStatus);

export default router;
