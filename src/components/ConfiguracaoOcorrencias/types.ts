import { ComplementoOcorrencia } from '../../types';

// Linha achatada do painel de subtipos: um complemento + dados do seu tipo pai.
export type LinhaSubtipo = {
    numeroTipo: number;
    nomeTipo: string;
    complemento: ComplementoOcorrencia;
};

// Itens por página das listagens do painel (mesmo padrão das demais telas).
export const TAMANHO_PAGINA = 10;

// Catálogo (hardcode) de Tabs do formulário de ocorrência. NÃO é persistido no banco.
// Cada item é reaproveitado como rota (link) e como rótulo (descricao) no Breadcrumb/abas.
export interface TypeNavegacao {
    id: number;
    link: string;
    descricao: string;
}

export const listaNavegacaoBase: TypeNavegacao[] = [
    { id: 0, link: '/DadosOcorrencia', descricao: 'Dados da ocorrência' },
    { id: 1, link: '/DetalhesOcorrencia', descricao: 'Detalhes da ocorrência' },
    { id: 2, link: '/ProdutosOcorrencia', descricao: 'Produtos da ocorrência' },
    { id: 3, link: '/InformacoesVeiculos', descricao: 'Informações do veículo' },
    { id: 4, link: '/Envolvidos', descricao: 'Envolvidos' },
    { id: 5, link: '/AnexarArquivos', descricao: 'Anexar arquivos' },
    { id: 6, link: '/DevolucaoCliente', descricao: 'Devolução ao cliente' },
    { id: 7, link: '/AnaliseOcorrencia', descricao: 'Análise da ocorrência' },
    { id: 8, link: '/AnotacoesOcorrencia', descricao: 'Anotações' },
    { id: 9, link: '/OcorrenciaRelacionada', descricao: 'Ocorrências relacionadas' },
];
