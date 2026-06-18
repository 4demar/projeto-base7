import { useMemo, useState } from 'react';
import {
    Box, Typography, Button, Paper, Stack, Chip, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, CircularProgress, FormControl, InputLabel, Select, MenuItem, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { useComplementoOcorrencia } from '../../store/useStore';
import type { ComplementoOcorrencia } from '../../types';
import SubtipoDialog from './SubtipoDialog';

export default function SubtiposTab() {
    const { tipos, complementos, contagemCampos, loading, createComplemento, updateComplemento, removeComplemento } =
        useComplementoOcorrencia();

    const [busca, setBusca] = useState('');
    const [filtroTipo, setFiltroTipo] = useState<number | ''>('');
    const [dialogAberto, setDialogAberto] = useState(false);
    const [editando, setEditando] = useState<ComplementoOcorrencia | null>(null);

    const nomeTipo = (id: number) => tipos.find(t => t.id === id)?.nome ?? `Tipo ${id}`;

    const filtrados = useMemo(() => {
        const q = busca.trim().toLowerCase();
        return complementos.filter(c => {
            const okBusca = !q || c.nome.toLowerCase().includes(q) || c.descricao.toLowerCase().includes(q);
            const okTipo = filtroTipo === '' || c.idTipoOcorrencia === filtroTipo;
            return okBusca && okTipo;
        });
    }, [complementos, busca, filtroTipo]);

    const abrirNovo = () => { setEditando(null); setDialogAberto(true); };
    const abrirEdicao = (c: ComplementoOcorrencia) => { setEditando(c); setDialogAberto(true); };

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }} justifyContent="space-between">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <TextField
                        size="small"
                        placeholder="Buscar subtipo..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        sx={{ minWidth: 240 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                    />
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel id="filtro-tipo-label">Filtrar por Tipo</InputLabel>
                        <Select
                            labelId="filtro-tipo-label"
                            label="Filtrar por Tipo"
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value as number | '')}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {tipos.map(t => <MenuItem key={t.id} value={t.id}>{t.nome}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
                <Button variant="contained" startIcon={<Add />} onClick={abrirNovo} disabled={tipos.length === 0}>
                    Novo Subtipo
                </Button>
            </Stack>

            {tipos.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Cadastre um Tipo antes de criar Subtipos.
                </Typography>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell align="center">Campos</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={7} align="center"><CircularProgress size={28} sx={{ my: 2 }} /></TableCell></TableRow>
                        ) : filtrados.length === 0 ? (
                            <TableRow><TableCell colSpan={7} align="center"><Typography color="text.secondary" sx={{ py: 2 }}>Nenhum subtipo encontrado.</Typography></TableCell></TableRow>
                        ) : (
                            filtrados.map((c) => (
                                <TableRow key={c.id} hover>
                                    <TableCell>{c.id}</TableCell>
                                    <TableCell>{nomeTipo(c.idTipoOcorrencia)}</TableCell>
                                    <TableCell>{c.nome}</TableCell>
                                    <TableCell>{c.descricao || '—'}</TableCell>
                                    <TableCell align="center"><Chip label={contagemCampos[c.id] ?? 0} size="small" /></TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={c.inativo ? 'Inativo' : 'Ativo'}
                                            size="small"
                                            color={c.inativo ? 'default' : 'success'}
                                            variant={c.inativo ? 'outlined' : 'filled'}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Editar / Configurar campos"><IconButton size="small" onClick={() => abrirEdicao(c)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Excluir"><IconButton size="small" onClick={() => removeComplemento(c.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {dialogAberto && (
                <SubtipoDialog
                    tipos={tipos}
                    editando={editando}
                    onFechar={() => setDialogAberto(false)}
                    onCriar={createComplemento}
                    onAtualizar={updateComplemento}
                />
            )}
        </Box>
    );
}
