import * as jwt from 'jsonwebtoken';
const KEY = 'SECRET_KEY_GENERATE_32_RANDOM_9876543210';
/**
 *
 * @param payload
 * @returns
 */
export const generateSessionToken = (payload: { [key: string]: any }) => {
  return jwt.sign({ ...payload, issuer: 'SYS_VAULT' }, KEY, {
    // expiresIn: '30d',
  });
};

export const verifySessionToken = (token: string) => {
  return jwt.verify(token, KEY);
};
