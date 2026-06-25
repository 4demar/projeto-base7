import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ConfiguracaoOcorrenciaService } from "../services/configuracaoOcorrencia";
import { CampoTabFormulario, RegraCampoOcorrencia } from "../types";

// Canal de sincronização entre abas/janelas da mesma origem. Permite que a tela de
// administração avise as telas de ocorrência (em outra janela) que as regras de um
// Subtipo mudaram, para que invalidem o cache local e recarreguem na próxima abertura.
const CANAL_REGRAS = "regras-formulario-ocorrencia";

type MensagemRegrasAlteradas = {
    tipo: "regras-alteradas";
    idTipo: number;
    idComplemento: number;
};

/**
 * Fluxos da tela de ocorrência. Cada fluxo possui sua própria configuração de
 * visibilidade/edição na RegraCampoOcorrencia (UTLBO07), e a obrigatoriedade é
 * controlada por uma única flag CampoObrigatorio (compartilhada entre os fluxos):
 * - Cadastro:     CadastroVisivel / CadastroEditavel
 * - Edicao:       EdicaoVisivel   / EdicaoEditavel
 * - Visualizacao: VisualizacaoVisivel (sempre somente leitura)
 * - Obrigatório:  CampoObrigatorio (aplicado em Cadastro/Edição quando o campo é visível)
 */
export enum FluxoOcorrencia {
    Cadastro = "cadastro",
    Edicao = "edicao",
    Visualizacao = "visualizacao",
}

type RegrasFormularioContextType = {
    /** Subtipo (Complemento) cujas regras estão ativas no momento. */
    complementoSelecionado: number | null;

    /**
     * Carrega (com cache) as regras do Subtipo informado e o define como ativo.
     * Se as regras já estiverem em cache, não refaz a requisição.
     */
    carregarRegras: (idTipo: number, idComplemento: number) => Promise<void>;

    /** Remove o Subtipo ativo (nenhuma regra aplicada), mantendo o cache. */
    limparRegras: () => void;

    /**
     * Invalida o cache de um Subtipo e avisa as demais abas/janelas (via BroadcastChannel)
     * para que também invalidem o cache local. Use após alterar regras no admin.
     */
    invalidarComplemento: (idTipo: number, idComplemento: number) => void;

    /**
     * Carrega (com cache) o catálogo de campos de uma aba (UTLBO06) e indexa
     * os ids por nome técnico. Se já estiver em cache, não refaz a requisição.
     */
    carregarCamposTab: (idTab: number) => Promise<void>;

    /** Campos do catálogo de uma aba (vazio enquanto não carregado). */
    obterCamposTab: (idTab: number) => CampoTabFormulario[];

    /** Resolve o id do catálogo de um campo pelo nome técnico dentro de uma aba. */
    resolverIdCampo: (idTab: number, nome: string) => number | undefined;

    campoVisivel: (idCampo: number, fluxo: FluxoOcorrencia) => boolean;
    campoEditavel: (idCampo: number, fluxo: FluxoOcorrencia) => boolean;
    campoObrigatorio: (idCampo: number, fluxo: FluxoOcorrencia) => boolean;
};

type ProviderProps = {
    children: ReactNode;
};

const RegrasFormularioContext = createContext<RegrasFormularioContextType | undefined>(undefined);

