import { NextRequest, NextResponse } from 'next/server';
import Encrypt from '../encrypt/encrypt';

export async function POST(req: NextRequest) {
    const dados = await req.json();

    const dataEncrypt = Encrypt(dados);

    // Aqui você pode salvar no banco de dados, validar, etc.
    console.log('Dados recebidos:', dataEncrypt);

    // Simula uma verificação simples
    if (!dados.nome || !dados.email || !dados.senha) {
        return NextResponse.json({ erro: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Sucesso
    return NextResponse.json({ mensagem: 'Usuário cadastrado com sucesso' });
}
