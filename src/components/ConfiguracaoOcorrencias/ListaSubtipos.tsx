import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { MdSearch, MdAdd, MdEdit, MdInbox } from 'react-icons/md';
import { TipoOcorrencia, ComplementoOcorrencia } from '../../types';
import { LinhaSubtipo, TAMANHO_PAGINA } from './types';
import capitalize from 'capitalize-pt-br';
import {
    BarraFerramentas,
    CampoBusca,
    BotaoPrimario,
    Tabela,
    LinhaCabecalho,
    Linha,
    Switch,
    AcoesInline,
    NomeTipoForte,
    Vazio,
    ContainerPaginacao,
} from './styles';

type Props = {
    tipos: TipoOcorrencia[];
    subtipos: ComplementoOcorrencia[];
    tipoSelecionado: number | '';
    carregando: boolean;
    onSelecionarTipo: (numeroTipo: number | '') => void;
    onNovo: () => void;
    onEditar: (subtipo: LinhaSubtipo) => void;
    onAlternarStatus: (subtipo: LinhaSubtipo) => void;
};

const COLUNAS = '40px 1.2fr 1.8fr 120px 120px';

export default function ListaSubtipos({
    tipos,
    subtipos,
    tipoSelecionado,
    carregando,
    onSelecionarTipo,
    onNovo,
    onEditar,
    onAlternarStatus,
}: Props) {
    const [busca, setBusca] = useState('');
    const [pagina, setPagina] = useState(0);

    const nomeTipoSelecionado = useMemo(
        () => tipos.find((t) => t.numeroTipo === tipoSelecionado)?.nomeTipo ?? '',
        [tipos, tipoSelecionado]
    );

    // Monta as linhas de subtipo a partir dos complementos carregados sob demanda.
    const linhas = useMemo<LinhaSubtipo[]>(() => {
        if (tipoSelecionado === '') return [];
        return subtipos.map((c) => ({
            numeroTipo: tipoSelecionado,
            nomeTipo: nomeTipoSelecionado,
            complemento: c,
        }));
    }, [subtipos, tipoSelecionado, nomeTipoSelecionado]);

    const filtrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return linhas;
        return linhas.filter(
            (s) =>
                s.complemento.nomeComplemento?.toLowerCase().includes(termo) ||
                s.complemento.descricaoComplemento?.toLowerCase().includes(termo)
        );
    }, [linhas, busca]);

    const total = filtrados.length;
    const pageCount = Math.ceil(total / TAMANHO_PAGINA);
    const paginaAtual = useMemo(
        () => filtrados.slice(pagina * TAMANHO_PAGINA, pagina * TAMANHO_PAGINA + TAMANHO_PAGINA),
        [filtrados, pagina]
    );

    // Volta à primeira página ao buscar/trocar de tipo.
    useEffect(() => {
        setPagina(0);
    }, [busca, tipoSelecionado]);

    // Reajusta a página se ficar fora do range após recarga/exclusão.
    useEffect(() => {
        if (pagina > 0 && pagina >= pageCount) setPagina(Math.max(0, pageCount - 1));
    }, [pageCount, pagina]);

    const semTipo = tipoSelecionado === '';

    return (
        <>
            <BarraFerramentas>
                <div className="d-flex gap-3 align-items-end">
                    <div style={{ minWidth: 220 }}>
                        <small>Tipo da ocorrência</small>
                        <select
                            className="form-select"
                            value={tipoSelecionado}
                            onChange={(e) => onSelecionarTipo(e.target.value === '' ? '' : Number(e.target.value))}
                        >
                            <option value="">Selecione um tipo</option>
                            {
                            tipos.filter(x => x.tipoInativo === 0).map((tipoOcorrencia) => (
                                <option
                                    key={tipoOcorrencia.numeroTipo}
                                    value={tipoOcorrencia.numeroTipo}>
                                    {capitalize(tipoOcorrencia.nomeTipo)}
                                </option>
                            ))
                        }
                        <option disabled style={{ color: 'darkgray' }}>────────── (Inativos) ──────────</option>
                        {
                            tipos.filter(x => x.tipoInativo === 1).map((tipoOcorrencia) => (
                                <option
                                    key={tipoOcorrencia.numeroTipo}
                                    value={tipoOcorrencia.numeroTipo} style={{ fontStyle: 'italic', color: 'darkgray' }}>
                                    {capitalize(tipoOcorrencia.nomeTipo)}
                                </option>
                            ))
                        }
                        </select>
                    </div>
                    <CampoBusca>
                        <MdSearch size={18} />
                        <input className="form-control" placeholder="Buscar subtipo..." value={busca} onChange={(e) => setBusca(e.target.value)} disabled={semTipo} />
                    </CampoBusca>
                </div>
                <BotaoPrimario onClick={onNovo}>
                    <MdAdd size={18} /> Novo Subtipo
                </BotaoPrimario>
            </BarraFerramentas>

            <Tabela>
                <LinhaCabecalho colunas={COLUNAS}>
                    <span>Id</span>
                    <span>Nome</span>
                    <span>Descrição</span>
                    <span>Status</span>
                    <span>Editar</span>
                </LinhaCabecalho>

                {semTipo ? (
                    <Vazio>
                        <div>
                            <MdInbox size={36} />
                        </div>
                        Selecione um tipo para visualizar os subtipos.
                    </Vazio>
                ) : carregando ? (
                    <Vazio>
                        <div>
                            <MdInbox size={36} />
                        </div>
                        Carregando subtipos...
                    </Vazio>
                ) : paginaAtual.length === 0 ? (
                    <Vazio>
                        <div>
                            <MdInbox size={36} />
                        </div>
                        Nenhum subtipo encontrado.
                    </Vazio>
                ) : (
                    paginaAtual.map((s) => {
                        const idLinha = `sub-${s.numeroTipo}-${s.complemento.numeroComplemento}`;
                        const ativoSub = s.complemento.complementoInativo === 0;
                        return (
                            <Linha colunas={COLUNAS} key={idLinha}>
                                <span>{s.complemento.numeroComplemento}</span>

                                <span>
                                    <NomeTipoForte>{capitalize(s.complemento.nomeComplemento)}</NomeTipoForte>
                                </span>
                                <span>{capitalize(s.complemento.descricaoComplemento)}</span>
                                <span>
                                    <Switch
                                        ativo={ativoSub}
                                        onClick={() => onAlternarStatus(s)}
                                        title={ativoSub ? 'Desativar' : 'Ativar'}
                                        aria-label={ativoSub ? 'Desativar' : 'Ativar'}
                                    />
                                </span>
                                <AcoesInline>
                                    <button onClick={() => onEditar(s)} title="Editar" aria-label="Editar">
                                        <MdEdit size={18} />
                                    </button>
                                </AcoesInline>
                            </Linha>
                        );
                    })
                )}
            </Tabela>

            {total > 0 && (
                <div className="col d-flex justify-content-between mt-2">
                    <small className="mt-2 fw-bold">Total: {total}</small>
                    <ContainerPaginacao>
                        <ReactPaginate
                            previousLabel={<RiArrowLeftSLine />}
                            nextLabel={<RiArrowRightSLine />}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            forcePage={pagina}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={(data) => setPagina(data.selected)}
                            containerClassName={'pagination text-pagination'}
                            pageClassName={'newpage'}
                            previousClassName={'newpage '}
                            nextClassName={'newpage'}
                            breakClassName={'newpage'}
                            activeClassName={'active'}
                        />
                    </ContainerPaginacao>
                </div>
            )}
        </>
    );
}
