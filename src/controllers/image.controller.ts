import { Response, NextFunction } from 'express';
import { ImageProcessingService, ObjectReplacementExpressRequest } from '../types';
import { CustomError } from '../utils/custom-error';

export class ImageController {
  constructor(private imageProcessingService: ImageProcessingService) {}

  async replaceObject(req: ObjectReplacementExpressRequest, res: Response, next: NextFunction) {
    try {
      const sourceFile = req.files.source[0];
      const maskFile = req.files.mask[0];
      const { prompt } = req.body;

      if (!sourceFile || !maskFile || !prompt) {
        throw new CustomError('Missing required files or prompt', 400);
      }

      const result = await this.imageProcessingService.replaceObject(sourceFile, maskFile, prompt);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
