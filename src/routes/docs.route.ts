import express from 'express';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const router = express.Router();

router.get('/', (_req, res) => {
  const readmePath = path.join(__dirname, '..', '..', 'README.md');
  fs.readFile(readmePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading README.md:', err);
      return res.status(500).send('Error loading documentation');
    }

    const htmlContent = marked(data);

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Photo Object Remover API Documentation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          pre {
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
          }
          code {
            font-family: Consolas, monaco, monospace;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
  });
});

export { router as docsRoutes };
