import { DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { MdClose, MdDragIndicator, MdLayers } from "react-icons/md";
import { TipoOcorrencia } from "../../types";
import { TabTipoConfiguracaoPayload } from "../../types/configTipoSubtipo";
import { listaNavegacaoBase } from "./types";
import { ConfiguracaoOcorrenciaService } from "../../services/configuracaoOcorrencia";
import { useLoading } from "../../hook/useLoading";
import {
    ModalOverlay, ModalCaixa, ModalCabecalho, ModalCorpo, ModalRodape,
    SecaoTitulo, Campo, SwitchCard, Switch, ContadorBadge, BotaoSecundario, BotaoConfirmar,
    TabsScroll, TabsCabecalho, TabsLinha, ConfigCheck,
    PassoTitulo
} from "./modalStyles";

type Props = {
    aberto: boolean;
    tipoEdicao: TipoOcorrencia | null;
    onFechar: () => void;
    onSalvo: () => void;
};

// Configuração de uma aba nos 3 fluxos. A aba é considerada habilitada quando
// possui qualquer um dos fluxos marcado.
type ConfigAba = {
    visualizar: boolean;
    editar: boolean;
    cadastrar: boolean;
};

type FluxoAba = keyof ConfigAba;

const ABA_VAZIA: ConfigAba = { visualizar: false, editar: false, cadastrar: false };

const abaHabilitada = (c: ConfigAba): boolean => c.visualizar || c.editar || c.cadastrar;

export default function ModalTipo({ aberto, tipoEdicao, onFechar, onSalvo }: Props) {
    const { setLoading } = useLoading();
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [ativo, setAtivo] = useState(true);
    // Configuração por idTab.
    const [configs, setConfigs] = useState<Record<number, ConfigAba>>({});
    // Ordem das abas habilitadas (ids).
    const [ordem, setOrdem] = useState<number[]>([]);
    const dragIndex = useRef<number | null>(null);
    const [arrastandoIndex, setArrastandoIndex] = useState<number | null>(null);

    const editando = tipoEdicao !== null;

    useEffect(() => {
        if (!aberto) return;
        if (tipoEdicao) {
            setNome(tipoEdicao.nomeTipo ?? "");
            setDescricao(tipoEdicao.descricaoTipo ?? "");
            setAtivo(tipoEdicao.tipoInativo === 0);

            const mapa: Record<number, ConfigAba> = {};
            const ordenadas = [...(tipoEdicao.tabsConfiguracao ?? [])].sort((a, b) => a.ordem - b.ordem);
            ordenadas.forEach(t => {
                mapa[t.idTab] = { visualizar: t.visualizar, editar: t.editar, cadastrar: t.cadastrar };
            });
            setConfigs(mapa);
            setOrdem(ordenadas.map(t => t.idTab));
        } else {
            setNome("");
            setDescricao("");
            setAtivo(true);
            setConfigs({});
            setOrdem([]);
        }
    }, [aberto, tipoEdicao]);

    const obterConfig = (idTab: number): ConfigAba => configs[idTab] ?? ABA_VAZIA;

    // Abas exibidas: primeiro as habilitadas (na ordem definida), depois as demais.
    const abasOrdenadas = useMemo(() => {
        const habilitadas = ordem
            .map(id => listaNavegacaoBase.find(a => a.id === id))
            .filter((a): a is typeof listaNavegacaoBase[number] => a !== undefined);
        const restantes = listaNavegacaoBase.filter(a => !ordem.includes(a.id));
        return [...habilitadas, ...restantes];
    }, [ordem]);

    const totalHabilitadas = useMemo(
        () => Object.values(configs).filter(abaHabilitada).length,
        [configs]
    );

    // Alterna uma flag de fluxo de uma aba, mantendo a ordem em sincronia: a aba entra
    // na ordenação ao ganhar o primeiro fluxo e sai ao perder todos.
    const alterarFluxo = (idTab: number, fluxo: FluxoAba, valor: boolean) => {
        setConfigs(prev => {
            const atual = prev[idTab] ?? ABA_VAZIA;
            const nova: ConfigAba = { ...atual, [fluxo]: valor };
            const novoMapa = { ...prev, [idTab]: nova };

            setOrdem(prevOrdem => {
                const estava = prevOrdem.includes(idTab);
                const agora = abaHabilitada(nova);
                if (agora && !estava) return [...prevOrdem, idTab];
                if (!agora && estava) return prevOrdem.filter(x => x !== idTab);
                return prevOrdem;
            });

            return novoMapa;
        });
    };

    const handleDrop = (idDestino: number) => {
        const origem = dragIndex.current;
        setArrastandoIndex(null);
        dragIndex.current = null;
        if (origem === null) return;
        setOrdem(prev => {
            const idOrigem = abasOrdenadas[origem]?.id;
            if (idOrigem === undefined || !prev.includes(idOrigem) || !prev.includes(idDestino)) return prev;
            const lista = [...prev];
            const de = lista.indexOf(idOrigem);
            const para = lista.indexOf(idDestino);
            lista.splice(de, 1);
            lista.splice(para, 0, idOrigem);
            return lista;
        });
    };

    const permitirDrop = (e: DragEvent) => e.preventDefault();

    const handleSalvar = async () => {
        if (nome.trim() === "") {
            toast.error("O nome do Tipo é obrigatório");
            return;
        }
        if (descricao.trim() === "") {
            toast.error("A descrição do Tipo é obrigatória");
            return;
        }

        // Monta as abas habilitadas na ordem definida.
        const tabs: TabTipoConfiguracaoPayload[] = ordem
            .filter(idTab => abaHabilitada(obterConfig(idTab)))
            .map((idTab, index) => {
                const cfg = obterConfig(idTab);
                return {
                    IdTab: idTab,
                    Ordem: index,
                    Visualizar: cfg.visualizar,
                    Editar: cfg.editar,
                    Cadastrar: cfg.cadastrar,
                };
            });

        const payload = {
            NumeroTipo: tipoEdicao?.numeroTipo ?? 0,
            Nome: nome.trim(),
            Descricao: descricao.trim(),
            Inativo: ativo ? 0 : 1,
            Tabs: tabs,
        };

        setLoading(true);
        try {
            if (editando) {
                await ConfiguracaoOcorrenciaService.atualizarTipo(payload);
                toast.success("Tipo atualizado com sucesso");
            } else {
                await ConfiguracaoOcorrenciaService.inserirTipo(payload);
                toast.success("Tipo criado com sucesso");
            }
            onSalvo();
        } catch {
            // serviço já exibe toast
        } finally {
            setLoading(false);
        }
    };

    if (!aberto) return null;

    return (
        <ModalOverlay onMouseDown={onFechar}>
            <ModalCaixa largura={920} onMouseDown={(e) => e.stopPropagation()}>
                <ModalCabecalho>
                    <div className="titulo">
                        <MdLayers size={24} />
                        <h3>{editando ? "Editar Tipo" : "Novo Tipo"}</h3>
                    </div>
                    <p>Defina os dados do tipo e configure as abas por fluxo (Visualizar, Editar e Cadastrar).</p>
                    <button className="fechar" onClick={onFechar} aria-label="Fechar"><MdClose size={20} /></button>
                </ModalCabecalho>

                <ModalCorpo>
                        <PassoTitulo>
                            <span className="numero">1</span>
                            <span className="texto">Identificação</span>
                        </PassoTitulo>
                                            
                            <SecaoTitulo>
                                <span className="label">Dados do Tipo</span>
                            </SecaoTitulo>
                            <Campo>
                                <label htmlFor="tipoNome">Nome</label>
                                <input id="tipoNome" type="text" placeholder="Ex.: Acidente"
                                    value={nome} onChange={(e) => setNome(e.target.value)} />
                            </Campo>
                            <Campo>
                                <label htmlFor="tipoDescricao">Descrição</label>
                                <textarea id="tipoDescricao" placeholder="Breve descrição do tipo de ocorrência"
                                    value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                            </Campo>
                            <SwitchCard>
                                <div className="info">
                                    <strong>Status</strong>
                                    <small>{ativo ? "Disponível para uso" : "Indisponível"}</small>
                                </div>
                                <Switch ativo={ativo} onClick={() => setAtivo(v => !v)} aria-label="Alternar status" />
                            </SwitchCard>
                       <PassoTitulo>
                        <span className="numero">2</span>
                        <span className="texto">Configuração de abas por fluxo</span>
                        <ContadorBadge className="destaque">{totalHabilitadas} Habilitadas</ContadorBadge>
                    </PassoTitulo>
                            <small style={{ color: "#64748b", display: "block", marginBottom: 12 }}>
                                Marque em quais fluxos cada aba aparece. Arraste pelo ⠿ para ordenar as abas habilitadas.
                            </small>

                            <TabsScroll>
                                <TabsCabecalho>
                                    <div className="col" />
                                    <div className="col col-aba">Aba</div>
                                    <div className="col col-fluxo">Visualizar</div>
                                    <div className="col col-fluxo">Editar</div>
                                    <div className="col col-fluxo">Cadastrar</div>
                                </TabsCabecalho>

                                {abasOrdenadas.map((aba, index) => {
                                    const cfg = obterConfig(aba.id);
                                    const habilitada = abaHabilitada(cfg);
                                    return (
                                        <TabsLinha
                                            key={aba.id}
                                            ativa={habilitada}
                                            arrastando={arrastandoIndex === index}
                                            draggable={habilitada}
                                            onDragStart={() => { dragIndex.current = index; setArrastandoIndex(index); }}
                                            onDragOver={permitirDrop}
                                            onDrop={(e) => { e.stopPropagation(); handleDrop(aba.id); }}
                                        >
                                            <span className="arraste" title={habilitada ? "Arraste para ordenar" : "Habilite um fluxo para ordenar"}>
                                                <MdDragIndicator size={18} />
                                            </span>
                                            <span className="nome-aba">{aba.descricao}</span>
                                            <div className="celula">
                                                <ConfigCheck type="checkbox" aria-label={`${aba.descricao} - Visualizar`}
                                                    checked={cfg.visualizar}
                                                    onChange={(e) => alterarFluxo(aba.id, "visualizar", e.target.checked)} />
                                            </div>
                                            <div className="celula">
                                                <ConfigCheck type="checkbox" aria-label={`${aba.descricao} - Editar`}
                                                    checked={cfg.editar}
                                                    onChange={(e) => alterarFluxo(aba.id, "editar", e.target.checked)} />
                                            </div>
                                            <div className="celula">
                                                <ConfigCheck type="checkbox" aria-label={`${aba.descricao} - Cadastrar`}
                                                    checked={cfg.cadastrar}
                                                    onChange={(e) => alterarFluxo(aba.id, "cadastrar", e.target.checked)} />
                                            </div>
                                        </TabsLinha>
                                    );
                                })}
                            </TabsScroll>

                </ModalCorpo>

                <ModalRodape>
                    <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
                    <BotaoConfirmar onClick={handleSalvar}>
                        {editando ? "Salvar alterações" : "Criar Tipo"}
                    </BotaoConfirmar>
                </ModalRodape>
            </ModalCaixa>
        </ModalOverlay>
    );
}
