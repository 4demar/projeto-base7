/** Ocorrência salva no localStorage (simulação de persistência). */
export interface OcorrenciaSalva {
    id: string;
    tipoNome: string;
    subtipoNome: string;
    numeroTipo: number;
    numeroComplemento: number;
    status: 'rascunho' | 'finalizada';
    valores: Record<string, string>;
    criadaEm: string;
}

const STORAGE_KEY = 'devportal_ocorrencias';

export function carregarOcorrencias(): OcorrenciaSalva[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

export function salvarOcorrencias(lista: OcorrenciaSalva[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}
