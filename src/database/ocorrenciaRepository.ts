// Repositórios tipados para o cadastro dinâmico de ocorrências (IndexedDB).
// O catálogo de campos é seed fixo; tipos, complementos e regras são configuração do usuário.

import { CampoTabFormulario, RegraCampoOcorrencia, TabTipoConfiguracao } from '../types';
import { Stores } from './db';
import { add, put, getByKey, getAll, getAllByIndex, remove } from './crud';

// Registro persistido do Tipo (sem a lista de complementos, buscada à parte).
export interface TipoRecord {
    numeroTipo: number;
    nomeTipo: string;
    descricaoTipo: string;
    tipoInativo: number;
    tabsConfiguracao: TabTipoConfiguracao[];
}

// Registro persistido do Complemento (Subtipo).
export interface ComplementoRecord {
    numeroComplemento: number;
    numeroTipo: number;
    nomeComplemento: string;
    descricaoComplemento: string;
    complementoInativo: number;
}

// Catálogo (seed) de campos por aba (idTab). Ids fixos, conforme o projeto de origem.
const listaCamposBase: CampoTabFormulario[] = [
    { id: 1, idTab: 0, nome: 'auxilioCentral', label: 'Com auxílio da central de monitoramento' },
    { id: 2, idTab: 0, nome: 'statusOcorrencia', label: 'Status da ocorrência' },
    { id: 3, idTab: 0, nome: 'numeroBoletimOcorrencia', label: 'Número B.O da polícia' },
    
    { id: 7, idTab: 1, nome: 'tituloOcorrencia', label: 'Título da ocorrência' },
    { id: 8, idTab: 1, nome: 'descricaoOcorrencia', label: 'Descrição da ocorrência' },
    { id: 9, idTab: 1, nome: 'providenciasTomadas', label: 'Providências tomadas' },
    { id: 10, idTab: 2, nome: 'produto', label: 'Produto' },
    { id: 11, idTab: 2, nome: 'valor', label: 'Valor' },
    { id: 12, idTab: 3, nome: 'placaVeiculo', label: 'Placa do veículo' },
    { id: 13, idTab: 3, nome: 'tipoVeiculo', label: 'Tipo Veículo' },
    { id: 14, idTab: 3, nome: 'editarVeiculo', label: 'Editar veículo' },
    { id: 15, idTab: 3, nome: 'excluirVeiculo', label: 'Excluir veículo' },
    { id: 16, idTab: 4, nome: 'envolvido', label: 'Envolvido' },
    { id: 17, idTab: 5, nome: 'anexo', label: 'Anexar Arquivo' },
    { id: 18, idTab: 6, nome: 'nomeClienteDevolucao', label: 'Nome completo' },
    { id: 19, idTab: 6, nome: 'cpfClienteDevolucao', label: 'CPF' },
    { id: 20, idTab: 7, nome: 'parecerAnalise', label: 'Parecer da análise' },
    { id: 21, idTab: 7, nome: 'responsavelAnalise', label: 'Responsável pela análise' },
    { id: 22, idTab: 7, nome: 'statusAnalise', label: 'Status da análise' },
    { id: 23, idTab: 8, nome: 'textoAnotacao', label: 'Insira as anotações' },
    { id: 24, idTab: 8, nome: 'listaAnotacoes', label: 'Lista de anotações' },
    { id: 25, idTab: 9, nome: 'ocorrenciasRelacionada', label: 'Ocorrências relacionada' },
];

// Garante o seed do catálogo de campos no IndexedDB (executa uma única vez).
let seedPromise: Promise<void> | null = null;
export function ensureSeed(): Promise<void> {
    if (!seedPromise) {
        seedPromise = (async () => {
            const existentes = await getAll<CampoTabFormulario>(Stores.campoFormulario);
            if (existentes.length === 0) {
                for (const campo of listaCamposBase) {
                    await put<CampoTabFormulario>(Stores.campoFormulario, campo);
                }
            }
        })();
    }
    return seedPromise;
}

// ===== Tipo de Ocorrência =====
export const tipoOcorrenciaRepo = {
    create: (data: Omit<TipoRecord, 'numeroTipo'>) => add<Omit<TipoRecord, 'numeroTipo'>>(Stores.tipoOcorrencia, data),
    update: (data: TipoRecord) => put<TipoRecord>(Stores.tipoOcorrencia, data),
    getById: (numeroTipo: number) => getByKey<TipoRecord>(Stores.tipoOcorrencia, numeroTipo),
    getAll: () => getAll<TipoRecord>(Stores.tipoOcorrencia),
    remove: (numeroTipo: number) => remove(Stores.tipoOcorrencia, numeroTipo),
};

// ===== Complemento (Subtipo) =====
export const complementoOcorrenciaRepo = {
    create: (data: Omit<ComplementoRecord, 'numeroComplemento'>) =>
        add<Omit<ComplementoRecord, 'numeroComplemento'>>(Stores.complementoOcorrencia, data),
    update: (data: ComplementoRecord) => put<ComplementoRecord>(Stores.complementoOcorrencia, data),
    getById: (numeroComplemento: number) => getByKey<ComplementoRecord>(Stores.complementoOcorrencia, numeroComplemento),
    getAll: () => getAll<ComplementoRecord>(Stores.complementoOcorrencia),
    getByTipo: (numeroTipo: number) =>
        getAllByIndex<ComplementoRecord>(Stores.complementoOcorrencia, 'numeroTipo', numeroTipo),
    remove: (numeroComplemento: number) => remove(Stores.complementoOcorrencia, numeroComplemento),
};

// ===== Campo de Formulário (catálogo seed) =====
export const campoFormularioRepo = {
    getAll: () => getAll<CampoTabFormulario>(Stores.campoFormulario),
    getByTab: (idTab: number) => getAllByIndex<CampoTabFormulario>(Stores.campoFormulario, 'idTab', idTab),
};

// ===== Regra de Campo por Ocorrência =====
export const regraCampoOcorrenciaRepo = {
    create: (data: Omit<RegraCampoOcorrencia, 'id'>) => add<Omit<RegraCampoOcorrencia, 'id'>>(Stores.regraCampoOcorrencia, data),
    update: (data: RegraCampoOcorrencia) => put<RegraCampoOcorrencia>(Stores.regraCampoOcorrencia, data),
    getById: (id: number) => getByKey<RegraCampoOcorrencia>(Stores.regraCampoOcorrencia, id),
    getAll: () => getAll<RegraCampoOcorrencia>(Stores.regraCampoOcorrencia),
    getByComplemento: (idComplementoOcorrencia: number) =>
        getAllByIndex<RegraCampoOcorrencia>(Stores.regraCampoOcorrencia, 'idComplementoOcorrencia', idComplementoOcorrencia),
    getByTipo: (idTipoOcorrencia: number) =>
        getAllByIndex<RegraCampoOcorrencia>(Stores.regraCampoOcorrencia, 'idTipoOcorrencia', idTipoOcorrencia),
    remove: (id: number) => remove(Stores.regraCampoOcorrencia, id),
};
