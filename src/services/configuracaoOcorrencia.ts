import { CampoTabFormulario, ComplementoOcorrencia, RegraCampoOcorrencia, TabTipoConfiguracao, TipoOcorrencia } from '../types';
import { ListaTiposResultado, RegraCampoPayload, SubtipoPayload, TipoPayload } from '../types/configTipoSubtipo';
import { toast } from 'react-toastify';
import {
    ensureSeed,
    tipoOcorrenciaRepo,
    complementoOcorrenciaRepo,
    campoFormularioRepo,
    regraCampoOcorrenciaRepo,
    TipoRecord,
    ComplementoRecord,
} from '../database';

/**
 * Serviço dedicado à configuração de regras dinâmicas de ocorrência (Tipo e Subtipo).
 * Antes conversava com a API (apiBoletim); agora persiste tudo no IndexedDB através
 * da camada `database/`, mantendo o mesmo contrato consumido pelas telas.
 */

// ===== Mapeadores Record (banco) -> Domínio =====

function mapearTabs(payloadTabs: TipoPayload['Tabs']): TabTipoConfiguracao[] {
    return (payloadTabs ?? []).map(tab => ({
        idTab: tab.IdTab,
        ordem: tab.Ordem,
        visualizar: tab.Visualizar,
        editar: tab.Editar,
        cadastrar: tab.Cadastrar,
    }));
}

function tipoDeRecord(record: TipoRecord, complementos: ComplementoOcorrencia[]): TipoOcorrencia {
    return {
        numeroTipo: record.numeroTipo,
        nomeTipo: record.nomeTipo,
        descricaoTipo: record.descricaoTipo,
        tipoInativo: record.tipoInativo,
        tabsConfiguracao: record.tabsConfiguracao ?? [],
        complementoOcorrencia: complementos,
    };
}

function complementoDeRecord(record: ComplementoRecord): ComplementoOcorrencia {
    return {
        numeroTipo: record.numeroTipo,
        numeroComplemento: record.numeroComplemento,
        nomeComplemento: record.nomeComplemento,
        descricaoComplemento: record.descricaoComplemento,
        complementoInativo: record.complementoInativo,
    };
}

// ===== Tipo =====

export async function listarTipos(skip: number, take: number): Promise<ListaTiposResultado> {
    try {
        await ensureSeed();
        const registros = await tipoOcorrenciaRepo.getAll();
        const data = registros.slice(skip, skip + take).map(r => tipoDeRecord(r, []));
        return { data, totalCount: registros.length };
    } catch (err) {
        toast.error('Não foi possível buscar os tipos de ocorrência.');
        throw err;
    }
}

/**
 * Retorna todos os tipos (sem os complementos) em uma única chamada. Usado pelo painel
 * administrativo, que pagina/filtra os resultados na própria tela.
 */
export async function listarTodosTipos(): Promise<TipoOcorrencia[]> {
    try {
        await ensureSeed();
        const registros = await tipoOcorrenciaRepo.getAll();
        return registros.map(r => tipoDeRecord(r, []));
    } catch (err) {
        toast.error('Não foi possível buscar os tipos de ocorrência.');
        throw err;
    }
}

/**
 * Tipos para o fluxo de ocorrência. Traz também os complementos ativos de cada tipo,
 * permitindo montar o seletor de Tipo -> Subtipo na tela de cadastro.
 */
export async function buscarTiposParaFluxo(): Promise<TipoOcorrencia[]> {
    try {
        await ensureSeed();
        const registros = await tipoOcorrenciaRepo.getAll();
        const ativos = registros.filter(r => r.tipoInativo === 0);
        return Promise.all(ativos.map(async r => {
            const complementos = await complementoOcorrenciaRepo.getByTipo(r.numeroTipo);
            return tipoDeRecord(r, complementos.map(complementoDeRecord));
        }));
    } catch (err) {
        toast.error('Não foi possível buscar os tipos de ocorrência.');
        throw err;
    }
}

export async function inserirTipo(payload: TipoPayload): Promise<number> {
    try {
        return await tipoOcorrenciaRepo.create({
            nomeTipo: payload.Nome,
            descricaoTipo: payload.Descricao,
            tipoInativo: payload.Inativo,
            tabsConfiguracao: mapearTabs(payload.Tabs),
        });
    } catch (err) {
        toast.error('Não foi possível salvar o tipo.');
        throw err;
    }
}

export async function atualizarTipo(payload: TipoPayload): Promise<void> {
    try {
        await tipoOcorrenciaRepo.update({
            numeroTipo: payload.NumeroTipo,
            nomeTipo: payload.Nome,
            descricaoTipo: payload.Descricao,
            tipoInativo: payload.Inativo,
            tabsConfiguracao: mapearTabs(payload.Tabs),
        });
    } catch (err) {
        toast.error('Não foi possível atualizar o tipo.');
        throw err;
    }
}

// ===== Subtipo (Complemento) =====

export async function listarSubtipos(numeroTipo: number): Promise<ComplementoOcorrencia[]> {
    try {
        const registros = await complementoOcorrenciaRepo.getByTipo(numeroTipo);
        return registros.map(complementoDeRecord);
    } catch (err) {
        toast.error('Não foi possível buscar os subtipos.');
        throw err;
    }
}

