import * as crypto from 'crypto';
const algorithm = 'aes-256-cbc';
const key = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
export const encryptText = (text: string, encryptionKey?: string) => {
  const initVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    encryptionKey || key,
    initVector,
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  // console.log(text);
  return {
    iv: initVector.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export const decryptText = (
  iv: string,
  content: string,
  encryptionKey?: string,
) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    encryptionKey || key,
    Buffer.from(iv, 'hex'),
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString();
};
