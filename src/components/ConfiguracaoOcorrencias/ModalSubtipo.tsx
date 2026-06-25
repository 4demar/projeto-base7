import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { MdClose, MdExpandMore, MdChevronRight, MdSearch, MdAccountTree } from "react-icons/md";
import {
    TipoOcorrencia, CampoTabFormulario, RegraCampoOcorrencia
} from "../../types";
import { RegraCampoPayload } from "../../types/configTipoSubtipo";
import { listaNavegacaoBase } from "./types";
import { ConfiguracaoOcorrenciaService } from "../../services/configuracaoOcorrencia";
import { useLoading } from "../../hook/useLoading";
import {
    ModalOverlay, ModalCaixa, ModalCabecalho, ModalCorpo, ModalRodape,
    PassoTitulo, Campo, SwitchCard, Switch, ContadorBadge, Accordion, AccordionTopo,
    AccordionCorpo, PlaceholderCampos, BotaoSecundario, BotaoConfirmar, SecaoTitulo,
    ConfigScroll, ConfigCabecalho, ConfigLinha, ConfigCheck
} from "./modalStyles";
import { cores } from "./styles";

export type SubtipoEdicao = {
    numeroTipo: number;
    numeroComplemento: number;
    nomeComplemento: string;
    descricaoComplemento: string;
    complementoInativo: number;
};

type Props = {
    aberto: boolean;
    tipos: TipoOcorrencia[];
    subtipoEdicao: SubtipoEdicao | null;
    onFechar: () => void;
    onSalvo: () => void;
};

// Configuração de um campo nos 3 fluxos. A existência de qualquer flag verdadeira
// indica que o campo possui regra cadastrada (UTLBO07) para este subtipo.
type ConfigCampo = {
    idRegra?: number;
    cadastroVisivel: boolean;
    cadastroEditavel: boolean;
    edicaoVisivel: boolean;
    edicaoEditavel: boolean;
    visualizacaoVisivel: boolean;
    campoObrigatorio: boolean;
};

// Chaves de flag manipuladas pelos checkboxes.
type FlagCampo = Exclude<keyof ConfigCampo, "idRegra">;

const CONFIG_VAZIA: ConfigCampo = {
    cadastroVisivel: false,
    cadastroEditavel: false,
    edicaoVisivel: false,
    edicaoEditavel: false,
    visualizacaoVisivel: false,
    campoObrigatorio: false,
};

// Um campo tem regra se qualquer uma das flags estiver marcada.
const possuiRegra = (c: ConfigCampo): boolean =>
    c.cadastroVisivel || c.cadastroEditavel ||
    c.edicaoVisivel || c.edicaoEditavel ||
    c.visualizacaoVisivel || c.campoObrigatorio;

