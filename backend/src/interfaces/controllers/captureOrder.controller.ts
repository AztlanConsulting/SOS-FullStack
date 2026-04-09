import type { Request, Response } from 'express';

export default async function captureOrder(req: Request, res: Response) {
  console.log('captureOrder');
  res.status(200).send('Hola');
}