export async function inserirSubtipo(payload: SubtipoPayload): Promise<number> {
    try {
        return await complementoOcorrenciaRepo.create({
            numeroTipo: payload.NumeroTipo,
            nomeComplemento: payload.NomeComplemento,
            descricaoComplemento: payload.DescricaoComplemento,
            complementoInativo: payload.ComplementoInativo,
        });
    } catch (err) {
        toast.error('Não foi possível salvar o subtipo.');
        throw err;
    }
}

export async function atualizarSubtipo(payload: SubtipoPayload): Promise<void> {
    try {
        await complementoOcorrenciaRepo.update({
            numeroComplemento: payload.NumeroComplemento,
            numeroTipo: payload.NumeroTipo,
            nomeComplemento: payload.NomeComplemento,
            descricaoComplemento: payload.DescricaoComplemento,
            complementoInativo: payload.ComplementoInativo,
        });
    } catch (err) {
        toast.error('Não foi possível atualizar o subtipo.');
        throw err;
    }
}

export async function removerSubtipo(_numeroTipo: number, numeroComplemento: number): Promise<void> {
    try {
        // Remove as regras vinculadas ao complemento antes de excluí-lo.
        const regras = await regraCampoOcorrenciaRepo.getByComplemento(numeroComplemento);
        await Promise.all(regras.map(r => regraCampoOcorrenciaRepo.remove(r.id)));
        await complementoOcorrenciaRepo.remove(numeroComplemento);
    } catch (err) {
        toast.error('Não foi possível remover o subtipo.');
        throw err;
    }
}

/**
 * Complementos de um Tipo para o fluxo de ocorrência (DadosOcorrencia). Retorna apenas
 * os complementos ativos.
 */
export async function buscarComplementosPorTipo(numeroTipo: number): Promise<ComplementoOcorrencia[]> {
    try {
        const registros = await complementoOcorrenciaRepo.getByTipo(numeroTipo);
        return registros.filter(r => r.complementoInativo === 0).map(complementoDeRecord);
    } catch (err) {
        toast.error('Não foi possível buscar os complementos de tipo de ocorrências.');
        throw err;
    }
}

// ===== Catálogo de campos =====

export async function listarCamposPorTab(idTab: number): Promise<CampoTabFormulario[]> {
    try {
        await ensureSeed();
        return await campoFormularioRepo.getByTab(idTab);
    } catch (err) {
        toast.error('Não foi possível buscar os campos da aba.');
        throw err;
    }
}

// ===== Regras de campo =====

export async function listarRegras(idTipo: number, idComplemento: number): Promise<RegraCampoOcorrencia[]> {
    try {
        const regras = await regraCampoOcorrenciaRepo.getByComplemento(idComplemento);
        return regras.filter(r => r.idTipoOcorrencia === idTipo);
    } catch (err) {
        toast.error('Não foi possível buscar as regras do subtipo.');
        throw err;
    }
}

function regraDePayload(payload: RegraCampoPayload): Omit<RegraCampoOcorrencia, 'id'> {
    return {
        idCampoFormulario: payload.IdCampoFormulario,
        idTipoOcorrencia: payload.IdTipoOcorrencia,
        idComplementoOcorrencia: payload.IdComplementoOcorrencia,
        cadastroVisivel: payload.CadastroVisivel,
        cadastroEditavel: payload.CadastroEditavel,
        edicaoVisivel: payload.EdicaoVisivel,
        edicaoEditavel: payload.EdicaoEditavel,
        campoObrigatorio: payload.CampoObrigatorio,
        visualizacaoVisivel: payload.VisualizacaoVisivel,
    };
}

export async function criarRegra(payload: RegraCampoPayload): Promise<RegraCampoOcorrencia> {
    try {
        const dados = regraDePayload(payload);
        const id = await regraCampoOcorrenciaRepo.create(dados);
        return { id, ...dados };
    } catch (err) {
        toast.error('Não foi possível criar a regra do campo.');
        throw err;
    }
}

export async function atualizarRegra(payload: RegraCampoPayload): Promise<void> {
    try {
        await regraCampoOcorrenciaRepo.update({ id: payload.Id, ...regraDePayload(payload) });
    } catch (err) {
        toast.error('Não foi possível atualizar a regra do campo.');
        throw err;
    }
}

export async function removerRegra(id: number): Promise<void> {
    try {
        await regraCampoOcorrenciaRepo.remove(id);
    } catch (err) {
        toast.error('Não foi possível remover a regra do campo.');
        throw err;
    }
}

export const ConfiguracaoOcorrenciaService = {
    listarTipos,
    listarTodosTipos,
    buscarTiposParaFluxo,
    inserirTipo,
    atualizarTipo,
    listarSubtipos,
    buscarComplementosPorTipo,
    inserirSubtipo,
    atualizarSubtipo,
    removerSubtipo,
    listarCamposPorTab,
    listarRegras,
    criarRegra,
    atualizarRegra,
    removerRegra,
};
