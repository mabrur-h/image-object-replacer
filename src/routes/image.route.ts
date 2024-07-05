import express, { Request, Response, NextFunction } from 'express';
import { ImageController } from '../controllers/image.controller';
import { ImageProcessingServiceImpl } from '../services/image-processing.service';
import { PhotAiServiceImpl } from '../services/photo-ai.service';
import { upload } from '../middleware/upload.middleware';
import { ObjectReplacementExpressRequest } from '../types';
import { validateFiles, validateObjectReplacement } from '../middleware/validation.middleware';

const router = express.Router();

const photAiService = new PhotAiServiceImpl();
const imageProcessingService = new ImageProcessingServiceImpl(photAiService);
const imageController = new ImageController(imageProcessingService);

router.post(
  '/replace-object',
  upload.fields([
    { name: 'source', maxCount: 1 },
    { name: 'mask', maxCount: 1 },
  ]),
  validateFiles,
  validateObjectReplacement,
  (req: Request, res: Response, next: NextFunction) =>
    imageController.replaceObject(req as ObjectReplacementExpressRequest, res, next),
);

export { router as imageRoutes };
