import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    const filePath = path.join(process.cwd(), 'public.pem');

    try {
        const pem = await fs.readFile(filePath, 'utf8');

        return NextResponse.json({ pem });
    } catch (error) {
        console.error('Erro ao ler a chave pública:', error);
        return NextResponse.json({ error: 'Erro ao carregar a chave pública' }, { status: 500 });
    }
}
