import * as bcrypt from 'bcrypt';
const SALT_ROUND = 10;
export const generateBcryptHash = (str: string) => {
  const SALT = bcrypt.genSaltSync(SALT_ROUND);
  return bcrypt.hashSync(str, SALT);
};

export const compareBcryptHash = (str: string, hash: string) => {
  return bcrypt.compareSync(str, hash);
};
