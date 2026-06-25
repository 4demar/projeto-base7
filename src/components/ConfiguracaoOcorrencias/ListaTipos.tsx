import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { MdSearch, MdAdd, MdEdit, MdInbox } from 'react-icons/md';
import { TipoOcorrencia } from '../../types';
import { TAMANHO_PAGINA } from './types';
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
    Vazio,
    ContainerPaginacao,
} from './styles';

type Props = {
    tipos: TipoOcorrencia[];
    onNovo: () => void;
    onEditar: (tipo: TipoOcorrencia) => void;
    onAlternarStatus: (tipo: TipoOcorrencia) => void;
};
const COLUNAS = '40px 1.5fr 2.5fr 120px 100px';

export default function ListaTipos({ tipos, onNovo, onEditar, onAlternarStatus }: Props) {
    const [busca, setBusca] = useState('');
    const [pagina, setPagina] = useState(0);

    const filtrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return tipos;
        return tipos.filter((t) => t.nomeTipo?.toLowerCase().includes(termo) || t.descricaoTipo?.toLowerCase().includes(termo));
    }, [tipos, busca]);

    const total = filtrados.length;
    const pageCount = Math.ceil(total / TAMANHO_PAGINA);
    const paginaAtual = useMemo(
        () => filtrados.slice(pagina * TAMANHO_PAGINA, pagina * TAMANHO_PAGINA + TAMANHO_PAGINA),
        [filtrados, pagina]
    );

    // Volta à primeira página ao buscar.
    useEffect(() => {
        setPagina(0);
    }, [busca]);

    // Reajusta a página se ficar fora do range após recarga/exclusão.
    useEffect(() => {
        if (pagina > 0 && pagina >= pageCount) setPagina(Math.max(0, pageCount - 1));
    }, [pageCount, pagina]);

    return (
        <>
            <BarraFerramentas>
                <CampoBusca>
                    <MdSearch size={18} />
                    <input placeholder="Buscar tipo..." value={busca} onChange={(e) => setBusca(e.target.value)} />
                </CampoBusca>
                <BotaoPrimario onClick={onNovo}>
                    <MdAdd size={18} /> Novo Tipo
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

                {paginaAtual.length === 0 ? (
                    <Vazio>
                        <div>
                            <MdInbox size={36} />
                        </div>
                        Nenhum tipo encontrado.
                    </Vazio>
                ) : (
                    paginaAtual.map((t) => {
                        const ativo = t.tipoInativo === 0;
                        return (
                            <Linha colunas={COLUNAS} key={t.numeroTipo}>
                                <span>{t.numeroTipo}</span>
                                <span className="nome">{capitalize(t.nomeTipo)}</span>
                                <span className="descricao">{t.descricaoTipo}</span>
                                <span>
                                    <Switch
                                        ativo={ativo}
                                        onClick={() => onAlternarStatus(t)}
                                        title={ativo ? 'Desativar' : 'Ativar'}
                                        aria-label={ativo ? 'Desativar' : 'Ativar'}
                                    />
                                </span>
                                <AcoesInline>
                                    <button onClick={() => onEditar(t)} title="Editar" aria-label="Editar">
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
