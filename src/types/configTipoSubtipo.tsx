import { TipoOcorrencia } from ".";

export interface TabTipoConfiguracaoPayload {
    IdTab: number;
    Ordem: number;
    Visualizar: boolean;
    Editar: boolean;
    Cadastrar: boolean;
}

export interface TipoPayload {
    NumeroTipo: number;
    Nome: string;
    Descricao: string;
    Inativo: number;
    Tabs: TabTipoConfiguracaoPayload[];
}

export interface SubtipoPayload {
    NumeroTipo: number;
    NumeroComplemento: number;
    NomeComplemento: string;
    DescricaoComplemento: string;
    ComplementoInativo: number;
}

export interface RegraCampoPayload {
    Id: number;
    IdCampoFormulario: number;
    IdTipoOcorrencia: number;
    IdComplementoOcorrencia: number;
    // Fluxo Cadastro
    CadastroVisivel: boolean;
    CadastroEditavel: boolean;
    // Fluxo Edição
    EdicaoVisivel: boolean;
    EdicaoEditavel: boolean;
    
    CampoObrigatorio: boolean;
    VisualizacaoVisivel: boolean;
}

export interface ListaTiposResultado {
    data: TipoOcorrencia[];
    totalCount: number;
}