import { Request } from 'express';

export interface Env {
  port: number;
  photAiApiKey: string;
  nodeEnv: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
}

export interface PhotAiInitialResponse {
  order_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'order_complete';
}

export interface PhotAiOrderStatus {
  order_status: string;
  order_status_code: number;
  output_urls: string[];
  error?: string;
}

export interface ObjectReplacementRequest {
  prompt: string;
}

export interface ObjectReplacementExpressRequest extends Request {
  files: {
    source: Express.Multer.File[];
    mask: Express.Multer.File[];
  };
  body: ObjectReplacementRequest;
}

export interface ImageProcessingService {
  replaceObject(
    sourceFile: Express.Multer.File,
    maskFile: Express.Multer.File,
    prompt: string,
  ): Promise<PhotAiOrderStatus>;
}

export interface PhotAiService {
  replaceObject(
    inputImageLink: string,
    maskImageBase64: string,
    prompt: string,
    fileName: string,
  ): Promise<PhotAiInitialResponse>;
  checkOrderStatus(orderId: string): Promise<PhotAiOrderStatus>;
}

export interface ValidatedObjectReplacementRequest {
  prompt: string;
}

export interface ObjectReplacementExpressRequest extends Request {
  files: {
    source: Express.Multer.File[];
    mask: Express.Multer.File[];
  };
  body: ValidatedObjectReplacementRequest;
}

export interface DocsRoute {
  get(path: string, handler: (req: Request, res: Response) => void): void;
}