export default function ModalSubtipo({ aberto, tipos, subtipoEdicao, onFechar, onSalvo }: Props) {
    const { setLoading } = useLoading();
    const editando = subtipoEdicao !== null;

    const [numeroTipo, setNumeroTipo] = useState<number | "">("");
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [busca, setBusca] = useState("");

    const [camposPorTab, setCamposPorTab] = useState<Record<number, CampoTabFormulario[]>>({});
    const [abertas, setAbertas] = useState<Record<number, boolean>>({});
    // Configuração por idCampoFormulario.
    const [configs, setConfigs] = useState<Record<number, ConfigCampo>>({});

    const tipoSelecionado = useMemo(
        () => tipos.find(t => t.numeroTipo === numeroTipo) ?? null,
        [tipos, numeroTipo]
    );

    const idTabs = useMemo(
        () => [...(tipoSelecionado?.tabsConfiguracao ?? [])]
            .sort((a, b) => a.ordem - b.ordem)
            .map(t => t.idTab),
        [tipoSelecionado]
    );

    const descricaoTab = (idTab: number) => listaNavegacaoBase.find(t => t.id === idTab)?.descricao ?? `Aba ${idTab}`;

    const obterConfig = useCallback((idCampo: number): ConfigCampo => configs[idCampo] ?? CONFIG_VAZIA, [configs]);

    // Carrega os campos de cada aba do tipo selecionado.
    const carregarCampos = useCallback(async (ids: number[]) => {
        if (ids.length === 0) {
            setCamposPorTab({});
            return;
        }
        const resultados = await Promise.all(ids.map(async idTab => {
            try {
                const campos = await ConfiguracaoOcorrenciaService.listarCamposPorTab(idTab);
                return { idTab, campos };
            } catch {
                return { idTab, campos: [] as CampoTabFormulario[] };
            }
        }));
        const mapa: Record<number, CampoTabFormulario[]> = {};
        const exp: Record<number, boolean> = {};
        resultados.forEach(({ idTab, campos }) => { mapa[idTab] = campos; exp[idTab] = true; });
        setCamposPorTab(mapa);
        setAbertas(exp);
    }, []);

    // Reset / pré-carga ao abrir.
    useEffect(() => {
        if (!aberto) return;
        if (subtipoEdicao) {
            setNumeroTipo(subtipoEdicao.numeroTipo);
            setNome(subtipoEdicao.nomeComplemento);
            setDescricao(subtipoEdicao.descricaoComplemento ?? "");
            setAtivo(subtipoEdicao.complementoInativo === 0);
        } else {
            setNumeroTipo("");
            setNome("");
            setDescricao("");
            setAtivo(true);
            setConfigs({});
            setCamposPorTab({});
        }
        setBusca("");
    }, [aberto, subtipoEdicao]);

    // Quando o tipo muda, recarrega campos e (em edição) as regras já existentes.
    useEffect(() => {
        if (!aberto || !tipoSelecionado) return;
        const ids = [...(tipoSelecionado.tabsConfiguracao ?? [])]
            .sort((a, b) => a.ordem - b.ordem)
            .map(t => t.idTab);
        carregarCampos(ids);

        if (subtipoEdicao && subtipoEdicao.numeroTipo === tipoSelecionado.numeroTipo) {
            ConfiguracaoOcorrenciaService.listarRegras(subtipoEdicao.numeroTipo, subtipoEdicao.numeroComplemento)
                .then((regras: RegraCampoOcorrencia[]) => {
                    const mapa: Record<number, ConfigCampo> = {};
                    regras.forEach(r => {
                        mapa[r.idCampoFormulario] = {
                            idRegra: r.id,
                            cadastroVisivel: r.cadastroVisivel,
                            cadastroEditavel: r.cadastroEditavel,
                            edicaoVisivel: r.edicaoVisivel,
                            edicaoEditavel: r.edicaoEditavel,
                            visualizacaoVisivel: r.visualizacaoVisivel,
                            campoObrigatorio: r.campoObrigatorio,
                        };
                    });
                    setConfigs(mapa);
                })
                .catch(() => setConfigs({}));
        } else if (!subtipoEdicao) {
            setConfigs({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipoSelecionado, aberto]);

    const totalConfigurados = useMemo(
        () => Object.values(configs).filter(possuiRegra).length,
        [configs]
    );

    const toggleTab = (idTab: number) => setAbertas(p => ({ ...p, [idTab]: !p[idTab] }));

    // Atualiza uma flag de um campo, aplicando as dependências entre as colunas:
    // Editar/Obrigatório de um fluxo só valem se o Visualizar do mesmo fluxo estiver
    // marcado. Desmarcar o Visualizar limpa as demais flags daquele fluxo.
    const alterarFlag = (idCampo: number, flag: FlagCampo, valor: boolean) => {
        setConfigs(prev => {
            const atual = prev[idCampo] ?? CONFIG_VAZIA;
            const novo: ConfigCampo = { ...atual, [flag]: valor };

            if (flag === "cadastroVisivel" && !valor) {
                novo.cadastroEditavel = false;
            }
            if (flag === "edicaoVisivel" && !valor) {
                novo.edicaoEditavel = false;
            }

            return { ...prev, [idCampo]: novo };
        });
    };

    const camposFiltrados = (campos: CampoTabFormulario[]) => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return campos;
        return campos.filter(c => c.label.toLowerCase().includes(termo));
    };

    const handleTipo = (e: ChangeEvent<HTMLSelectElement>) => {
        setNumeroTipo(e.target.value === "" ? "" : Number(e.target.value));
    };

    // Sincroniza as regras: cria/atualiza as configuradas e remove as que ficaram sem flag.
    const sincronizarRegras = async (idTipo: number, idComplemento: number) => {
        let existentes: RegraCampoOcorrencia[] = [];
        try {
            existentes = await ConfiguracaoOcorrenciaService.listarRegras(idTipo, idComplemento);
        } catch {
            existentes = [];
        }
        const porCampo = new Map(existentes.map(r => [r.idCampoFormulario, r]));

        const operacoes: Promise<unknown>[] = [];

        Object.entries(configs).forEach(([idCampoStr, cfg]) => {
            const idCampo = Number(idCampoStr);
            const existente = porCampo.get(idCampo);
            const temRegra = possuiRegra(cfg);

            if (temRegra) {
                const payload: RegraCampoPayload = {
                    Id: existente?.id ?? 0,
                    IdCampoFormulario: idCampo,
                    IdTipoOcorrencia: idTipo,
                    IdComplementoOcorrencia: idComplemento,
                    CadastroVisivel: cfg.cadastroVisivel,
                    CadastroEditavel: cfg.cadastroEditavel,
                    EdicaoVisivel: cfg.edicaoVisivel,
                    EdicaoEditavel: cfg.edicaoEditavel,
                    VisualizacaoVisivel: cfg.visualizacaoVisivel,
                    CampoObrigatorio: cfg.campoObrigatorio,
                };
                if (existente) {
                    operacoes.push(ConfiguracaoOcorrenciaService.atualizarRegra(payload).catch(() => undefined));
                } else {
                    operacoes.push(ConfiguracaoOcorrenciaService.criarRegra(payload).catch(() => undefined));
                }
            } else if (existente) {
                operacoes.push(ConfiguracaoOcorrenciaService.removerRegra(existente.id).catch(() => undefined));
            }
        });

        await Promise.all(operacoes);
    };

    const handleSalvar = async () => {
        if (numeroTipo === "") { toast.error("Selecione o tipo da ocorrência"); return; }
        if (nome.trim() === "") { toast.error("O nome do complemento é obrigatório"); return; }

        setLoading(true);
        try {
            const payload = {
                NumeroTipo: numeroTipo as number,
                NumeroComplemento: subtipoEdicao?.numeroComplemento ?? 0,
                NomeComplemento: nome.trim(),
                DescricaoComplemento: descricao.trim(),
                ComplementoInativo: ativo ? 0 : 1
            };

            // O endpoint dedicado retorna o numeroComplemento gerado, dispensando
            // qualquer resolução por nome.
            let idComplemento: number;
            if (editando) {
                await ConfiguracaoOcorrenciaService.atualizarSubtipo(payload);
                idComplemento = subtipoEdicao!.numeroComplemento;
            } else {
                idComplemento = await ConfiguracaoOcorrenciaService.inserirSubtipo(payload);
            }

            await sincronizarRegras(numeroTipo as number, idComplemento);
            toast.success(editando ? "Subtipo atualizado com sucesso" : "Subtipo criado com sucesso");
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
                        <MdAccountTree size={24} />
                        <h3>{editando ? "Editar Complemento da ocorrência" : "Novo Complemento da ocorrência"}</h3>
                    </div>
                    <p>Selecione o tipo de ocorrência e configure cada campo nos fluxos de Cadastro, Edição e Visualização.</p>
                    <button className="fechar" onClick={onFechar} aria-label="Fechar"><MdClose size={20} /></button>
                </ModalCabecalho>

                <ModalCorpo>
                    <PassoTitulo>
                        <span className="numero">1</span>
                        <span className="texto">Identificação</span>
                    </PassoTitulo>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <Campo>
                            <label>Tipo de ocorrência</label>
                            <select value={numeroTipo} onChange={handleTipo} disabled={editando}>
                                <option value="">Selecione o tipo</option>
                                {tipos.map(t => (
                                    <option key={t.numeroTipo} value={t.numeroTipo}>{t.nomeTipo}</option>
                                ))}
                            </select>
                        </Campo>
                        <Campo>
                            <label>Nome do complemento</label>
                            <input type="text" placeholder="Ex.: Colisão" value={nome}
                                onChange={(e) => setNome(e.target.value)} />
                        </Campo>
                    </div>

                    <Campo>
                        <label>Descrição</label>
                        <textarea placeholder="Breve descrição do complemento" value={descricao}
                            onChange={(e) => setDescricao(e.target.value)} />
                    </Campo>

                    <SwitchCard>
                        <div className="info"><strong>Status (ativo)</strong></div>
                        <Switch ativo={ativo} onClick={() => setAtivo(v => !v)} aria-label="Alternar status" />
                    </SwitchCard>

                    <PassoTitulo>
                        <span className="numero">2</span>
                        <span className="texto">Configuração dos campos por fluxo</span>
                        <ContadorBadge className="destaque">{totalConfigurados} campos configurados</ContadorBadge>
                    </PassoTitulo>

                    {!tipoSelecionado ? (
                        <PlaceholderCampos>
                            Selecione um tipo para visualizar as abas e campos disponíveis.
                        </PlaceholderCampos>
                    ) : idTabs.length === 0 ? (
                        <PlaceholderCampos>
                            O tipo selecionado não possui abas configuradas.
                        </PlaceholderCampos>
                    ) : (
                        <>
                            <SecaoTitulo style={{ marginBottom: 10 }}>
                                <Campo style={{ width: "100%", marginBottom: 0, position: "relative" }}>
                                    <MdSearch size={18} style={{ position: "absolute", left: 12, top: 12, color: cores.neutro }} />
                                    <input type="text" placeholder="Buscar campo..." value={busca}
                                        style={{ paddingLeft: 38 }}
                                        onChange={(e) => setBusca(e.target.value)} />
                                </Campo>
                            </SecaoTitulo>

                            {idTabs.map(idTab => {
                                const campos = camposPorTab[idTab] ?? [];
                                const filtrados = camposFiltrados(campos);
                                const aberta = abertas[idTab] ?? false;
                                return (
                                    <Accordion key={idTab}>
                                        <AccordionTopo aberta={aberta} onClick={() => toggleTab(idTab)} type="button">
                                            <span className="nome">{descricaoTab(idTab)}</span>
                                            <span className="chevron">
                                                {aberta ? <MdExpandMore size={20} /> : <MdChevronRight size={20} />}
                                            </span>
                                        </AccordionTopo>
                                        {aberta && (
                                            <AccordionCorpo>
                                                {campos.length === 0 ? (
                                                    <small style={{ color: cores.textoSuave }}>
                                                        Nenhum campo cadastrado para esta aba.
                                                    </small>
                                                ) : filtrados.length === 0 ? (
                                                    <small style={{ color: cores.textoSuave }}>
                                                        Nenhum campo corresponde à busca.
                                                    </small>
                                                ) : (
                                                    <ConfigScroll>
                                                        <ConfigCabecalho>
                                                            <div className="col-campo">Campo</div>

                                                            <div className="grupo-titulo grupo-cadastro">Tela de Cadastro</div>
                                                            <div className="grupo-titulo grupo-editar">Tela de Edição</div>
                                                            <div className="grupo-titulo grupo-obrigatorio">Obrigatório</div>
                                                            <div className="grupo-titulo grupo-visualizar">Visualizar</div>

                                                            <div className="sub">Exibir</div>
                                                            <div className="sub">Cadastrar</div>
                                                            <div className="sub">Exibir</div>
                                                            <div className="sub">Editar</div>

                                                        </ConfigCabecalho>

                                                        {filtrados.map(campo => {
                                                            const cfg = obterConfig(campo.id);
                                                            return (
                                                                <ConfigLinha key={campo.id}>
                                                                    <div className="nome-campo">{campo.label}</div>

                                                                    <div className="celula">
                                                                        <ConfigCheck type="checkbox" aria-label="Cadastro - Visualizar"
                                                                            checked={cfg.cadastroVisivel}
                                                                            onChange={(e) => alterarFlag(campo.id, "cadastroVisivel", e.target.checked)} />
                                                                    </div>
                                                                    <div className="celula">
                                                                        <ConfigCheck type="checkbox" aria-label="Cadastro - Cadastrar"
                                                                            checked={cfg.cadastroEditavel}
                                                                            disabled={!cfg.cadastroVisivel}
                                                                            onChange={(e) => alterarFlag(campo.id, "cadastroEditavel", e.target.checked)} />
                                                                    </div>

                                                                    <div className="celula">
                                                                        <ConfigCheck type="checkbox" aria-label="Editar - Visualizar"
                                                                            checked={cfg.edicaoVisivel}
                                                                            onChange={(e) => alterarFlag(campo.id, "edicaoVisivel", e.target.checked)} />
                                                                    </div>

                                                                    <div className="celula">
                                                                        <ConfigCheck type="checkbox" aria-label="Editar - Editar"
                                                                            checked={cfg.edicaoEditavel}
                                                                            disabled={!cfg.edicaoVisivel}
                                                                            onChange={(e) => alterarFlag(campo.id, "edicaoEditavel", e.target.checked)} />
                                                                    </div>

                                                                     <div className="celula">
                                                                        <ConfigCheck type="checkbox" aria-label="Obrigatório"
                                                                            checked={cfg.campoObrigatorio}
                                                                            onChange={(e) => alterarFlag(campo.id, "campoObrigatorio", e.target.checked)} />
                                                                    </div>

                                                                    <div className="celula">
                                                                        <ConfigCheck type="checkbox" aria-label="Visualizar - Visualizar"
                                                                            checked={cfg.visualizacaoVisivel}
                                                                            onChange={(e) => alterarFlag(campo.id, "visualizacaoVisivel", e.target.checked)} />
                                                                    </div>

                                                                   
                                                                </ConfigLinha>
                                                            );
                                                        })}
                                                    </ConfigScroll>
                                                )}
                                            </AccordionCorpo>
                                        )}
                                    </Accordion>
                                );
                            })}
                        </>
                    )}
                </ModalCorpo>

                <ModalRodape>
                    <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
                    <BotaoConfirmar onClick={handleSalvar}>
                        {editando ? "Salvar alterações" : "Criar Subtipo"}
                    </BotaoConfirmar>
                </ModalRodape>
            </ModalCaixa>
        </ModalOverlay>
    );
}
