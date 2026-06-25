import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MdLayers, MdAccountTree } from 'react-icons/md';
import { useRegrasFormulario } from '../../contexts/RegrasFormularioContext';
import { ConfiguracaoOcorrenciaService } from '../../services/configuracaoOcorrencia';
import ModalTipo from './ModalTipo';
import ModalSubtipo, { SubtipoEdicao } from './ModalSubtipo';
import ListaTipos from './ListaTipos';
import ListaSubtipos from './ListaSubtipos';
import { LinhaSubtipo } from './types';
import { Painel, Cabecalho, TabsTopo, TabBotao } from './styles';
import { ComplementoOcorrencia, TipoOcorrencia } from '../../types';
import { useLoading } from '../../hook/useLoading';

type AbaPainel = 'tipos' | 'subtipos';

export default function ConfiguracaoOcorrencias() {
    const { setLoading } = useLoading();
    const { invalidarComplemento } = useRegrasFormulario();

    const [aba, setAba] = useState<AbaPainel>('tipos');
    const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);

    // Subtipos são carregados sob demanda, apenas quando um tipo é selecionado.
    const [tipoSubtipos, setTipoSubtipos] = useState<number | ''>('');
    const [subtipos, setSubtipos] = useState<ComplementoOcorrencia[]>([]);
    const [carregandoSubtipos, setCarregandoSubtipos] = useState(false);

    const [modalTipo, setModalTipo] = useState(false);
    const [tipoEdicao, setTipoEdicao] = useState<TipoOcorrencia | null>(null);
    const [modalSubtipo, setModalSubtipo] = useState(false);
    const [subtipoEdicao, setSubtipoEdicao] = useState<SubtipoEdicao | null>(null);

    const carregarTipos = useCallback(async () => {
        setLoading(true);
        try {
            // Traz apenas os tipos (sem complementos). Os subtipos são buscados sob
            // demanda por tipo, evitando carregar tudo de uma vez.
            const dados = await ConfiguracaoOcorrenciaService.listarTodosTipos();
            setTipos(dados ?? []);
        } catch {
            // serviço já exibe toast
        } finally {
            setLoading(false);
        }
        // setLoading é recriado a cada render pelo LoadingProvider; mantê-lo fora das
        // dependências evita um loop infinito de recarga/toasts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        carregarTipos();
    }, [carregarTipos]);

    // Carrega os subtipos de um tipo específico (sob demanda).
    const carregarSubtipos = useCallback(async (numeroTipo: number | '') => {
        setTipoSubtipos(numeroTipo);
        if (numeroTipo === '') {
            setSubtipos([]);
            return;
        }
        setCarregandoSubtipos(true);
        try {
            const dados = await ConfiguracaoOcorrenciaService.listarSubtipos(numeroTipo);
            setSubtipos(dados ?? []);
        } catch {
            setSubtipos([]);
        } finally {
            setCarregandoSubtipos(false);
        }
    }, []);

    // ===== Ações de Tipo =====
    const abrirNovoTipo = () => {
        setTipoEdicao(null);
        setModalTipo(true);
    };
    const abrirEditarTipo = (t: TipoOcorrencia) => {
        setTipoEdicao(t);
        setModalTipo(true);
    };

    const alternarStatusTipo = async (t: TipoOcorrencia) => {
        setLoading(true);
        try {
            await ConfiguracaoOcorrenciaService.atualizarTipo(
                {
                    NumeroTipo: t.numeroTipo,
                    Nome: t.nomeTipo,
                    Descricao: t.descricaoTipo,
                    Inativo: t.tipoInativo === 0 ? 1 : 0,
                    Tabs: (t.tabsConfiguracao ?? []).map(tab => ({
                        IdTab: tab.idTab,
                        Ordem: tab.ordem,
                        Visualizar: tab.visualizar,
                        Editar: tab.editar,
                        Cadastrar: tab.cadastrar,
                    })),
                }
            );
            toast.success('Status atualizado');
            await carregarTipos();
        } catch {
            // toast no serviço
        } finally {
            setLoading(false);
        }
    };

    // ===== Ações de Subtipo =====
    const abrirNovoSubtipo = () => {
        setSubtipoEdicao(null);
        setModalSubtipo(true);
    };
    const abrirEditarSubtipo = (s: LinhaSubtipo) => {
        setSubtipoEdicao({
            numeroTipo: s.numeroTipo,
            numeroComplemento: s.complemento.numeroComplemento,
            nomeComplemento: s.complemento.nomeComplemento,
            descricaoComplemento: s.complemento.descricaoComplemento,
            complementoInativo: s.complemento.complementoInativo,
        });
        setModalSubtipo(true);
    };

    const alternarStatusSubtipo = async (s: LinhaSubtipo) => {
        setLoading(true);
        try {
            await ConfiguracaoOcorrenciaService.atualizarSubtipo(
                {
                    NumeroTipo: s.numeroTipo,
                    NumeroComplemento: s.complemento.numeroComplemento,
                    NomeComplemento: s.complemento.nomeComplemento,
                    DescricaoComplemento: s.complemento.descricaoComplemento,
                    ComplementoInativo: s.complemento.complementoInativo === 0 ? 1 : 0,
                }
            );
            //invalidarComplemento para evitar carregar regras com dados desatualizados
            invalidarComplemento(s.numeroTipo, s.complemento.numeroComplemento);
            toast.success('Status atualizado');
            await carregarSubtipos(tipoSubtipos);
        } catch {
            // toast no serviço
        } finally {
            setLoading(false);
        }
    };

    return (
        <Painel>
            <Cabecalho>
                <h2>Configuração de Regras Dinâmicas</h2>
                <p>Configure Tipos e Subtipos de ocorrência sem necessidade de desenvolvimento.</p>
            </Cabecalho>

            <TabsTopo>
                <TabBotao ativa={aba === 'tipos'} onClick={() => setAba('tipos')}>
                    <MdLayers size={18} /> Tipos
                </TabBotao>
                <TabBotao ativa={aba === 'subtipos'} onClick={() => setAba('subtipos')}>
                    <MdAccountTree size={18} /> Subtipos
                </TabBotao>
            </TabsTopo>

            {aba === 'tipos' ? (
                <ListaTipos tipos={tipos} onNovo={abrirNovoTipo} onEditar={abrirEditarTipo} onAlternarStatus={alternarStatusTipo} />
            ) : (
                <ListaSubtipos
                    tipos={tipos}
                    subtipos={subtipos}
                    tipoSelecionado={tipoSubtipos}
                    carregando={carregandoSubtipos}
                    onSelecionarTipo={carregarSubtipos}
                    onNovo={abrirNovoSubtipo}
                    onEditar={abrirEditarSubtipo}
                    onAlternarStatus={alternarStatusSubtipo}
                />
            )}

            <ModalTipo
                aberto={modalTipo}
                tipoEdicao={tipoEdicao}
                onFechar={() => setModalTipo(false)}
                onSalvo={() => {
                    setModalTipo(false);
                    carregarTipos();
                }}
            />

            <ModalSubtipo
                aberto={modalSubtipo}
                tipos={tipos}
                subtipoEdicao={subtipoEdicao}
                onFechar={() => setModalSubtipo(false)}
                onSalvo={() => {
                    setModalSubtipo(false);
                    // Regras do subtipo podem ter mudado: invalida o cache usado pelo
                    // fluxo de cadastro/edição para forçar recarga na próxima seleção.
                    if (subtipoEdicao) invalidarComplemento(subtipoEdicao.numeroTipo, subtipoEdicao.numeroComplemento);
                    if (tipoSubtipos !== '') carregarSubtipos(tipoSubtipos);
                }}
            />
        </Painel>
    );
}
