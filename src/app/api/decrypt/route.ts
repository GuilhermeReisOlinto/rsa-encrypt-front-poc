import { NextRequest, NextResponse } from 'next/server';
import { decryptPayload } from '../../../shared/encryption/decryptBack';

export async function POST(req: NextRequest) {
    const dados = await req.json();

    const dataDecrypt: Record<string, any> = decryptPayload(dados);

    return NextResponse.json({ dataDecrypt });
}    