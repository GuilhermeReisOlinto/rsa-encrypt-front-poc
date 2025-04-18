import { privateDecrypt, createDecipheriv } from "crypto";
import fs from 'fs';
import path from 'path';

const RSA_PRIVATE_KEY = fs.readFileSync(path.join(process.cwd(), 'private.pem'), 'utf8');

export function Decrypt(
    encryptData: string,
    encryptedKey: string,
    iv: string,
    authTag: string
) {
    const aesKey = privateDecrypt(
        {
            key: RSA_PRIVATE_KEY,
            passphrase: '',
        },
        Buffer.from(encryptedKey, 'base64')
    )

    const decipher = createDecipheriv(
        'aes-256-gcm',
        aesKey,
        Buffer.from(iv, 'base64')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptData, 'base64')),
        decipher.final()
    ]);

    return decrypted.toString('utf8');
}
