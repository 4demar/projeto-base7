import styled from "styled-components";
import { cores } from "./styles";

export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    top: 50px;
`;

export const ModalCabecalho = styled.div`
    padding: 22px 26px 14px;
    border-bottom: 1px solid ${cores.neutro};
    background: ${cores.neutroFundo}; //linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);

    .titulo {
        display: flex;
        align-items: center;
        gap: 10px;

        h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: ${cores.primaria};
        }

        svg {
            color: ${cores.azulAcento};
        }
    }

    p {
        margin: 6px 0 0;
        font-size: 13px;
        color: ${cores.textoSuave};
    }

    button.fechar {
        position: absolute;
        top: 18px;
        right: 20px;
        border: none;
        background: transparent;
        color: ${cores.textoSuave};
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 8px;

        &:hover {
            background: ${cores.neutroFundo};
        }
    }

    position: relative;
`;

export const ModalCaixa = styled.div<{ largura?: number }>`
    background: ${cores.fundo};
    border-radius: 18px;
    width: 100%;
    max-width: ${({ largura }) => largura ?? 880}px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 24px 60px rgba(16, 24, 40, 0.25);
    overflow: hidden;
`;

export const ModalCorpo = styled.div`
    padding: 22px 26px;
    overflow-y: auto;
    flex: 1;
`;

export const ModalRodape = styled.div`
    padding: 16px 26px;
    border-top: 1px solid ${cores.neutro};
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    background: ${cores.neutroFundo};
`;

export const DuasColunas = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
    }
`;

export const SecaoTitulo = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;

    .label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 700;
        color: ${cores.texto};

        svg {
            color: ${cores.azulAcento};
        }
    }
