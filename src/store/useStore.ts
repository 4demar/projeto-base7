import { useState, useCallback, useEffect } from 'react';
import {
    LembreteDto, BannerProject, TipoOcorrencia, TabFormulario,
    ComplementoOcorrencia, CampoTabFormulario, RegraCampoOcorrencia,
} from '../types';
import {
    tipoOcorrenciaRepo, tabFormularioRepo, complementoOcorrenciaRepo,
    campoFormularioRepo, regraCampoOcorrenciaRepo,
} from '../database';

const LEMBRETE_KEY = 'devportal_lembrete';

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch { return fallback; }
}

function saveToStorage<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function useLembrete() {
    const [lembrete, setLembrete] = useState<LembreteDto[]>(() => loadFromStorage(LEMBRETE_KEY, []));

    const addLembrete = useCallback((Lembrete: Omit<LembreteDto, 'id' | 'createdAt'>) => {
        const newLembrete: LembreteDto = {
            ...Lembrete,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setLembrete(prev => {
            const updated = [newLembrete, ...prev];
            saveToStorage(LEMBRETE_KEY, updated);
            return updated;
        });
        return newLembrete;
    }, []);

    const toggleLembrete = useCallback((id: string) => {
        setLembrete(prev => {
            const updated = prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
            saveToStorage(LEMBRETE_KEY, updated);
            return updated;
        });
    }, []);

    const deleteLembrete = useCallback((id: string) => {
        setLembrete(prev => {
            const updated = prev.filter(r => r.id !== id);
            saveToStorage(LEMBRETE_KEY, updated);
            return updated;
        });
    }, []);

    return { lembrete, addLembrete, toggleLembrete, deleteLembrete };
}


const BANNER_PROJECTS_KEY = 'devportal_banner_projects';

export function useBannerEditor(): {
    projects: BannerProject[];
    saveProject: (project: Omit<BannerProject, 'id' | 'createdAt' | 'updatedAt'>) => BannerProject;
    updateProject: (project: BannerProject) => void;
    loadProject: (id: string) => BannerProject | undefined;
    deleteProject: (id: string) => void;
} {
    const [projects, setProjects] = useState<BannerProject[]>(() =>
        loadFromStorage<BannerProject>(BANNER_PROJECTS_KEY, [])
    );

    const saveProject = useCallback((project: Omit<BannerProject, 'id' | 'createdAt' | 'updatedAt'>): BannerProject => {
        const now = new Date().toISOString();
        const newProject: BannerProject = {
            ...project,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
        };
        setProjects(prev => {
            const updated = [newProject, ...prev];
            saveToStorage(BANNER_PROJECTS_KEY, updated);
            return updated;
        });
        return newProject;
    }, []);

    const updateProject = useCallback((project: BannerProject): void => {
        setProjects(prev => {
            const updated = prev.map(p => p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p);
            saveToStorage(BANNER_PROJECTS_KEY, updated);
            return updated;
        });
    }, []);

    const loadProject = useCallback((id: string): BannerProject | undefined => {
        return projects.find(p => p.id === id);
    }, [projects]);

    const deleteProject = useCallback((id: string): void => {
        setProjects(prev => {
            const updated = prev.filter(p => p.id !== id);
            saveToStorage(BANNER_PROJECTS_KEY, updated);
            return updated;
        });
    }, []);

    return { projects, saveProject, updateProject, loadProject, deleteProject };
}


// ===== Cadastro de Ocorrência (IndexedDB) =====

// Catálogo base de tabs (tabelas do formulário) carregado na primeira execução.
const listaTabsBase: TabFormulario[] = [
    { id: 0, nome: 'DadosOcorrencia', descricao: 'Dados da ocorrência' },
    { id: 1, nome: 'DetalhesOcorrencia', descricao: 'Detalhes da ocorrência' },
    { id: 2, nome: 'ProdutosOcorrencia', descricao: 'Produtos da ocorrência' },
    { id: 3, nome: 'InformacoesVeiculos', descricao: 'Informações do veículo' },
    { id: 4, nome: 'Envolvidos', descricao: 'Envolvidos' },
    { id: 5, nome: 'AnexarArquivos', descricao: 'Anexar arquivos' },
    { id: 6, nome: 'DevolucaoCliente', descricao: 'Devolução ao cliente' },
    { id: 7, nome: 'AnaliseOcorrencia', descricao: 'Análise da ocorrência' },
    { id: 8, nome: 'AnotacoesOcorrencia', descricao: 'Anotações' },
    { id: 9, nome: 'OcorrenciaRelacionada', descricao: 'Ocorrências relacionadas' },
];

// Catálogo base de campos por tab (idTab referencia listaTabsBase).
const listaCamposBase: CampoTabFormulario[] = [
    // DadosOcorrencia (0)
    { id: 0, idTab: 0, nome: 'numeroOcorrencia', label: 'Número da ocorrência' },
    { id: 1, idTab: 0, nome: 'data', label: 'Data' },
    { id: 2, idTab: 0, nome: 'hora', label: 'Hora' },
    { id: 3, idTab: 0, nome: 'prioridade', label: 'Prioridade' },
    // DetalhesOcorrencia (1)
    { id: 4, idTab: 1, nome: 'descricao', label: 'Descrição' },
    { id: 5, idTab: 1, nome: 'categoria', label: 'Categoria' },
    { id: 6, idTab: 1, nome: 'gravidade', label: 'Gravidade' },
    // ProdutosOcorrencia (2)
    { id: 7, idTab: 2, nome: 'produto', label: 'Produto' },
    { id: 8, idTab: 2, nome: 'quantidade', label: 'Quantidade' },
    { id: 9, idTab: 2, nome: 'valor', label: 'Valor' },
    // InformacoesVeiculos (3)
    { id: 10, idTab: 3, nome: 'placa', label: 'Placa' },
    { id: 11, idTab: 3, nome: 'modelo', label: 'Modelo' },
    { id: 12, idTab: 3, nome: 'marca', label: 'Marca' },
    { id: 13, idTab: 3, nome: 'cor', label: 'Cor' },
    // Envolvidos (4)
    { id: 14, idTab: 4, nome: 'nome', label: 'Nome' },
    { id: 15, idTab: 4, nome: 'documento', label: 'Documento' },
    { id: 16, idTab: 4, nome: 'papel', label: 'Papel' },
    // AnexarArquivos (5)
    { id: 17, idTab: 5, nome: 'foto', label: 'Foto' },
    { id: 18, idTab: 5, nome: 'documentoAnexo', label: 'Documento' },
    // DevolucaoCliente (6)
    { id: 19, idTab: 6, nome: 'dataDevolucao', label: 'Data da devolução' },
    { id: 20, idTab: 6, nome: 'responsavelDevolucao', label: 'Responsável' },
    // AnaliseOcorrencia (7)
    { id: 21, idTab: 7, nome: 'parecer', label: 'Parecer' },
    { id: 22, idTab: 7, nome: 'analista', label: 'Analista' },
    // AnotacoesOcorrencia (8)
    { id: 23, idTab: 8, nome: 'anotacao', label: 'Anotação' },
    // OcorrenciaRelacionada (9)
    { id: 24, idTab: 9, nome: 'numeroRelacionada', label: 'Número da ocorrência relacionada' },
];

// Garante que o catálogo de tabs e campos exista no IndexedDB (executa uma única vez).
let seedPromise: Promise<void> | null = null;
function ensureSeed(): Promise<void> {
    if (!seedPromise) {
        seedPromise = (async () => {
            const tabsExistentes = await tabFormularioRepo.getAll();
            if (tabsExistentes.length === 0) {
                for (const tab of listaTabsBase) {
                    await tabFormularioRepo.update(tab);
                }
            }
            const camposExistentes = await campoFormularioRepo.getAll();
            if (camposExistentes.length === 0) {
                for (const campo of listaCamposBase) {
                    await campoFormularioRepo.update(campo);
                }
            }
        })();
    }
    return seedPromise;
}

export function useTipoOcorrencia() {
    const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);
    const [tabs, setTabs] = useState<TabFormulario[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        await ensureSeed();
        const [listaTipos, listaTabs] = await Promise.all([
            tipoOcorrenciaRepo.getAll(),
            tabFormularioRepo.getAll(),
        ]);
        setTipos(listaTipos);
        setTabs(listaTabs);
    }, []);

    useEffect(() => {
        let ativo = true;
        refresh().finally(() => { if (ativo) setLoading(false); });
        return () => { ativo = false; };
    }, [refresh]);

    const createTipo = useCallback(async (data: Omit<TipoOcorrencia, 'id'>) => {
        await tipoOcorrenciaRepo.create(data);
        await refresh();
    }, [refresh]);

    const updateTipo = useCallback(async (data: TipoOcorrencia) => {
        await tipoOcorrenciaRepo.update(data);
        await refresh();
    }, [refresh]);

    const removeTipo = useCallback(async (id: number) => {
        await tipoOcorrenciaRepo.remove(id);
        await refresh();
    }, [refresh]);

    return { tipos, tabs, loading, createTipo, updateTipo, removeTipo };
}

