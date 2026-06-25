import { createContext, ReactNode, useContext, useMemo, useState } from "react";

/**
 * Controle de apresentação do formulário de ocorrência: distingue o modo somente
 * leitura (visualização) dos modos de cadastro/edição. Mantido separado do estado de
 * dados (FormCadastroContext) para não misturar responsabilidades.
 */
export interface ControleBoletim {
    somenteVisualizacao: boolean;
}

interface ControleBoletimContextData {
    stateControle: ControleBoletim;
    setSomenteVisualizacao: (valor: boolean) => void;
}

const ControleBoletimContext = createContext<ControleBoletimContextData | undefined>(undefined);

export function ControleBoletimProvider({ children }: { children: ReactNode }) {
    const [somenteVisualizacao, setSomenteVisualizacaoState] = useState(false);

    const value = useMemo<ControleBoletimContextData>(() => ({
        stateControle: { somenteVisualizacao },
        setSomenteVisualizacao: setSomenteVisualizacaoState,
    }), [somenteVisualizacao]);

    return (
        <ControleBoletimContext.Provider value={value}>
            {children}
        </ControleBoletimContext.Provider>
    );
}

export function useControleBoletimOcorrencia() {
    const contexto = useContext(ControleBoletimContext);
    if (contexto === undefined) {
        throw new Error("useControleBoletimOcorrencia deve ser usado dentro de ControleBoletimProvider");
    }
    return contexto;
}
