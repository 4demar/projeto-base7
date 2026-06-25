import { createContext, Dispatch, ReactNode, useContext, useMemo, useReducer } from "react";
import { TypeNavegacao } from "../components/ConfiguracaoOcorrencias/types";

// Item simples inserido na aba de Produtos. Código preenchido = Produto; vazio = Valor.
export interface ItemProduto {
    codigoProduto: string;
    descricao: string;
    valor: number;
}

export interface Envolvido {
    nome: string;
    documento: string;
}

export interface Anexo {
    nome: string;
    conteudo: string;
}

/**
 * State enxuto do formulário de ocorrência. Guarda apenas o necessário para o fluxo
 * dinâmico: o Tipo/Subtipo selecionados, os valores simples dos campos (indexados pelo
 * nome técnico do catálogo), as coleções das abas compostas (produtos/envolvidos/anexos)
 * e o estado de navegação das abas.
 */
export interface State {
    tipoOcorrencia: number;
    complementoOcorrencia: number;
    // Valores dos campos simples, por nome técnico (ex.: codigoFilial, tituloOcorrencia).
    valores: Record<string, string>;
    produtos: ItemProduto[];
    envolvidos: Envolvido[];
    anexos: Anexo[];
    // Edição de ocorrência existente (abas em modal) vs. novo cadastro (por rota).
    showModal: boolean;
    // Sinalizadores que influenciam quais abas aparecem (compatibilidade com useNavigation).
    apresentarAbaVeiculos: boolean;
    ocorrenciaSuspeitaFraude: boolean;
    listaOrdemNavegacao: TypeNavegacao[];
    listaOrdemNavegacaoTabs: TypeNavegacao[];
}

export const estadoInicial: State = {
    tipoOcorrencia: 0,
    complementoOcorrencia: 0,
    valores: {},
    produtos: [],
    envolvidos: [],
    anexos: [],
    showModal: false,
    apresentarAbaVeiculos: false,
    ocorrenciaSuspeitaFraude: false,
    listaOrdemNavegacao: [],
    listaOrdemNavegacaoTabs: [],
};

export enum FormActions {
    setTipoOcorrencia = "setTipoOcorrencia",
    setComplementoOcorrencia = "setComplementoOcorrencia",
    setCampo = "setCampo",
    setProdutos = "setProdutos",
    setEnvolvidos = "setEnvolvidos",
    setAnexos = "setAnexos",
    setShowModal = "setShowModal",
    setListaOrdemNavegacao = "setListaOrdemNavegacao",
    setListaOrdemNavegacaoTabs = "setListaOrdemNavegacaoTabs",
    resetFormulario = "resetFormulario",
}

export type Action =
    | { type: FormActions.setTipoOcorrencia; payload: number }
    | { type: FormActions.setComplementoOcorrencia; payload: number }
    | { type: FormActions.setCampo; payload: { nome: string; valor: string } }
    | { type: FormActions.setProdutos; payload: ItemProduto[] }
    | { type: FormActions.setEnvolvidos; payload: Envolvido[] }
    | { type: FormActions.setAnexos; payload: Anexo[] }
    | { type: FormActions.setShowModal; payload: boolean }
    | { type: FormActions.setListaOrdemNavegacao; payload: TypeNavegacao[] }
    | { type: FormActions.setListaOrdemNavegacaoTabs; payload: TypeNavegacao[] }
    | { type: FormActions.resetFormulario; payload?: undefined };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case FormActions.setTipoOcorrencia:
            return { ...state, tipoOcorrencia: action.payload };
        case FormActions.setComplementoOcorrencia:
            return { ...state, complementoOcorrencia: action.payload };
        case FormActions.setCampo:
            return { ...state, valores: { ...state.valores, [action.payload.nome]: action.payload.valor } };
        case FormActions.setProdutos:
            return { ...state, produtos: action.payload };
        case FormActions.setEnvolvidos:
            return { ...state, envolvidos: action.payload };
        case FormActions.setAnexos:
            return { ...state, anexos: action.payload };
        case FormActions.setShowModal:
            return { ...state, showModal: action.payload };
        case FormActions.setListaOrdemNavegacao:
            return { ...state, listaOrdemNavegacao: action.payload };
        case FormActions.setListaOrdemNavegacaoTabs:
            return { ...state, listaOrdemNavegacaoTabs: action.payload };
        case FormActions.resetFormulario:
            return { ...estadoInicial };
        default:
            return state;
    }
}

interface FormBoletimContextData {
    state: State;
    dispatch: Dispatch<Action>;
}

const FormBoletimCadastroContext = createContext<FormBoletimContextData | undefined>(undefined);

export function FormBoletimCadastroProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, estadoInicial);
    const value = useMemo(() => ({ state, dispatch }), [state]);

    return (
        <FormBoletimCadastroContext.Provider value={value}>
            {children}
        </FormBoletimCadastroContext.Provider>
    );
}

export function useFormBoletimCadastro() {
    const contexto = useContext(FormBoletimCadastroContext);
    if (contexto === undefined) {
        throw new Error("useFormBoletimCadastro deve ser usado dentro de FormBoletimCadastroProvider");
    }
    return contexto;
}