// Apenas o catálogo de tabs (para exibir nomes nas configurações).
export function useTabsFormulario() {
    const [tabs, setTabs] = useState<TabFormulario[]>([]);

    useEffect(() => {
        let ativo = true;
        (async () => {
            await ensureSeed();
            const lista = await tabFormularioRepo.getAll();
            if (ativo) setTabs(lista);
        })();
        return () => { ativo = false; };
    }, []);

    return tabs;
}

export function useComplementoOcorrencia() {
    const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);
    const [complementos, setComplementos] = useState<ComplementoOcorrencia[]>([]);
    const [contagemCampos, setContagemCampos] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        await ensureSeed();
        const [listaTipos, listaComplementos, todasRegras] = await Promise.all([
            tipoOcorrenciaRepo.getAll(),
            complementoOcorrenciaRepo.getAll(),
            regraCampoOcorrenciaRepo.getAll(),
        ]);
        setTipos(listaTipos);
        setComplementos(listaComplementos);
        const contagem: Record<number, number> = {};
        for (const regra of todasRegras) {
            contagem[regra.idComplementoOcorrencia] = (contagem[regra.idComplementoOcorrencia] ?? 0) + 1;
        }
        setContagemCampos(contagem);
    }, []);

    useEffect(() => {
        let ativo = true;
        refresh().finally(() => { if (ativo) setLoading(false); });
        return () => { ativo = false; };
    }, [refresh]);

    const createComplemento = useCallback(async (data: Omit<ComplementoOcorrencia, 'id'>) => {
        const id = await complementoOcorrenciaRepo.create(data);
        await refresh();
        return id;
    }, [refresh]);

    const updateComplemento = useCallback(async (data: ComplementoOcorrencia) => {
        await complementoOcorrenciaRepo.update(data);
        await refresh();
    }, [refresh]);

    const removeComplemento = useCallback(async (id: number) => {
        // Remove as regras de campo vinculadas ao complemento antes de excluí-lo.
        const regras = await regraCampoOcorrenciaRepo.getByComplemento(id);
        await Promise.all(regras.map(r => regraCampoOcorrenciaRepo.remove(r.id)));
        await complementoOcorrenciaRepo.remove(id);
        await refresh();
    }, [refresh]);

    return { tipos, complementos, contagemCampos, loading, createComplemento, updateComplemento, removeComplemento };
}

