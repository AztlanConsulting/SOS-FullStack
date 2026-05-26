import type { Request } from 'express';

const LOCALHOST_GEO_IP = process.env.LOCALHOST_GEO_IP ?? '187.190.0.1';

export function resolveRequestIp(req: Request): string {
  const rawIp =
    (req.headers['x-forwarded-for'] as string) ??
    req.socket.remoteAddress ??
    LOCALHOST_GEO_IP;

  const ip = rawIp.split(',')[0].trim().replace('::ffff:', '');

  if (ip === '127.0.0.1' || ip === '::1') {
    return LOCALHOST_GEO_IP;
  }

  return ip;
}
