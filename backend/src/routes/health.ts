import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      service: 'campuspulse-backend',
      timestamp: new Date().toISOString()
    },
    error: null
  });
});

export default router;
