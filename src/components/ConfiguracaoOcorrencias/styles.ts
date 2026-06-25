import styled from "styled-components";

// Paleta do painel. Os valores vêm de CSS variables (definidas em src/styles/global.css)
// que mudam conforme o tema light/dark aplicado no <html data-theme="...">.
export const cores = {
    primaria: "var(--cor-primaria)",
    primariaClara: "var(--cor-primaria-clara)",
    azulAcento: "var(--cor-azul-acento)",
    fundo: "var(--cor-fundo)",
    superficie: "var(--cor-superficie)",
    borda: "var(--cor-borda)",
    bordaForte: "var(--cor-borda-forte)",
    texto: "var(--cor-texto)",
    textoSuave: "var(--cor-texto-suave)",
    sucesso: "var(--cor-sucesso)",
    sucessoFundo: "var(--cor-sucesso-fundo)",
    neutro: "var(--cor-neutro)",
    neutroFundo: "var(--cor-neutro-fundo)",
    perigo: "var(--cor-perigo)",
    perigoFundo: "var(--cor-perigo-fundo)",
    linhaHover: "var(--cor-linha-hover)",
};
export const Painel = styled.div`
    padding: 24px;
    min-height: 70vh;

    @media (max-width: 576px) {
        padding: 12px;
    }
`;

export const Breadcrumb = styled.nav`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: ${cores.textoSuave};
    margin-bottom: 4px;

    span.atual {
        color: ${cores.primaria};
        font-weight: 600;
    }
`;

// Wrapper de paginação (react-paginate) compartilhado pelas listagens do painel.
export const ContainerPaginacao = styled.div`
    .pagination {
        display: flex;
        align-items: center;
        gap: 4px;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .newpage {
        a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 32px;
            height: 32px;
            padding: 0 8px;
            border-radius: 8px;
            border: 1px solid ${cores.borda};
            background: ${cores.superficie};
            color: ${cores.texto};
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            transition: all 0.12s ease;

            &:hover {
                border-color: ${cores.azulAcento};
                color: ${cores.azulAcento};
            }
        }

        &.active a {
            background: ${cores.primaria};
            border-color: ${cores.primaria};
            color: #fff;
        }
    }
`;

export const Cabecalho = styled.div`
    margin-bottom: 18px;

    h2 {
        color: ${cores.primaria};
        font-weight: 700;
        font-size: 22px;
        margin: 0;
    }

    p {
        color: ${cores.textoSuave};
        font-size: 14px;
        margin: 2px 0 0;
    }
`;

export const TabsTopo = styled.div`
    display: inline-flex;
    background: ${cores.superficie};
    border: 1px solid ${cores.borda};
    border-radius: 12px;
    padding: 4px;
    gap: 4px;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
    margin-bottom: 18px;
`;

export const TabBotao = styled.button<{ ativa: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
    border-radius: 9px;
    padding: 8px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    background: ${({ ativa }) => (ativa ? cores.primaria : "transparent")};
    color: ${({ ativa }) => (ativa ? "#fff" : cores.textoSuave)};

    &:hover {
        background: ${({ ativa }) => (ativa ? cores.primaria : cores.neutroFundo)};
    }
`;

export const BarraFerramentas = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
`;

export const CampoBusca = styled.div`
    position: relative;
    flex: 1;
    max-width: 400px;

    svg {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: ${cores.neutro};
    }

    input {
        width: 100%;
        height: 38px;
        /* border: 1px solid #ced4da; */
        border-radius: 4px;
        padding: 0 12px 0 38px;
        font-size: 1rem;
        background: ${cores.superficie};
        color: ${cores.texto};
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

        &:focus {
            outline: none;
            border-color: #5495f5;
            box-shadow: 0 0 0 2px rgba(13, 109, 253, 0.14);
        }
    }
`;

export const BotaoPrimario = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    padding: 0 16px;
    border: none;
    border-radius: 4px;
    background: ${cores.primaria};
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.15s ease, transform 0.05s ease;

    &:hover {
        filter: brightness(1.15);
    }

    &:active {
        transform: translateY(1px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const Tabela = styled.div`
    background: ${cores.superficie};
    border: 1px solid ${cores.borda};
    border-radius: 6px;
    overflow: visible;
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.05);
`;

export const LinhaCabecalho = styled.div<{ colunas: string }>`
    display: grid;
    grid-template-columns: ${({ colunas }) => colunas};
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    background: ${cores.neutroFundo};
    border-bottom: 1px solid ${cores.borda};
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${cores.textoSuave};

    @media (max-width: 768px) {
        display: none;
    }
`;

export const Linha = styled.div<{ colunas: string }>`
    display: grid;
    grid-template-columns: ${({ colunas }) => colunas};
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid ${cores.borda};
    font-size: 14px;
    color: ${cores.texto};
    transition: background 0.12s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: ${cores.linhaHover};
    }

    .id {
        font-family: "Courier New", monospace;
        font-size: 12px;
        color: ${cores.textoSuave};
    }

    .nome {
        font-weight: 600;
    }

    .descricao {
        color: ${cores.textoSuave};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr auto !important;
        grid-auto-flow: row;
        gap: 6px;

        .descricao {
            white-space: normal;
        }
    }
`;

export const Tag = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    background: ${cores.neutroFundo};
    color: ${cores.primaria};
    border: 1px solid ${cores.borda};
`;

export const Status = styled.span<{ ativo: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: ${({ ativo }) => (ativo ? cores.sucesso : cores.neutro)};

    &::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${({ ativo }) => (ativo ? cores.sucesso : cores.neutro)};
    }
`;

export const Vazio = styled.div`
    padding: 48px 20px;
    text-align: center;
    color: ${cores.textoSuave};
    font-size: 14px;

    svg {
        color: ${cores.neutro};
        margin-bottom: 8px;
    }
`;

// Switch (toggle) para habilitar/desabilitar status na própria linha.
export const Switch = styled.button<{ ativo: boolean }>`
    position: relative;
    width: 40px;
    height: 22px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background 0.18s ease;
    background: ${({ ativo }) => (ativo ? cores.primaria : cores.bordaForte)};

    &::after {
        content: "";
        position: absolute;
        top: 3px;
        left: ${({ ativo }) => (ativo ? "21px" : "3px")};
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #fff;
        transition: left 0.18s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    }
`;

// Ações em linha (ícones lado a lado).
export const AcoesInline = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: flex-start;

    button {
        border: none;
        background: transparent;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: ${cores.textoSuave};
        transition: background 0.12s ease, color 0.12s ease;

        &:hover {
            background: ${cores.neutroFundo};
            color: ${cores.primaria};
        }

        &.perigo:hover {
            background: ${cores.perigoFundo};
            color: ${cores.perigo};
        }
    }
`;

// Nome do tipo em negrito na listagem de subtipos (sem borda/tag).
export const NomeTipoForte = styled.span`
    font-weight: 700;
    color: ${cores.texto};
`;
