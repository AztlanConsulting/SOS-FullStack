import { usersDataAccess } from '@interfaces/data-access/users.data-access';
import type { Request, Response } from 'express';

async function loginController(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(401).send('No password or username provided');
  }
}

export default loginController;