// Gerencia a configuração dos campos (regras) de um complemento:
// quais campos aparecem, e se são editáveis/obrigatórios.
export function useRegrasComplemento(idComplemento: number | null, idsTabs: number[]) {
    const [campos, setCampos] = useState<CampoTabFormulario[]>([]);
    const [regras, setRegras] = useState<RegraCampoOcorrencia[]>([]);
    const [loading, setLoading] = useState(false);

    const idsTabsKey = idsTabs.join(',');

    const refresh = useCallback(async () => {
        if (idComplemento == null) {
            setCampos([]);
            setRegras([]);
            return;
        }
        const ids = idsTabsKey ? idsTabsKey.split(',').map(Number) : [];
        const camposPorTab = await Promise.all(ids.map(id => campoFormularioRepo.getByTab(id)));
        setCampos(camposPorTab.flat());
        setRegras(await regraCampoOcorrenciaRepo.getByComplemento(idComplemento));
    }, [idComplemento, idsTabsKey]);

    useEffect(() => {
        let ativo = true;
        setLoading(true);
        refresh().finally(() => { if (ativo) setLoading(false); });
        return () => { ativo = false; };
    }, [refresh]);

    // Liga/desliga a exibição do campo para o complemento (cria/remove a regra).
    const setExibido = useCallback(async (idCampo: number, exibido: boolean) => {
        if (idComplemento == null) return;
        const existente = regras.find(r => r.idCampoFormulario === idCampo);
        if (exibido && !existente) {
            await regraCampoOcorrenciaRepo.create({
                idCampoFormulario: idCampo,
                idComplementoOcorrencia: idComplemento,
                editavel: true,
                obrigatorio: false,
            });
        } else if (!exibido && existente) {
            await regraCampoOcorrenciaRepo.remove(existente.id);
        }
        await refresh();
    }, [idComplemento, regras, refresh]);

    // Atualiza editável/obrigatório de um campo já exibido.
    const setFlag = useCallback(async (idCampo: number, flag: 'editavel' | 'obrigatorio', valor: boolean) => {
        const existente = regras.find(r => r.idCampoFormulario === idCampo);
        if (!existente) return;
        await regraCampoOcorrenciaRepo.update({ ...existente, [flag]: valor });
        await refresh();
    }, [regras, refresh]);

    return { campos, regras, loading, setExibido, setFlag };
}


