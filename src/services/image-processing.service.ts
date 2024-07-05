import { ImageProcessingService, PhotAiService, PhotAiOrderStatus } from '../types';
import cloudinary from '../config/cloudinary';
import Logger from '../utils/logger';
import { CustomError } from '../utils/custom-error';

export class ImageProcessingServiceImpl implements ImageProcessingService {
  constructor(private photAiService: PhotAiService) {}

  async replaceObject(
    sourceFile: Express.Multer.File,
    maskFile: Express.Multer.File,
    prompt: string,
  ): Promise<PhotAiOrderStatus> {
    const maskBase64 = maskFile.buffer.toString('base64');
    const sourceImageUrl = await this.uploadFileAndGetUrl(sourceFile);

    const initialResponse = await this.photAiService.replaceObject(
      sourceImageUrl,
      maskBase64,
      prompt,
      sourceFile.originalname,
    );
    Logger.info(`Object replacement initiated: ${initialResponse.order_id}`);

    return this.pollOrderStatus(initialResponse.order_id);
  }

  private async pollOrderStatus(
    orderId: string,
    maxAttempts = 20,
    delayMs = 5000,
  ): Promise<PhotAiOrderStatus> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.photAiService.checkOrderStatus(orderId);
      Logger.info(`Order status: ${status.order_status}`);

      if (status.order_status === 'order_complete' || status.order_status === 'failed') {
        return status;
      }

      if (i < maxAttempts - 1) {
        Logger.info(`Waiting ${delayMs}ms before next status check...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new CustomError('Processing timed out', 504);
  }

  private async uploadFileAndGetUrl(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'object-replacer' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
