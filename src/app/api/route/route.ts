import { NextRequest, NextResponse } from 'next/server';
import Encrypt from '../../hook/encryptBack';
import { Decrypt } from '../../hook/decryptBack';

export async function POST(req: NextRequest) {
    const dados = await req.json();

    const dataEncrypt = Encrypt(dados);

    if (!dados.nome || !dados.email || !dados.senha) {
        return NextResponse.json({ erro: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const dataDecrypt = Decrypt(dataEncrypt.encrypt, dataEncrypt.encryptedKey, dataEncrypt.iv, dataEncrypt.authTag);

    return NextResponse.json({ mensagem: 'Usuário cadastrado com sucesso' });
}
