import { useControleBoletimOcorrencia } from "../contexts/ControleBoletimContext";
import { useFormBoletimCadastro } from "../contexts/FormCadastroContext";
import { FluxoOcorrencia, useRegrasFormulario } from "../contexts/RegrasFormularioContext";

// Reexporta o enum de fluxo para preservar os imports já existentes
// (ex.: `import { FluxoOcorrencia } from "../../hooks/useFormularioOcorrencia"`).
export { FluxoOcorrencia };

// Campos habilitados por padrão ao iniciar um novo cadastro enquanto nenhum Subtipo
// (Complemento) foi selecionado. Hardcoded de propósito: são os campos mínimos para o
// usuário escolher o Tipo/Complemento e informar Filial e Data antes de as regras
// dinâmicas do Subtipo entrarem em vigor. Nomes técnicos conforme o catálogo (UTLBO06).
const CAMPOS_DEFAULT_CADASTRO = ["tipoOcorrencia", "codigoFilial", "complementoOcorrencia", "dataOcorrencia"];

/**
 * Hook sobre o RegrasFormularioContext que centraliza o controle dinâmico de campos
 * para TODAS as abas do fluxo de ocorrência. Cada aba apenas informa o seu `idTab` e o
 * `nome` técnico do campo (do catálogo UTLBO06); o hook resolve visibilidade, edição e
 * obrigatoriedade conforme o fluxo atual (Cadastro/Edição/Visualização).
 *
 * Regras de fallback (preservam o comportamento atual da tela):
 * - Sem Subtipo selecionado, nenhum controle é aplicado (campos visíveis e editáveis),
 *   EXCETO no novo cadastro: enquanto o Subtipo não é escolhido, apenas os campos
 *   default (CAMPOS_DEFAULT_CADASTRO) ficam visíveis/editáveis.
 * - Campo sem correspondência no catálogo não regride (permanece visível/editável).
 */
export function useFormularioOcorrencia() {
    const {
        complementoSelecionado,
        carregarRegras,
        limparRegras,
        resolverIdCampo,
        campoVisivel,
        campoEditavel,
        campoObrigatorio,
    } = useRegrasFormulario();

    const { stateControle } = useControleBoletimOcorrencia();
    const { state } = useFormBoletimCadastro();

    // Só controla os campos quando há um Subtipo selecionado E regras carregadas; caso
    // contrário, preserva o comportamento atual da tela.
    const controlarCampos = complementoSelecionado !== null;

    // Determina o fluxo atual da tela para aplicar a configuração correta de cada campo.
    // Visualização tem prioridade; showModal indica edição de ocorrência existente;
    // caso contrário, é um novo cadastro.
    const fluxoAtual: FluxoOcorrencia = stateControle.somenteVisualizacao
        ? FluxoOcorrencia.Visualizacao
        : state.showModal
            ? FluxoOcorrencia.Edicao
            : FluxoOcorrencia.Cadastro;

    // Novo cadastro ainda sem Subtipo selecionado: aplica o conjunto default de campos.
    const aplicarDefaultCadastro = !controlarCampos && fluxoAtual === FluxoOcorrencia.Cadastro;
    const ehCampoDefault = (nome: string): boolean => CAMPOS_DEFAULT_CADASTRO.includes(nome);

    const campoEhVisivel = (idTab: number, nome: string): boolean => {
        if (!controlarCampos) {
            // Novo cadastro sem Subtipo: só os campos default aparecem.
            if (aplicarDefaultCadastro) return ehCampoDefault(nome);
            return true;
        }
        const id = resolverIdCampo(idTab, nome);
        if (id === undefined) return true; // campo sem catálogo: não regredir
        return campoVisivel(id, fluxoAtual);
    };

    const campoEhSomenteLeitura = (idTab: number, nome: string): boolean => {
        if (!controlarCampos) {
            // Novo cadastro sem Subtipo: campos não-default ficam somente leitura.
            if (aplicarDefaultCadastro) return !ehCampoDefault(nome);
            return false;
        }
        const id = resolverIdCampo(idTab, nome);
        if (id === undefined) return false;
        return !campoEditavel(id, fluxoAtual);
    };

    const campoEhObrigatorio = (idTab: number, nome: string): boolean => {
        if (!controlarCampos) return false;
        const id = resolverIdCampo(idTab, nome);
        if (id === undefined) return false;
        return campoObrigatorio(id, fluxoAtual);
    };

    return {
        complementoSelecionado,
        fluxoAtual,
        controlarCampos,
        carregarRegras,
        limparRegras,
        campoEhVisivel,
        campoEhSomenteLeitura,
        campoEhObrigatorio,
    };
}
