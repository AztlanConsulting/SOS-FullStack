function genRandomPassword(len: number) {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numChars = '0123456789';

  const chars = lower + upperChars + numChars;

  let pass = '';
  for (let i = 0; i < len; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }

  return pass;
}

export default genRandomPassword;
