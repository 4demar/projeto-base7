import { useMemo, useState } from 'react';
import {
    Box, Typography, Button, Paper, Stack, Chip, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControlLabel, Switch, Checkbox, Grid, Divider, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Search, Close, DragIndicator } from '@mui/icons-material';
import { useTipoOcorrencia } from '../../store/useStore';
import type { TipoOcorrencia, TabFormulario } from '../../types';

export default function TiposTab() {
    const { tipos, tabs, loading, createTipo, updateTipo, removeTipo } = useTipoOcorrencia();
    const [busca, setBusca] = useState('');
    const [dialogAberto, setDialogAberto] = useState(false);
    const [editando, setEditando] = useState<TipoOcorrencia | null>(null);

    const tiposFiltrados = useMemo(() => {
        const q = busca.trim().toLowerCase();
        if (!q) return tipos;
        return tipos.filter(t =>
            t.nome.toLowerCase().includes(q) || t.descricao.toLowerCase().includes(q));
    }, [tipos, busca]);

    const abrirNovo = () => { setEditando(null); setDialogAberto(true); };
    const abrirEdicao = (t: TipoOcorrencia) => { setEditando(t); setDialogAberto(true); };

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }} justifyContent="space-between">
                <TextField
                    size="small"
                    placeholder="Buscar tipo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    sx={{ minWidth: 260 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                />
                <Button variant="contained" startIcon={<Add />} onClick={abrirNovo}>Novo Tipo</Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell align="center">Tabs</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={28} sx={{ my: 2 }} /></TableCell></TableRow>
                        ) : tiposFiltrados.length === 0 ? (
                            <TableRow><TableCell colSpan={6} align="center"><Typography color="text.secondary" sx={{ py: 2 }}>Nenhum tipo encontrado.</Typography></TableCell></TableRow>
                        ) : (
                            tiposFiltrados.map((t) => (
                                <TableRow key={t.id} hover>
                                    <TableCell>{t.id}</TableCell>
                                    <TableCell>{t.nome}</TableCell>
                                    <TableCell>{t.descricao || '—'}</TableCell>
                                    <TableCell align="center"><Chip label={t.listaIdTabs.length} size="small" /></TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={t.inativo ? 'Inativo' : 'Ativo'}
                                            size="small"
                                            color={t.inativo ? 'default' : 'success'}
                                            variant={t.inativo ? 'outlined' : 'filled'}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Editar"><IconButton size="small" onClick={() => abrirEdicao(t)}><Edit fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Excluir"><IconButton size="small" onClick={() => removeTipo(t.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {dialogAberto && (
                <TipoDialog
                    tabs={tabs}
                    editando={editando}
                    onFechar={() => setDialogAberto(false)}
                    onSalvar={async (dados) => {
                        if (editando) await updateTipo({ ...editando, ...dados });
                        else await createTipo(dados);
                        setDialogAberto(false);
                    }}
                />
            )}
        </Box>
    );
}

interface TipoDialogProps {
    tabs: TabFormulario[];
    editando: TipoOcorrencia | null;
    onFechar: () => void;
    onSalvar: (dados: Omit<TipoOcorrencia, 'id'>) => void | Promise<void>;
}

function TipoDialog({ tabs, editando, onFechar, onSalvar }: TipoDialogProps) {
    const [nome, setNome] = useState(editando?.nome ?? '');
    const [descricao, setDescricao] = useState(editando?.descricao ?? '');
    const [inativo, setInativo] = useState(editando?.inativo ?? false);
    // idsTabs guarda APENAS as selecionadas, na ordem definida pelo usuário (drag and drop).
    const [idsTabs, setIdsTabs] = useState<number[]>(editando?.listaIdTabs ?? []);
    const [arrastando, setArrastando] = useState<number | null>(null);

    const toggleTab = (id: number) => {
        setIdsTabs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    // Lista exibida: primeiro as selecionadas (na ordem salva), depois as não selecionadas (ordem do catálogo).
    const tabsSelecionadas = idsTabs
        .map(id => tabs.find(t => t.id === id))
        .filter((t): t is TabFormulario => !!t);
    const tabsDisponiveis = tabs.filter(t => !idsTabs.includes(t.id));

    const reordenar = (idOrigem: number, idDestino: number) => {
        if (idOrigem === idDestino) return;
        setIdsTabs(prev => {
            const lista = [...prev];
            const de = lista.indexOf(idOrigem);
            const para = lista.indexOf(idDestino);
            if (de === -1 || para === -1) return prev;
            lista.splice(de, 1);
            lista.splice(para, 0, idOrigem);
            return lista;
        });
    };

    return (
        <Dialog open onClose={onFechar} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {editando ? 'Editar Tipo' : 'Novo Tipo'}
                    <IconButton onClick={onFechar}><Close /></IconButton>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Defina os dados do tipo e quais abas aparecem no cadastro de ocorrência.
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="subtitle2" gutterBottom>Dados do Tipo</Typography>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth autoFocus />
                            <TextField label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} fullWidth multiline minRows={2} />
                            <FormControlLabel control={<Switch checked={!inativo} onChange={(e) => setInativo(!e.target.checked)} />} label="Status tipo" />
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2">Abas exibidas</Typography>
                            <Chip label={`${idsTabs.length} selecionada(s)`} size="small" color="primary" />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            Marque as abas e arraste pelo ⠿ para ordenar.
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Stack spacing={1}>
                            {tabsSelecionadas.map((tab) => (
                                <TabCard
                                    key={tab.id}
                                    tab={tab}
                                    selecionada
                                    arrastavel
                                    arrastando={arrastando === tab.id}
                                    onToggle={() => toggleTab(tab.id)}
                                    onDragStart={() => setArrastando(tab.id)}
                                    onDragEnd={() => setArrastando(null)}
                                    onDropSobre={() => { if (arrastando !== null) reordenar(arrastando, tab.id); }}
                                />
                            ))}
                            {tabsDisponiveis.map((tab) => (
                                <TabCard
                                    key={tab.id}
                                    tab={tab}
                                    selecionada={false}
                                    arrastavel={false}
                                    arrastando={false}
                                    onToggle={() => toggleTab(tab.id)}
                                />
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onFechar}>Cancelar</Button>
                <Button variant="contained" disabled={!nome.trim()} onClick={() => onSalvar({ nome: nome.trim(), descricao: descricao.trim(), inativo, listaIdTabs: idsTabs })}>
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

interface TabCardProps {
    tab: TabFormulario;
    selecionada: boolean;
    arrastavel: boolean;
    arrastando: boolean;
    onToggle: () => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onDropSobre?: () => void;
}

function TabCard({ tab, selecionada, arrastavel, arrastando, onToggle, onDragStart, onDragEnd, onDropSobre }: TabCardProps) {
    return (
        <Paper
            variant="outlined"
            draggable={arrastavel}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={(e) => { if (arrastavel) e.preventDefault(); }}
            onDrop={(e) => { e.preventDefault(); onDropSobre?.(); }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1,
                py: 0.5,
                opacity: arrastando ? 0.4 : 1,
                borderColor: selecionada ? 'primary.main' : 'divider',
                bgcolor: selecionada ? 'action.selected' : 'transparent',
            }}
        >
            {arrastavel && (
                <DragIndicator
                    fontSize="small"
                    sx={{ color: 'text.disabled', cursor: 'grab' }}
                />
            )}
            <Checkbox checked={selecionada} onChange={onToggle} sx={{ p: 0.5 }} />
            <Box sx={{ flex: 1 }}>
                <Typography variant="body2">{tab.descricao}</Typography>
            </Box>
        </Paper>
    );
}
