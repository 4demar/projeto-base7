import { toast } from 'react-toastify';
import { UsuarioApi, UsuarioPayload } from '../types';

// Base da API. Em dev, o proxy do Vite (/api) redireciona para a Web API .NET.
const BASE_URL = '/api/Usuario';

async function tratarResposta<T>(resposta: Response): Promise<T> {
    if (!resposta.ok) {
        const texto = await resposta.text().catch(() => '');
        throw new Error(texto || `Erro ${resposta.status}`);
    }
    // 204 No Content não possui corpo.
    if (resposta.status === 204) return undefined as T;
    return resposta.json() as Promise<T>;
}

export async function listarUsuarios(): Promise<UsuarioApi[]> {
    try {
        const resposta = await fetch(`${BASE_URL}/BuscarUsuarios`);
        return await tratarResposta<UsuarioApi[]>(resposta);
    } catch (err) {
        toast.error('Não foi possível carregar os usuários.');
        throw err;
    }
}

export async function criarUsuario(payload: UsuarioPayload): Promise<UsuarioApi> {
    try {
        const resposta = await fetch(`${BASE_URL}/Criar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return await tratarResposta<UsuarioApi>(resposta);
    } catch (err) {
        toast.error('Não foi possível criar o usuário.');
        throw err;
    }
}

export async function atualizarUsuario(codigo: number, payload: UsuarioPayload): Promise<void> {
    try {
        const resposta = await fetch(`${BASE_URL}/Atualizar/${codigo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, codigo }),
        });
        await tratarResposta<void>(resposta);
    } catch (err) {
        toast.error('Não foi possível atualizar o usuário.');
        throw err;
    }
}

export async function removerUsuario(codigo: number): Promise<void> {
    try {
        const resposta = await fetch(`${BASE_URL}/Remover/${codigo}`, { method: 'DELETE' });
        await tratarResposta<void>(resposta);
    } catch (err) {
        toast.error('Não foi possível remover o usuário.');
        throw err;
    }
}

export const UsuarioService = {
    listarUsuarios,
    criarUsuario,
    atualizarUsuario,
    removerUsuario,
};
