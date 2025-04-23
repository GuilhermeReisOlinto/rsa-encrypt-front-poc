'use client';

import React, { useState } from 'react';
import { encryptPayloadFront } from '../hook/encryptFront';


export default function FormComponent() {
    const [form, setForm] = useState({ nome: '', email: '', senha: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const encrypted = await encryptPayloadFront(form);

        const resp = await fetch('/api/decrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(encrypted),
        });

        console.log("Resposta do servidor:", resp);

    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="nome" placeholder="Nome" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="senha" type="password" placeholder="Senha" onChange={handleChange} />
            <button type="submit">Enviar</button>
        </form>
    );
}
