import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));

  return bcrypt.hash(password, salt);
}
