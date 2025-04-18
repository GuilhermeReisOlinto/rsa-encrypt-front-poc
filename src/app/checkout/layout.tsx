'use client';

import React, { useState } from 'react';

export default function CheckoutLayout() {
    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: '',
    });
    const [mensagem, setMensagem] = useState('');

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const resp = await fetch('/api/route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        if (resp.ok) {
            setMensagem('Cadastro realizado com sucesso!');
            setForm({ nome: '', email: '', senha: '' });
        } else {
            setMensagem('Erro ao realizar o cadastro.');
        }
    }


    return (
        <div className="max-w-md mx-auto mt-20 p-10 bg-black rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    value={form.nome}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    name="senha"
                    placeholder="Senha"
                    value={form.senha}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Cadastrar
                </button>
            </form>
            {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
        </div>
    );
}