import request from 'supertest';
import path from 'path';
import fs from 'fs';
import app from '../../app';
import { PhotAiServiceImpl } from '../../services/photo-ai.service';
import cloudinary from '../../config/cloudinary';

// Mock the PhotAiService and cloudinary
jest.mock('../../services/photo-ai.service');
jest.mock('../../config/cloudinary');

describe('Image Processing Integration Tests', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let baseUrl: string;

  beforeAll(() => {
    baseUrl = `http://localhost:${process.env.TEST_PORT}`;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process image replacement successfully', async () => {
    // Mock cloudinary upload
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
      callback(null, { secure_url: 'https://example.com/uploaded-image.jpg' });
      return { end: jest.fn() };
    });

    // Mock PhotAiService methods
    (PhotAiServiceImpl.prototype.replaceObject as jest.Mock).mockResolvedValue({
      order_id: 'test-order-id',
      status: 'pending',
    });

    (PhotAiServiceImpl.prototype.checkOrderStatus as jest.Mock)
      .mockResolvedValueOnce({
        order_status: 'order_processing_started',
        order_status_code: 103,
        output_urls: [],
      })
      .mockResolvedValueOnce({
        order_status: 'order_complete',
        order_status_code: 200,
        output_urls: ['https://example.com/result-image.jpg'],
      });

    const sourcePath = path.join(__dirname, '..', 'fixtures', 'cat_dog_src.jpg');
    const maskPath = path.join(__dirname, '..', 'fixtures', 'cat_dog_msk.jpg');

    const sourceBuffer = await fs.promises.readFile(sourcePath);
    const maskBuffer = await fs.promises.readFile(maskPath);

    const response = await request(baseUrl)
      .post('/api/replace-object')
      .field('prompt', 'Replace with a cat')
      .attach('source', sourceBuffer, 'cat_dog.src.jpg')
      .attach('mask', maskBuffer, 'cat_dog_msk.jpg');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('order_status', 'order_complete');
    expect(response.body).toHaveProperty('order_status_code', 200);
    expect(response.body).toHaveProperty('output_urls');
    expect(response.body.output_urls).toHaveLength(4);
    expect(response.body.output_urls[0]).toMatch(
      /^https:\/\/s3\.us-east-2\.wasabisys\.com\/ai-image-editor-webapp\/object_replacer\/output_image\//,
    );
  }, 10000);

  it('should return 400 if files or prompt are missing', async () => {
    const response = await request(app)
      .post('/api/replace-object')
      .field('prompt', 'Replace with a cat');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Missing required files: source and mask');
  });

  it('should handle errors from PhotAiService', async () => {
    // Mock cloudinary upload
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
      callback(null, { secure_url: 'https://example.com/uploaded-image.jpg' });
      return { end: jest.fn() };
    });

    // Mock PhotAiService to throw an error
    (PhotAiServiceImpl.prototype.replaceObject as jest.Mock).mockRejectedValue(
      new Error('Phot.ai API error'),
    );

    const sourcePath = path.join(__dirname, '..', 'fixtures', 'cat_dog_src.jpg');
    const maskPath = path.join(__dirname, '..', 'fixtures', 'cat_dog_msk.jpg');

    const sourceBuffer = await fs.promises.readFile(sourcePath);
    const maskBuffer = await fs.promises.readFile(maskPath);

    const response = await request(baseUrl)
      .post('/api/replace-object')
      .field('prompt', 'Replace with a cat')
      .attach('source', sourceBuffer, 'cat_dog_src.jpg')
      .attach('mask', maskBuffer, 'cat_dog_msk.jpg')
      .timeout(5000);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.message).toContain('Phot.ai API error');
  });

  it('should handle processing timeout', async () => {
    // Mock cloudinary upload
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
      callback(null, { secure_url: 'https://example.com/uploaded-image.jpg' });
      return { end: jest.fn() };
    });

    // Mock PhotAiService methods
    (PhotAiServiceImpl.prototype.replaceObject as jest.Mock).mockResolvedValue({
      order_id: 'test-order-id',
      status: 'pending',
    });

    // Mock checkOrderStatus to always return 'processing'
    (PhotAiServiceImpl.prototype.checkOrderStatus as jest.Mock).mockResolvedValue({
      order_status: 'order_processing_started',
      order_status_code: 103,
      output_urls: [],
    });

    const sourcePath = path.join(__dirname, '..', 'fixtures', 'cat_dog_src.jpg');
    const maskPath = path.join(__dirname, '..', 'fixtures', 'cat_dog_msk.jpg');

    const sourceBuffer = await fs.promises.readFile(sourcePath);
    const maskBuffer = await fs.promises.readFile(maskPath);

    const response = await request(baseUrl)
      .post('/api/replace-object')
      .field('prompt', 'Replace with a cat')
      .attach('source', sourceBuffer, 'cat_dog_src.jpg')
      .attach('mask', maskBuffer, 'cat_dog_msk.jpg')
      .timeout(5000);

    expect(response.status).toBe(504);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.message).toContain('Processing timed out');
  }, 10000);
});
