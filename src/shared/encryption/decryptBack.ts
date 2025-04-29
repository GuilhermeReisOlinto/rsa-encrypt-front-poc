import { privateDecrypt, createDecipheriv, createPrivateKey, constants, KeyObject } from "crypto";
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



export function decryptPayload(payload: { iv: string, encryptedKey: string, encryptedPayload: string }): Record<string, any> {
    const { iv, encryptedKey, encryptedPayload } = payload;

    const ivBuffer = Buffer.from(iv, 'base64');
    const encryptedKeyBuffer = Buffer.from(encryptedKey, 'base64');
    const encryptedBuffer = Buffer.from(encryptedPayload, 'base64');

    const privateKey: KeyObject = importPrivateKey();

    const aesKey: Buffer = decryptAesKey(privateKey, encryptedKeyBuffer);

    const authTag = encryptedBuffer.slice(encryptedBuffer.length - 16);
    const ciphertext = encryptedBuffer.slice(0, encryptedBuffer.length - 16);

    const decipher = createDecipheriv('aes-256-gcm', aesKey, ivBuffer);
    decipher.setAuthTag(authTag);

    const decryptedPayload = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    return JSON.parse(decryptedPayload.toString());
}


function importPrivateKey(): KeyObject {

    const privateKeyPath = path.join(process.cwd(), 'private.pem');
    const privateKeyPem = fs.readFileSync(privateKeyPath, 'utf-8');

    const privateKey = createPrivateKey({
        key: privateKeyPem,
        format: 'pem',
        type: 'pkcs1',
    });

    return privateKey;
}

function decryptAesKey(privateKey: KeyObject, encryptedKeyBuffer: Buffer): Buffer {

    const aesKey = privateDecrypt(
        {
            key: privateKey,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        encryptedKeyBuffer
    );

    if (aesKey.length !== 32) {
        throw new Error(`Invalid AES key length: expected 32 bytes, got ${aesKey.length}`);
    }

    return aesKey;
}