export const RegrasFormularioProvider = ({ children }: ProviderProps) => {
    // Cache de regras por Subtipo (Complemento) e de campos por aba. A chave do cache de
    // regras combina Tipo + Complemento, pois o NumeroComplemento se repete entre tipos
    // diferentes (dados legados) — usar só o complemento misturaria regras de outros tipos.
    const regrasPorComplemento = useRef<Record<string, RegraCampoOcorrencia[]>>({});
    const camposPorTab = useRef<Record<number, CampoTabFormulario[]>>({});
    const mapaCamposPorTab = useRef<Record<number, Record<string, number>>>({});

    const [complementoSelecionado, setComplementoSelecionado] = useState<number | null>(null);
    // Chave (tipo-complemento) do conjunto de regras ativo no momento.
    const [chaveSelecionada, setChaveSelecionada] = useState<string | null>(null);
    // Contador usado apenas para forçar re-render quando o catálogo de campos é carregado.
    const [, setVersaoCampos] = useState(0);

    const montarChave = (idTipo: number, idComplemento: number): string => `${idTipo}-${idComplemento}`;

    const carregarRegras = useCallback(async (idTipo: number, idComplemento: number): Promise<void> => {
        const chave = montarChave(idTipo, idComplemento);
        if (regrasPorComplemento.current[chave] === undefined) {
            const regrasCarregadas = await ConfiguracaoOcorrenciaService.listarRegras(idTipo, idComplemento);
            regrasPorComplemento.current[chave] = regrasCarregadas ?? [];
        }
        setComplementoSelecionado(idComplemento);
        setChaveSelecionada(chave);
    }, []);

    const limparRegras = useCallback((): void => {
        setComplementoSelecionado(null);
        setChaveSelecionada(null);
    }, []);

    const invalidarCacheLocal = useCallback((idTipo: number, idComplemento: number): void => {
        delete regrasPorComplemento.current[montarChave(idTipo, idComplemento)];
    }, []);

    const invalidarComplemento = useCallback((idTipo: number, idComplemento: number): void => {
        invalidarCacheLocal(idTipo, idComplemento);
        // Propaga a invalidação para as outras abas/janelas (ex.: a tela de ocorrência
        // aberta em paralelo à de administração).
        try {
            const canal = new BroadcastChannel(CANAL_REGRAS);
            const mensagem: MensagemRegrasAlteradas = { tipo: "regras-alteradas", idTipo, idComplemento };
            canal.postMessage(mensagem);
            canal.close();
        } catch {
            // Ambiente sem suporte a BroadcastChannel: invalidação local já aplicada.
        }
    }, [invalidarCacheLocal]);

    // Escuta invalidações disparadas por outras abas/janelas e limpa o cache local. A
    // próxima abertura de ocorrência chama `carregarRegras`, que — sem cache — buscará as
    // regras atualizadas no servidor.
    useEffect(() => {
        let canal: BroadcastChannel;
        try {
            canal = new BroadcastChannel(CANAL_REGRAS);
        } catch {
            return; // sem suporte ao BroadcastChannel
        }

        const aoReceber = (evento: MessageEvent<MensagemRegrasAlteradas>) => {
            const dados = evento.data;
            if (dados?.tipo !== "regras-alteradas") return;
            invalidarCacheLocal(dados.idTipo, dados.idComplemento);
        };

        canal.addEventListener("message", aoReceber);
        return () => {
            canal.removeEventListener("message", aoReceber);
            canal.close();
        };
    }, [invalidarCacheLocal]);

    const carregarCamposTab = useCallback(async (idTab: number): Promise<void> => {
        if (camposPorTab.current[idTab] !== undefined) {
            return;
        }
        try {
            const campos = await ConfiguracaoOcorrenciaService.listarCamposPorTab(idTab);
            camposPorTab.current[idTab] = campos ?? [];
            const mapa: Record<string, number> = {};
            (campos ?? []).forEach(campo => {
                mapa[campo.nome] = campo.id;
            });
            mapaCamposPorTab.current[idTab] = mapa;
        } catch {
            // Sem catálogo disponível: mantém o comportamento atual (campos visíveis).
            camposPorTab.current[idTab] = [];
            mapaCamposPorTab.current[idTab] = {};
        }
        setVersaoCampos(v => v + 1);
    }, []);

    const obterCamposTab = useCallback((idTab: number): CampoTabFormulario[] => {
        return camposPorTab.current[idTab] ?? [];
    }, []);

    const resolverIdCampo = useCallback((idTab: number, nome: string): number | undefined => {
        return mapaCamposPorTab.current[idTab]?.[nome];
    }, []);

    const buscarRegra = useCallback((idCampo: number): RegraCampoOcorrencia | undefined => {
        if (chaveSelecionada === null) {
            return undefined;
        }
        return regrasPorComplemento.current[chaveSelecionada]?.find(
            regra => regra.idCampoFormulario === idCampo
        );
    }, [chaveSelecionada]);

    const campoVisivel = useCallback((idCampo: number, fluxo: FluxoOcorrencia): boolean => {
        const regra = buscarRegra(idCampo);
        if (regra === undefined) return false;

        switch (fluxo) {
            case FluxoOcorrencia.Cadastro:
                return regra.cadastroVisivel;
            case FluxoOcorrencia.Edicao:
                return regra.edicaoVisivel;
            case FluxoOcorrencia.Visualizacao:
                return regra.visualizacaoVisivel;
            default:
                return false;
        }
    }, [buscarRegra]);

    const campoEditavel = useCallback((idCampo: number, fluxo: FluxoOcorrencia): boolean => {
        const regra = buscarRegra(idCampo);
        if (regra === undefined) return false;

        switch (fluxo) {
            case FluxoOcorrencia.Cadastro:
                return regra.cadastroVisivel && regra.cadastroEditavel;
            case FluxoOcorrencia.Edicao:
                return regra.edicaoVisivel && regra.edicaoEditavel;
            case FluxoOcorrencia.Visualizacao:
                return false;
            default:
                return false;
        }
    }, [buscarRegra]);

    const campoObrigatorio = useCallback((idCampo: number, fluxo: FluxoOcorrencia): boolean => {
        const regra = buscarRegra(idCampo);
        if (regra === undefined) return false;

        switch (fluxo) {
            case FluxoOcorrencia.Cadastro:
                return regra.cadastroVisivel && regra.campoObrigatorio;
            case FluxoOcorrencia.Edicao:
                return regra.edicaoVisivel && regra.campoObrigatorio;
            case FluxoOcorrencia.Visualizacao:
                return false;
            default:
                return false;
        }
    }, [buscarRegra]);

    const value: RegrasFormularioContextType = {
        complementoSelecionado,
        carregarRegras,
        limparRegras,
        invalidarComplemento,
        carregarCamposTab,
        obterCamposTab,
        resolverIdCampo,
        campoVisivel,
        campoEditavel,
        campoObrigatorio,
    };

    return (
        <RegrasFormularioContext.Provider value={value}>
            {children}
        </RegrasFormularioContext.Provider>
    );
};

export const useRegrasFormulario = () => {
    const contexto = useContext(RegrasFormularioContext);

    if (contexto === undefined) {
        throw new Error("useRegrasFormulario deve ser usado dentro de RegrasFormularioProvider");
    }

    return contexto;
};
