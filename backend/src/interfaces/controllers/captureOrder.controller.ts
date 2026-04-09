import type { Request, Response } from 'express';

export default async function captureOrder(req: Request, res: Response) {
  res.status(500).send('Unimplemented');
}
