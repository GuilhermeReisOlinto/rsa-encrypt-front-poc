export async function encryptPayloadFront(data: Record<string, any>) {

    const pem: string = await importPublicKey();
    const bufferPem: Uint8Array<ArrayBuffer> = await formatPem(pem);
    const publicKey = await generateKey(bufferPem);
    const { aesKey, iv } = await generateAesKeyAndIv();

    const textEncoder = new TextEncoder();
    const encodedData = textEncoder.encode(JSON.stringify(data));

    const encryptedContentData = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        aesKey,
        encodedData
    );

    const encryptedAesKey = await encryptAesKey(aesKey, publicKey);

    return {
        iv: bufferToBase64(iv),
        encryptedKey: bufferToBase64(encryptedAesKey),
        encryptedPayload: bufferToBase64(encryptedContentData),
    };
}

async function importPublicKey(): Promise<string> {

    const res = await fetch('/api/public-key');
    const { pem } = await res.json();

    return pem;
}

async function formatPem(pem: string): Promise<Uint8Array<ArrayBuffer>> {

    const b64 = pem
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\s/g, '');

    const binary = atob(b64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }

    return buffer;
}

async function generateKey(bufferPem: Uint8Array<ArrayBuffer>): Promise<any> {

    const publicKey = await crypto.subtle.importKey(
        'spki',
        bufferPem,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
    );

    return publicKey;
}

async function generateAesKeyAndIv(): Promise<{ aesKey: CryptoKey; iv: Uint8Array }> {

    const aesKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));

    return { aesKey, iv };
}

async function encryptAesKey(aesKey: CryptoKey, publicKey: CryptoKey): Promise<Uint8Array> {

    const rawAesKey = await crypto.subtle.exportKey('raw', aesKey);
    const encryptedAesKey = await crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        publicKey,
        rawAesKey
    );

    return new Uint8Array(encryptedAesKey);
}

function bufferToBase64(buffer: any): string {

    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}
