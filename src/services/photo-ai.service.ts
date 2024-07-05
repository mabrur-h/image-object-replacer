import axios from 'axios';
import { env } from '../config/env';
import { PhotAiService, PhotAiInitialResponse, PhotAiOrderStatus } from '../types';
import { CustomError } from '../utils/custom-error';
import Logger from '../utils/logger';

export class PhotAiServiceImpl implements PhotAiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = env.photAiApiKey;
    this.baseUrl = 'https://prodapi.phot.ai/external/api/v2';
  }

  async replaceObject(
    inputImageLink: string,
    maskImageBase64: string,
    prompt: string,
    fileName: string,
  ): Promise<PhotAiInitialResponse> {
    try {
      Logger.info(`Replacing object in image: ${fileName}`);
      const response = await axios.post<PhotAiInitialResponse>(
        `${this.baseUrl}/user_activity/object-replacer`,
        {
          file_name: fileName,
          input_image_link: inputImageLink,
          mask_image: maskImageBase64,
          prompt: prompt,
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      Logger.info(`Object replacement initiated: ${response.data.order_id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Logger.error(`Phot.ai API error: ${error.response?.data.message || error.message}`);
        throw new CustomError(
          `Phot.ai API error: ${error.response?.data.message || error.message}`,
          error.response?.status || 500,
        );
      }
      Logger.error('An unexpected error occurred', error);
      throw new CustomError('An unexpected error occurred', 500);
    }
  }

  async checkOrderStatus(orderId: string): Promise<PhotAiOrderStatus> {
    try {
      Logger.info(`Checking order status: ${orderId}`);
      const response = await axios.get<PhotAiOrderStatus>(
        `${this.baseUrl}/user_activity/order-status?order_id=${orderId}`,
        {
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      );

      Logger.info(`Order status: ${response.data.order_status}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Logger.error(`Phot.ai API error: ${error.response?.data.message || error.message}`);
        throw new CustomError(
          `Phot.ai API error: ${error.response?.data.message || error.message}`,
          error.response?.status || 500,
        );
      }
      Logger.error('An unexpected error occurred', error);
      throw new CustomError('An unexpected error occurred', 500);
    }
  }
}
