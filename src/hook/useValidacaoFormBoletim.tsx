import { State, useFormBoletimCadastro } from "../contexts/FormCadastroContext";
import { TelasOcorrencia } from "../enums/telasOcorrencia";
import { useFormularioOcorrencia } from "./useFormularioOcorrencia";

type FormValidation = {
    isValid: boolean,
    mensagens: string[]
}

export const useValidacaoFormBoletim = () => {
    const { campoEhObrigatorio } = useFormularioOcorrencia();
    const { state: formState } = useFormBoletimCadastro();

    const ValidarDadosOcorrencia = (mensagens: string[], state: State) => {
        const ID_TAB = 0;
        if (state.tipoOcorrencia === 0)
            mensagens.push("Tipo da ocorrência não informado");

        if (state.complementoOcorrencia === 0)
            mensagens.push("Complemento da ocorrência não informado");

        if (campoEhObrigatorio(ID_TAB, 'codigoFilial') && !(state.valores.codigoFilial ?? '').trim())
            mensagens.push("Filial não informada");

        if (campoEhObrigatorio(ID_TAB, 'dataOcorrencia') && !(state.valores.dataOcorrencia ?? '').trim())
            mensagens.push("Data da ocorrência não informada");

        if (campoEhObrigatorio(ID_TAB, 'statusOcorrencia') && !(state.valores.statusOcorrencia ?? '').trim())
            mensagens.push("Status da ocorrência não informado");
    }

    const ValidarDetalhesOcorrencias = (mensagens: string[], state: State) => {
        const ID_TAB = 1;
        if (campoEhObrigatorio(ID_TAB, 'tituloOcorrencia') && !(state.valores.tituloOcorrencia ?? '').trim())
            mensagens.push("Título da ocorrência não informado!");

        if (campoEhObrigatorio(ID_TAB, 'descricaoOcorrencia') && !(state.valores.descricaoOcorrencia ?? '').trim())
            mensagens.push("Descrição da ocorrência não informado!");

        if (campoEhObrigatorio(ID_TAB, 'providenciasTomadas') && !(state.valores.providenciasTomadas ?? '').trim())
            mensagens.push("Providência tomada não informado!");
    }

    const ValidarProdutoOcorrencia = (mensagens: string[]) => {
        const ID_TAB = 2;
        const produtosInseridos = formState.produtos ?? [];

        // Na aba de Produtos o que vale é o item inserido (não os campos do formulário).
        // Item com código preenchido = Produto; item sem código = Valor (CardItem).
        const temProduto = produtosInseridos.some(item => item.codigoProduto !== '');
        const temValor = produtosInseridos.some(item => item.codigoProduto === '');

        if (campoEhObrigatorio(ID_TAB, 'produto') && !temProduto)
            mensagens.push("É necessário que tenha um produto incluido para esse tipo de ocorrência.");

        if (campoEhObrigatorio(ID_TAB, 'valor') && !temValor)
            mensagens.push("É necessário que tenha um valor incluido para esse tipo de ocorrência.");
    }

    const ValidarEnvolvidos = (mensagens: string[], state: State) => {
        const ID_TAB = 4;
        if (campoEhObrigatorio(ID_TAB, 'envolvido') && state.envolvidos.length <= 0)
            mensagens.push("É necessário que tenha um envolvido para esse tipo de ocorrência.");
    }

    const ValidarAnexos = (mensagens: string[], state: State) => {
        const ID_TAB = 4;
        // const AnexoPreenchidoParaAchadosEPerdidos = (tipoOcorrencia: TipoOcorrencia[]): boolean => {
        //     if ((state.anexos === undefined || state.anexos.length <= 0)) {
        //         let tipoSelecionado = parseInt(state.tipoOcorrencia);
        //         let tipos = tipoOcorrencia.filter(x => x.numeroTipo === tipoSelecionado);
        //         if (tipos.length > 0) {
        //             const nomeDoTipoOcorrencia = tipos[0].nomeTipo.toLowerCase();
        //             if (nomeDoTipoOcorrencia.includes('achado') || nomeDoTipoOcorrencia.includes('perdido')) {
        //                 return true;
        //             }
        //         }
        //     }

        //     return false;
        // };

        if (campoEhObrigatorio(ID_TAB, 'anexo') && (state.anexos === undefined || state.anexos.length <= 0))
            mensagens.push("Para este tipo de ocorrência é obrigatório informar um anexo!");
    }

    const formIsValid = (telaValidacao: TelasOcorrencia | null): FormValidation => {
        const mensagens: string[] = [];

        let isValid = true;

        const validarTodasTelas = (telaValidacao === null);

        if (telaValidacao === TelasOcorrencia.DADOS_OCORRENCIA || validarTodasTelas)
            ValidarDadosOcorrencia(mensagens, formState);

        if (telaValidacao === TelasOcorrencia.DETALHES_OCORRENCIA || validarTodasTelas)
            ValidarDetalhesOcorrencias(mensagens, formState);

        if (telaValidacao === TelasOcorrencia.ENVOLVIDOS || validarTodasTelas)
            ValidarEnvolvidos(mensagens, formState);

        if (telaValidacao === TelasOcorrencia.PRODUTOS_OCORRENCIA || validarTodasTelas) {
            ValidarProdutoOcorrencia(mensagens)
        }
        if (telaValidacao === TelasOcorrencia.ANEXOS || validarTodasTelas)
            ValidarAnexos(mensagens, formState);

        isValid = mensagens.length <= 0;

        return { isValid, mensagens }
    }

    return formIsValid
}
