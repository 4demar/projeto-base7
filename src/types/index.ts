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

export interface TipoOcorrencia {
    id: number;
    nome: string;
    descricao: string;
    listaIdTabs: number[];
    inativo: boolean;
}

export interface ComplementoOcorrencia {
    id: number;
    idTipoOcorrencia: number;
    nome: string;
    descricao: string;
    inativo: boolean;
}

export interface TabFormulario {
    id: number;
    nome: string;
    descricao: string
}

export interface CampoTabFormulario {
    id: number;
    idTab: number;
    nome: string;
    label: string;
}

export interface RegraCampoOcorrencia {
    id: number;
    idCampoFormulario: number;
    idComplementoOcorrencia: number;
    editavel: boolean;
    obrigatorio: boolean;
}