// ===== Cadastro de Ocorrência (formulário dinâmico) =====

export interface CampoFormularioOcorrencia {
    campo: CampoTabFormulario;
    editavel: boolean;
    obrigatorio: boolean;
}

export interface TabFormularioOcorrencia {
    tab: TabFormulario;
    campos: CampoFormularioOcorrencia[];
}

// Monta as tabs (na ordem de listaIdTabs do tipo) e, para o subtipo selecionado,
// os campos visíveis em cada tab conforme as regras (editável/obrigatório).
export function useFormularioOcorrencia(idTipo: number | null, idSubtipo: number | null) {
    const [estrutura, setEstrutura] = useState<TabFormularioOcorrencia[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        await ensureSeed();
        if (idTipo == null || idSubtipo == null) {
            setEstrutura([]);
            return;
        }
        const tipo = await tipoOcorrenciaRepo.getById(idTipo);
        if (!tipo) {
            setEstrutura([]);
            return;
        }
        const [todasTabs, regras] = await Promise.all([
            tabFormularioRepo.getAll(),
            regraCampoOcorrenciaRepo.getByComplemento(idSubtipo),
        ]);
        // Mapa de campos visíveis (id -> regra) para o subtipo.
        const camposPorTab = await Promise.all(
            tipo.listaIdTabs.map(idTab => campoFormularioRepo.getByTab(idTab))
        );
        const regraDe = (idCampo: number) => regras.find(r => r.idCampoFormulario === idCampo);

        const resultado: TabFormularioOcorrencia[] = tipo.listaIdTabs.map((idTab, i) => {
            const tab = todasTabs.find(t => t.id === idTab) ?? { id: idTab, nome: `Tab ${idTab}`, descricao: '' };
            const campos = camposPorTab[i]
                .map(campo => {
                    const regra = regraDe(campo.id);
                    return regra ? { campo, editavel: regra.editavel, obrigatorio: regra.obrigatorio } : null;
                })
                .filter((c): c is CampoFormularioOcorrencia => c !== null);
            return { tab, campos };
        }).filter(t => t.campos.length > 0);

        setEstrutura(resultado);
    }, [idTipo, idSubtipo]);

    useEffect(() => {
        let ativo = true;
        setLoading(true);
        refresh().finally(() => { if (ativo) setLoading(false); });
        return () => { ativo = false; };
    }, [refresh]);

    return { estrutura, loading };
}