`;

export const Campo = styled.div`
    margin-bottom: 16px;

    label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: ${cores.texto};
        margin-bottom: 6px;
    }

    input[type="text"],
    textarea,
    select {
        width: 100%;
        border: 1px solid ${cores.bordaForte};
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 14px;
        color: ${cores.texto};
        background: ${cores.superficie};
        transition: border-color 0.15s ease, box-shadow 0.15s ease;

        &:focus {
            outline: none;
            border-color: ${cores.azulAcento};
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        &::placeholder {
            color: ${cores.neutro};
        }
    }

    textarea {
        resize: vertical;
        min-height: 96px;
    }
`;

export const SwitchCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid ${cores.borda};
    border-radius: 12px;
    padding: 14px 16px;

    .info {
        strong {
            display: block;
            font-size: 14px;
            color: ${cores.texto};
        }
        small {
            color: ${cores.textoSuave};
        }
    }
`;

export const Switch = styled.button<{ ativo: boolean }>`
    position: relative;
    width: 46px;
    height: 26px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    transition: background 0.18s ease;
    background: ${({ ativo }) => (ativo ? cores.azulAcento : cores.bordaForte)};

    &::after {
        content: "";
        position: absolute;
        top: 3px;
        left: ${({ ativo }) => (ativo ? "23px" : "3px")};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        transition: left 0.18s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
`;

export const ContadorBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    background: ${cores.neutroFundo};
    color: ${cores.primaria};

    &.destaque {
        background: ${cores.azulAcento};
        color: #fff;
    }
`;

export const ListaAbas = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 340px;
    overflow-y: auto;
    padding-right: 4px;
`;

export const ItemAba = styled.div<{ selecionada: boolean; arrastando?: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid ${({ selecionada }) => (selecionada ? cores.azulAcento : cores.borda)};
    background: ${({ selecionada }) => (selecionada ? "rgba(37, 99, 235, 0.05)" : cores.superficie)};
    border-radius: 12px;
    padding: 12px 14px;
    cursor: pointer;
    transition: all 0.12s ease;
    opacity: ${({ arrastando }) => (arrastando ? 0.4 : 1)};

    &:hover {
        border-color: ${cores.azulAcento};
    }

    .arraste {
        color: ${cores.neutro};
        cursor: grab;
        display: flex;
    }

    .titulo {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
        color: ${cores.texto};
    }
`;

export const CheckRedondo = styled.span<{ marcado: boolean }>`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${({ marcado }) => (marcado ? cores.azulAcento : cores.bordaForte)};
    background: ${({ marcado }) => (marcado ? cores.azulAcento : "transparent")};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
    transition: all 0.12s ease;

    svg {
        width: 12px;
        height: 12px;
        opacity: ${({ marcado }) => (marcado ? 1 : 0)};
    }
`;

export const CheckQuadrado = styled.span<{ marcado: boolean }>`
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: 2px solid ${({ marcado }) => (marcado ? cores.azulAcento : cores.bordaForte)};
    background: ${({ marcado }) => (marcado ? cores.azulAcento : "transparent")};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
    transition: all 0.12s ease;

    svg {
        width: 12px;
        height: 12px;
        opacity: ${({ marcado }) => (marcado ? 1 : 0)};
    }
`;

export const PassoTitulo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 22px 0 14px;

    .numero {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: ${cores.azulAcento};
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .texto {
        font-size: 16px;
        font-weight: 700;
        color: ${cores.texto};
        flex: 1;
    }

    &:first-child {
        margin-top: 0;
    }
`;

export const Accordion = styled.div`
    border: 1px solid ${cores.borda};
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 10px;
`;

export const AccordionTopo = styled.button<{ aberta: boolean }>`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    border: none;
    background: ${({ aberta }) => (aberta ? "#f8fafc" : cores.superficie)};
    padding: 12px 14px;
    cursor: pointer;
    text-align: left;

    .nome {
        font-size: 14px;
        font-weight: 700;
        color: ${cores.texto};
    }

    .chevron {
        margin-left: auto;
        color: ${cores.textoSuave};
        display: flex;
    }
`;

export const AccordionCorpo = styled.div`
    padding: 12px 14px 14px;
    border-top: 1px solid ${cores.borda};

    .selecionar-todos {
        background: none;
        border: none;
        color: ${cores.azulAcento};
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        margin-bottom: 10px;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export const GradeCampos = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    @media (max-width: 576px) {
        grid-template-columns: 1fr;
    }
`;

export const CampoItem = styled.button<{ marcado: boolean }>`
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid ${({ marcado }) => (marcado ? cores.azulAcento : cores.borda)};
    background: ${({ marcado }) => (marcado ? "rgba(37, 99, 235, 0.05)" : cores.superficie)};
    border-radius: 10px;
    padding: 10px 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.12s ease;

    &:hover {
        border-color: ${cores.azulAcento};
    }

    .nome {
        font-size: 13px;
        color: ${cores.texto};
        flex: 1;
    }
`;

export const PlaceholderCampos = styled.div`
    border: 1px dashed ${cores.bordaForte};
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    color: ${cores.textoSuave};
    font-size: 14px;
`;

export const BotaoSecundario = styled.button`
    height: 42px;
    padding: 0 18px;
    border: 1px solid ${cores.bordaForte};
    border-radius: 10px;
    background: ${cores.superficie};
    color: ${cores.texto};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background: ${cores.neutroFundo};
    }
`;

export const BotaoConfirmar = styled.button`
    height: 42px;
    padding: 0 22px;
    border: none;
    border-radius: 10px;
    background: ${cores.azulAcento};
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);

    &:hover {
        background: #1d4ed8;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

// ===== Tabela de configuração de campos por fluxo (1 coluna de campo + 7 de config) =====

// Grade compartilhada por cabeçalho e linhas: campo + 6 colunas de checkbox.
const GRADE_CONFIG = "minmax(180px, 1.6fr) repeat(6, 90px)";

export const ConfigScroll = styled.div`
    overflow-x: auto;
    border: 1px solid ${cores.borda};
    border-radius: 12px;
`;

export const ConfigCabecalho = styled.div`
    display: grid;
    grid-template-columns: ${GRADE_CONFIG};
    grid-template-rows: auto auto;
    min-width: 720px;
    background: #f8fafc;
    border-bottom: 1px solid ${cores.borda};

    /* Coluna "Campo": ocupa as duas linhas do cabeçalho. */
    .col-campo {
        grid-column: 1;
        grid-row: 1 / span 2;
        display: flex;
        align-items: flex-end;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: ${cores.primaria};
    }

    /* Título do grupo de fluxo (linha 1), centralizado sobre suas sub-colunas. */
    .grupo-titulo {
        grid-row: 1;
        text-align: center;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: ${cores.primaria};
        padding: 6px 4px;
        border-left: 1px solid ${cores.borda};
        border-bottom: 1px solid ${cores.borda};
    }

    .grupo-cadastro { grid-column: 2 / span 2; }
    .grupo-editar { grid-column: 4 / span 2; }

    /* Colunas sem sub-rótulo: ocupam as duas linhas e centralizam o texto verticalmente. */
    .grupo-obrigatorio,
    .grupo-visualizar {
        grid-row: 1 / span 2;
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: none;
    }
    .grupo-obrigatorio { grid-column: 6 / span 1; }
    .grupo-visualizar { grid-column: 7 / span 1; }

    /* Sub-rótulos (linha 2), uma por coluna. */
    .sub {
        grid-row: 2;
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        color: ${cores.textoSuave};
        padding: 6px 2px;
        border-left: 1px solid ${cores.borda};
        align-self: center;
    }
`;

export const ConfigLinha = styled.div`
    display: grid;
    grid-template-columns: ${GRADE_CONFIG};
    min-width: 720px;
    align-items: center;
    border-bottom: 1px solid ${cores.borda};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: rgba(37, 99, 235, 0.03);
    }

    .nome-campo {
        padding: 10px 12px;
        font-size: 13px;
        color: ${cores.texto};
    }

    .celula {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 0;
        border-left: 1px solid ${cores.borda};
    }
`;

export const ConfigCheck = styled.input`

    cursor: pointer;
    accent-color: ${cores.azulAcento};

    &:disabled {
        cursor: not-allowed;
        opacity: 0.4;
    }
`;

// ===== Tabela de configuração de abas por fluxo (arraste + aba + 3 fluxos) =====

const GRADE_TABS = "34px minmax(160px, 1.6fr) repeat(3, 96px)";

export const TabsScroll = styled.div`
    overflow-x: auto;
    border: 1px solid ${cores.borda};
    border-radius: 12px;
`;

export const TabsCabecalho = styled.div`
    display: grid;
    grid-template-columns: ${GRADE_TABS};
    min-width: 520px;
    background:  ${cores.neutroFundo};;
    border-bottom: 1px solid ${cores.borda};
    align-items: center;

    .col {
        padding: 10px 6px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: ${cores.primaria};
        text-align: center;
    }

    .col-aba {
        text-align: left;
        padding-left: 12px;
    }

    .col-fluxo {
        border-left: 1px solid ${cores.borda};
    }
`;

export const TabsLinha = styled.div<{ ativa: boolean; arrastando?: boolean }>`
    display: grid;
    grid-template-columns: ${GRADE_TABS};
    min-width: 520px;
    align-items: center;
    border-bottom: 1px solid ${cores.borda};
    background: ${({ ativa }) => (ativa ? "rgba(37, 99, 235, 0.04)" : cores.superficie)};
    opacity: ${({ arrastando }) => (arrastando ? 0.4 : 1)};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: rgba(37, 99, 235, 0.06);
    }

    .arraste {
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${cores.neutro};
        cursor: grab;
    }

    .nome-aba {
        padding: 12px 6px;
        font-size: 13px;
        font-weight: 500;
        color: ${cores.texto};
    }

    .celula {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
        border-left: 1px solid ${cores.borda};
    }
`;
