# Photo Object Replacer API

## Description

The Photo Object Replacer API is a  tool that enables users to remove specific objects from images and replace them with new objects. This service integrates with the Phot.ai API to provide high-quality object replacement in images.

## Features

- Object removal and replacement in images
- Integration with Phot.ai API
- Error handling and logging
- Input validation
- TypeScript support
- ESLint and Prettier for code quality
- Jest for testing

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- A Phot.ai API key

## Installation

1. Clone the repository:
```
git clone https://github.com/mabrur-h/image-object-replacer.git
```

2. Navigate to the project directory:
```
cd image-object-replacer
```

3. Install the dependencies:
```
npm install
```

4. Create a `.env` file in the root directory and add your Phot.ai API key:
```
# Server configuration
PORT=3000
TEST_PORT=3001

# Phot.ai API configuration
PHOT_AI_API_KEY=your_photai_api_key

# cloudinary API configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret_key
```

## Usage

To start the server in development mode: `npm run dev`

The API will be available at `http://localhost:3000`.

## API Endpoints

### Replace Object in Image

- **URL**: `/api/replace-object`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `source`: The source image file
  - `mask`: The mask image file
  - `prompt`: The text prompt for the replacement object

#### Success Response

- **Code**: 200
- **Content**: 
  ```json
  {
    "order_status": "order_complete",
    "order_status_code": 200,
    "output_urls": [
      "https://s3.us-east-2.wasabisys.com/ai-image-editor-webapp/object_replacer/output_image/2024-07-05T13:19:22.093Z/3dd8u9t_2024-07-05T13:19:22.093Z_output_0.webp",
      "https://s3.us-east-2.wasabisys.com/ai-image-editor-webapp/object_replacer/output_image/2024-07-05T13:19:22.093Z/3dd8u9t_2024-07-05T13:19:22.093Z_output_1.webp",
      "https://s3.us-east-2.wasabisys.com/ai-image-editor-webapp/object_replacer/output_image/2024-07-05T13:19:22.093Z/3dd8u9t_2024-07-05T13:19:22.093Z_output_2.webp",
      "https://s3.us-east-2.wasabisys.com/ai-image-editor-webapp/object_replacer/output_image/2024-07-05T13:19:22.093Z/3dd8u9t_2024-07-05T13:19:22.093Z_output_3.webp"
    ]
  }
  ```

### Error Response

- **Code**: 400 or 500
- **Content**: 
  ```json
  {
    "status": "error",
    "message": "Error description"
  }
  ```

### Development
#### Running Tests
To run the test suite: `npm test`
To run tests with coverage: `npm run test:coverage`

#### Linting
To run Eslint: `npm run lint`
To automatically fix ESLint issues: `npm run lint:fix`

#### Formatting
To format the code with Prettier: `npm run format`
To check if all files are formatted correctly: `npm run check-format`

#### Building for Production
To build the project for production: `npm run build`
This will create a dist directory with the compiled JavaScript files.