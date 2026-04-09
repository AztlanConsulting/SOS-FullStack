import type { Request, Response } from 'express';

export default async function createOrder(req: Request, res: Response) {
  console.log('Hola que hace');
  res.status(200).send('Hola');
}
