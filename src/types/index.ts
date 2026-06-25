export interface LembreteDto {
    id: string;
    annotationId?: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    createdAt: string;
}


export interface BannerTextElement {
    id: string;
    content: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontWeight: 'normal' | 'bold';
}

export interface BannerProject {
    id: string;
    name: string;
    backgroundImage: string;
    textElements: BannerTextElement[];
    createdAt: string;
    updatedAt: string;
}


// ===== Cadastro de Tipo de Ocorrência =====
// Modelo alinhado ao projeto de origem (API), agora persistido em IndexedDB.

export interface TipoOcorrencia {
    numeroTipo: number;
    nomeTipo: string;
    descricaoTipo: string;
    tipoInativo: number;
    tabsConfiguracao: TabTipoConfiguracao[];
    complementoOcorrencia: ComplementoOcorrencia[];
}

export interface ComplementoOcorrencia {
    numeroTipo: number;
    numeroComplemento: number;
    nomeComplemento: string;
    descricaoComplemento: string;
    complementoInativo: number;
}

// Configuração de uma aba dentro de um Tipo (quais fluxos a aba aparece + ordem).
export interface TabTipoConfiguracao {
    idTab: number;
    ordem: number;
    visualizar: boolean;
    editar: boolean;
    cadastrar: boolean;
}

// Catálogo (seed) de campos de uma aba. Persistido em IndexedDB com ids fixos.
export interface CampoTabFormulario {
    id: number;
    idTab: number;
    nome: string;
    label: string;
}

// Regra de campo por Subtipo (UTLBO07). A existência da regra = campo configurado.
export interface RegraCampoOcorrencia {
    id: number;
    idCampoFormulario: number;
    idTipoOcorrencia: number;
    idComplementoOcorrencia: number;
    // Fluxo Cadastro
    cadastroVisivel: boolean;
    cadastroEditavel: boolean;
    // Fluxo Edição
    edicaoVisivel: boolean;
    edicaoEditavel: boolean;

    campoObrigatorio: boolean;
    visualizacaoVisivel: boolean;
}
