import { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Stack, Button, IconButton, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { Add, Visibility, Edit } from '@mui/icons-material';
import { TipoOcorrencia } from '../types';
import { ConfiguracaoOcorrenciaService } from '../services/configuracaoOcorrencia';
import { useFormBoletimCadastro, FormActions } from '../contexts/FormCadastroContext';
import { useControleBoletimOcorrencia } from '../contexts/ControleBoletimContext';
import ModalEditarOcorrencia from '../components/Ocorrencias/modalEditar';
import ModalCadastroOcorrencia from '../components/Ocorrencias/modalCadastro';
import { OcorrenciaSalva, carregarOcorrencias } from '../components/Ocorrencias/storage';

export default function OcorrenciasPage() {
    const { dispatch } = useFormBoletimCadastro();
    const { setSomenteVisualizacao } = useControleBoletimOcorrencia();
    // Tipos ativos para o cadastro; catálogo completo para exibir ocorrências já gravadas.
    const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);
    const [tiposExibicao, setTiposExibicao] = useState<TipoOcorrencia[]>([]);
    const [ocorrencias, setOcorrencias] = useState<OcorrenciaSalva[]>(carregarOcorrencias);
    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [ocorrenciaModal, setOcorrenciaModal] = useState<OcorrenciaSalva | null>(null);

    useEffect(() => {
        ConfiguracaoOcorrenciaService.buscarTiposParaFluxo()
            .then(dados => setTipos(dados ?? []))
            .catch(() => setTipos([]));
        ConfiguracaoOcorrenciaService.buscarTiposParaExibicao()
            .then(dados => setTiposExibicao(dados ?? []))
            .catch(() => setTiposExibicao([]));
    }, []);

    const tipoModal = useMemo(
        () => tiposExibicao.find(t => t.numeroTipo === ocorrenciaModal?.numeroTipo) ?? null,
        [tiposExibicao, ocorrenciaModal]
    );

    const iniciarCadastro = () => {
        dispatch({ type: FormActions.resetFormulario });
        dispatch({ type: FormActions.setShowModal, payload: false });
        setSomenteVisualizacao(false);
        setModalCadastroAberto(true);
    };

    const abrirModal = (oc: OcorrenciaSalva) => {
        dispatch({ type: FormActions.resetFormulario });
        // Ocorrência finalizada (ícone do olho) abre somente leitura; rascunho abre em edição.
        setSomenteVisualizacao(oc.status === 'finalizada');
        dispatch({ type: FormActions.setTipoOcorrencia, payload: oc.numeroTipo });
        dispatch({ type: FormActions.setComplementoOcorrencia, payload: oc.numeroComplemento });
        dispatch({ type: FormActions.setShowModal, payload: true });
        Object.entries(oc.valores).forEach(([nome, valor]) => {
            dispatch({ type: FormActions.setCampo, payload: { nome, valor } });
        });
        setOcorrenciaModal(oc);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setOcorrenciaModal(null);
        setOcorrencias(carregarOcorrencias());
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5">Ocorrências</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={iniciarCadastro}>
                    Nova Ocorrência
                </Button>
            </Stack>

            {ocorrencias.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">Nenhuma ocorrência registrada.</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Subtipo</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Data</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ocorrencias.map(oc => (
                                <TableRow key={oc.id}>
                                    <TableCell>{oc.tipoNome}</TableCell>
                                    <TableCell>{oc.subtipoNome}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={oc.status === 'finalizada' ? 'Finalizada' : 'Rascunho'}
                                            color={oc.status === 'finalizada' ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(oc.criadaEm).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell align="right">
                                        {oc.status === 'finalizada' ? (
                                            <IconButton size="small" onClick={() => abrirModal(oc)} title="Visualizar">
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        ) : (
                                            <IconButton size="small" onClick={() => abrirModal(oc)} title="Editar">
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ModalEditarOcorrencia
                aberto={modalAberto}
                onFechar={fecharModal}
                tipo={tipoModal}
                tipos={tiposExibicao}
                ocorrencia={ocorrenciaModal}
            />

            <ModalCadastroOcorrencia
                aberto={modalCadastroAberto}
                onFechar={() => setModalCadastroAberto(false)}
                onSalvo={() => setOcorrencias(carregarOcorrencias())}
                tipos={tipos}
            />
        </Box>
    );
}
