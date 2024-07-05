import { server } from '../app';

export default async () => {
  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    });
  });
};
