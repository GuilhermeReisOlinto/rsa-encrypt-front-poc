import { randomBytes, createCipheriv, publicEncrypt } from 'crypto';
import fs from 'fs';
import path from 'path';


const RSA_PUBLIC_KEY = fs.readFileSync(path.join(process.cwd(), 'public.pem'), 'utf8');

export default function Encrypt(data: string) {
    const stringData = JSON.stringify(data);

    const aesKey = randomBytes(32);
    const iv = randomBytes(16);

    const cipher = createCipheriv('aes-256-gcm', aesKey, iv);
    const encrypted = Buffer.concat([
        cipher.update(stringData, 'utf8'),
        cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    const encryptedKey = publicEncrypt(RSA_PUBLIC_KEY, aesKey);

    return {
        iv: iv.toString('base64'),
        encryptedKey: encryptedKey.toString('base64'),
        authTag: authTag.toString('base64'),
        encrypt: encrypted.toString('base64'),
    }
}