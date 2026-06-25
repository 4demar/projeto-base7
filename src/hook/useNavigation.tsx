import { useState } from "react";
import { TabTipoConfiguracao, TipoOcorrencia } from "../types";
import { listaNavegacaoBase, TypeNavegacao } from "../components/ConfiguracaoOcorrencias/types";
import { FormActions, useFormBoletimCadastro } from "../contexts/FormCadastroContext";

export { listaNavegacaoBase };
export type { TypeNavegacao };

/** Fluxos da tela de ocorrência usados para filtrar quais abas aparecem. */
export enum FluxoTab {
    Cadastro = "cadastro",
    Edicao = "edicao",
    Visualizacao = "visualizacao",
}

/** Indica se a configuração de uma aba habilita o fluxo informado. */
function tabHabilitadaNoFluxo(tab: TabTipoConfiguracao, fluxo: FluxoTab): boolean {
    switch (fluxo) {
        case FluxoTab.Cadastro:
            return tab.cadastrar;
        case FluxoTab.Edicao:
            return tab.editar;
        case FluxoTab.Visualizacao:
            return tab.visualizar;
        default:
            return false;
    }
}

export function useNavigation() {
    const { state, dispatch } = useFormBoletimCadastro();
    const [pathVoltar, setPathVoltar] = useState<string>('')
    const [pathContinuar, setPathContinuar] = useState<string>('')

    const retornalistaFiltrada = () => {
        return listaNavegacaoBase.filter(item => {
            if (state.apresentarAbaVeiculos) {
                //DadosOcorrencia, DetalhesOcorrencia, InformacoesVeiculos, Envolvido, AnexarArquivos
                return [0, 1, 3, 4, 5].includes(item.id)
            } else if (state.ocorrenciaSuspeitaFraude) {
                // DadosOcorrencia, DetalhesOcorrencia, ProdutosOcorrencia, Envolvidos
                return [0, 1, 2, 4].includes(item.id)
            } else {
                //DadosOcorrencia, DetalhesOcorrencia, ProdutosOcorrencia, Envolvido, AnexarArquivos
                return [0, 1, 2, 4, 5].includes(item.id)
            }
        });
    }

    /**
     * Resolve as abas visíveis de um Tipo para um fluxo específico (Cadastro/Edição/
     * Visualização). Considera apenas as abas habilitadas no fluxo, na ordem configurada,
     * e ignora ids sem correspondência na `listaNavegacaoBase`.
     */
    function resolverAbasPorFluxo(
        tabsConfiguracao: TabTipoConfiguracao[] | undefined | null,
        fluxo: FluxoTab
    ): TypeNavegacao[] {
        if (!tabsConfiguracao || tabsConfiguracao.length === 0) {
            return [];
        }

        return [...tabsConfiguracao]
            .sort((a, b) => a.ordem - b.ordem)
            .filter(tab => tabHabilitadaNoFluxo(tab, fluxo))
            .map(tab => listaNavegacaoBase.find(item => item.id === tab.idTab))
            .filter((item): item is TypeNavegacao => item !== undefined);
    }

    function carregarListaNavegacaoTabs(
        tabsConfiguracao: TabTipoConfiguracao[] | undefined | null,
        fluxo: FluxoTab
    ) {
        const listaNavegaTabs = resolverAbasPorFluxo(tabsConfiguracao, fluxo);

        dispatch({
            type: FormActions.setListaOrdemNavegacaoTabs,
            payload: listaNavegaTabs,
        });
    }

    /**
     * Resolve as abas a partir da `tabsConfiguracao` do Tipo selecionado, para o fluxo
     * informado, e despacha o MESMO conjunto/ordem de abas tanto para a navegação por
     * rotas da criação (`listaOrdemNavegacao`) quanto para as abas do modal de
     * edição/pesquisa (`listaOrdemNavegacaoTabs`).
     *
     * Isso garante que o conjunto e a ordem das abas sejam IDÊNTICOS nos contextos de
     * criação e de edição/pesquisa, variando apenas o ContainerNavegacao
     * (Breadcrumb vs. abas em modal).
     */
    function carregarNavegacaoPorTipo(tipo: TipoOcorrencia | undefined | null, fluxo: FluxoTab) {
        const listaNavega = resolverAbasPorFluxo(tipo?.tabsConfiguracao, fluxo);

        dispatch({
            type: FormActions.setListaOrdemNavegacao,
            payload: listaNavega,
        });

        dispatch({
            type: FormActions.setListaOrdemNavegacaoTabs,
            payload: listaNavega,
        });
    }

    function carregarListaNavegacao() {
        const listaFiltrada = retornalistaFiltrada()

        dispatch({
            type: FormActions.setListaOrdemNavegacao,
            payload: listaFiltrada,
        });
    }

    const montarNavegacaoPorRota = (nomeRota: string) => {
        let listaAtual = state.listaOrdemNavegacao
        if (listaAtual.length <= 0) {
            listaAtual = retornalistaFiltrada();

            dispatch({
                type: FormActions.setListaOrdemNavegacao,
                payload: listaAtual,
            });
        }

        const posicaoTelaAtual = listaAtual.findIndex((x: TypeNavegacao) => x.link === nomeRota);

        ObterPathVoltar(posicaoTelaAtual)
        ObterPathContinuar(posicaoTelaAtual)

    }

    function ObterPathVoltar(posicaoTelaAtual: number) {

        if (posicaoTelaAtual <= state.listaOrdemNavegacao.length - 1) {
            setPathVoltar(state.listaOrdemNavegacao[posicaoTelaAtual - 1].link)
        }
        else
            setPathContinuar('')
    }

    function ObterPathContinuar(posicaoTelaAtual: number) {

        if (posicaoTelaAtual < state.listaOrdemNavegacao.length - 1) {
            setPathContinuar(state.listaOrdemNavegacao[posicaoTelaAtual + 1].link)
        }
        else
            setPathContinuar('')
    }

    return {
        carregarListaNavegacaoTabs,
        carregarNavegacaoPorTipo,
        resolverAbasPorFluxo,
        carregarListaNavegacao,
        montarNavegacaoPorRota,
        pathVoltar,
        pathContinuar
    }
}


