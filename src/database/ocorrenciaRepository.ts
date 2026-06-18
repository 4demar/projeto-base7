// Repositórios tipados para cada entidade do cadastro de Tipo de Ocorrência.

import {
    TipoOcorrencia,
    ComplementoOcorrencia,
    TabFormulario,
    CampoTabFormulario,
    RegraCampoOcorrencia,
} from '../types';
import { Stores } from './db';
import { add, put, getById, getAll, getAllByIndex, remove } from './crud';

// ===== Tipo de Ocorrência =====
export const tipoOcorrenciaRepo = {
    create: (data: Omit<TipoOcorrencia, 'id'>) => add<TipoOcorrencia>(Stores.tipoOcorrencia, data),
    update: (data: TipoOcorrencia) => put(Stores.tipoOcorrencia, data),
    getById: (id: number) => getById<TipoOcorrencia>(Stores.tipoOcorrencia, id),
    getAll: () => getAll<TipoOcorrencia>(Stores.tipoOcorrencia),
    remove: (id: number) => remove(Stores.tipoOcorrencia, id),
};

// ===== Complemento de Ocorrência =====
export const complementoOcorrenciaRepo = {
    create: (data: Omit<ComplementoOcorrencia, 'id'>) => add<ComplementoOcorrencia>(Stores.complementoOcorrencia, data),
    update: (data: ComplementoOcorrencia) => put(Stores.complementoOcorrencia, data),
    getById: (id: number) => getById<ComplementoOcorrencia>(Stores.complementoOcorrencia, id),
    getAll: () => getAll<ComplementoOcorrencia>(Stores.complementoOcorrencia),
    getByTipoOcorrencia: (idTipoOcorrencia: number) =>
        getAllByIndex<ComplementoOcorrencia>(Stores.complementoOcorrencia, 'idTipoOcorrencia', idTipoOcorrencia),
    remove: (id: number) => remove(Stores.complementoOcorrencia, id),
};

// ===== Tab de Formulário =====
export const tabFormularioRepo = {
    create: (data: Omit<TabFormulario, 'id'>) => add<TabFormulario>(Stores.tabFormulario, data),
    update: (data: TabFormulario) => put(Stores.tabFormulario, data),
    getById: (id: number) => getById<TabFormulario>(Stores.tabFormulario, id),
    getAll: () => getAll<TabFormulario>(Stores.tabFormulario),
    remove: (id: number) => remove(Stores.tabFormulario, id),
};

// ===== Campo de Formulário =====
export const campoFormularioRepo = {
    create: (data: Omit<CampoTabFormulario, 'id'>) => add<CampoTabFormulario>(Stores.campoFormulario, data),
    update: (data: CampoTabFormulario) => put(Stores.campoFormulario, data),
    getById: (id: number) => getById<CampoTabFormulario>(Stores.campoFormulario, id),
    getAll: () => getAll<CampoTabFormulario>(Stores.campoFormulario),
    getByTab: (idTab: number) => getAllByIndex<CampoTabFormulario>(Stores.campoFormulario, 'idTab', idTab),
    remove: (id: number) => remove(Stores.campoFormulario, id),
};

// ===== Regra de Campo por Ocorrência =====
export const regraCampoOcorrenciaRepo = {
    create: (data: Omit<RegraCampoOcorrencia, 'id'>) => add<RegraCampoOcorrencia>(Stores.regraCampoOcorrencia, data),
    update: (data: RegraCampoOcorrencia) => put(Stores.regraCampoOcorrencia, data),
    getById: (id: number) => getById<RegraCampoOcorrencia>(Stores.regraCampoOcorrencia, id),
    getAll: () => getAll<RegraCampoOcorrencia>(Stores.regraCampoOcorrencia),
    getByComplemento: (idComplementoOcorrencia: number) =>
        getAllByIndex<RegraCampoOcorrencia>(Stores.regraCampoOcorrencia, 'idComplementoOcorrencia', idComplementoOcorrencia),
    getByCampo: (idCampoFormulario: number) =>
        getAllByIndex<RegraCampoOcorrencia>(Stores.regraCampoOcorrencia, 'idCampoFormulario', idCampoFormulario),
    remove: (id: number) => remove(Stores.regraCampoOcorrencia, id),
};
