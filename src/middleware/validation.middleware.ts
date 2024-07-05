import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { CustomError } from '../utils/custom-error';

const objectReplacementSchema = Joi.object({
  prompt: Joi.string().required().min(3).max(500),
});

export const validateObjectReplacement = (req: Request, res: Response, next: NextFunction) => {
  const { error } = objectReplacementSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    throw new CustomError(errorMessage, 400);
  }
  next();
};

export const validateFiles = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files || !files['source'] || !files['mask']) {
    throw new CustomError('Missing required files: source and mask', 400);
  }
  if (files['source'].length !== 1 || files['mask'].length !== 1) {
    throw new CustomError('Exactly one source file and one mask file are required', 400);
  }
  next();
};
