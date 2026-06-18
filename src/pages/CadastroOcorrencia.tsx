import { useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Stack, Chip, Breadcrumbs, Link as MuiLink,
    FormControl, InputLabel, Select, MenuItem, Tabs, Tab, TextField,
    CircularProgress, Button, Alert,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { useComplementoOcorrencia, useFormularioOcorrencia } from '../store/useStore';

export default function CadastroOcorrencia() {
    const { tipos, complementos, loading: loadingCatalogo } = useComplementoOcorrencia();

    const [idTipo, setIdTipo] = useState<number | ''>('');
    const [idSubtipo, setIdSubtipo] = useState<number | ''>('');
    const [tabAtiva, setTabAtiva] = useState(0);
    const [valores, setValores] = useState<Record<number, string>>({});

    const tipoNum = idTipo === '' ? null : idTipo;
    const subtipoNum = idSubtipo === '' ? null : idSubtipo;

    const { estrutura, loading: loadingForm } = useFormularioOcorrencia(tipoNum, subtipoNum);

    // Subtipos (complementos) ativos do tipo selecionado.
    const subtiposDoTipo = useMemo(
        () => complementos.filter(c => c.idTipoOcorrencia === idTipo && !c.inativo),
        [complementos, idTipo]
    );

    const tiposAtivos = useMemo(() => tipos.filter(t => !t.inativo), [tipos]);

    const handleTipo = (valor: number) => {
        setIdTipo(valor);
        setIdSubtipo('');
        setTabAtiva(0);
        setValores({});
    };

    const handleSubtipo = (valor: number) => {
        setIdSubtipo(valor);
        setTabAtiva(0);
        setValores({});
    };

    const setValor = (idCampo: number, valor: string) => {
        setValores(prev => ({ ...prev, [idCampo]: valor }));
    };

    const tabSelecionada = estrutura[tabAtiva];

    const camposObrigatoriosPendentes = useMemo(() => {
        return estrutura.flatMap(t => t.campos)
            .filter(c => c.obrigatorio && !(valores[c.campo.id] ?? '').trim())
            .map(c => c.campo.label);
    }, [estrutura, valores]);

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Breadcrumbs sx={{ mb: 1 }}>
                <MuiLink underline="hover" color="inherit" href="#">Ocorrências</MuiLink>
                <Typography color="text.primary">Nova Ocorrência</Typography>
            </Breadcrumbs>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Assignment color="primary" />
                <Box>
                    <Typography variant="h5">Cadastro de Ocorrência</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Selecione o tipo e o subtipo para exibir as abas e campos configurados.
                    </Typography>
                </Box>
            </Stack>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl fullWidth disabled={loadingCatalogo}>
                        <InputLabel id="tipo-label">Tipo</InputLabel>
                        <Select
                            labelId="tipo-label"
                            label="Tipo"
                            value={idTipo}
                            onChange={(e) => handleTipo(e.target.value as number)}
                        >
                            {tiposAtivos.length === 0 && <MenuItem disabled>Nenhum tipo disponível</MenuItem>}
                            {tiposAtivos.map(t => <MenuItem key={t.id} value={t.id}>{t.nome}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth disabled={idTipo === ''}>
                        <InputLabel id="subtipo-label">Subtipo</InputLabel>
                        <Select
                            labelId="subtipo-label"
                            label="Subtipo"
                            value={idSubtipo}
                            onChange={(e) => handleSubtipo(e.target.value as number)}
                        >
                            {subtiposDoTipo.length === 0 && <MenuItem disabled>Nenhum subtipo para este tipo</MenuItem>}
                            {subtiposDoTipo.map(c => <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
            </Paper>

            {subtipoNum == null ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        Selecione um tipo e um subtipo para começar o preenchimento.
                    </Typography>
                </Paper>
            ) : loadingForm ? (
                <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={28} /></Box>
            ) : estrutura.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        Nenhum campo configurado para este subtipo.
                    </Typography>
                </Paper>
            ) : (
                <Paper>
                    <Tabs
                        value={tabAtiva}
                        onChange={(_, v) => setTabAtiva(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { textTransform: 'none' } }}
                    >
                        {estrutura.map((t, i) => (
                            <Tab
                                key={t.tab.id}
                                label={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <span>{t.tab.nome}</span>
                                        <Chip label={t.campos.length} size="small" />
                                    </Stack>
                                }
                                value={i}
                            />
                        ))}
                    </Tabs>

                    {tabSelecionada && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>{tabSelecionada.tab.descricao}</Typography>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                {tabSelecionada.campos.map(({ campo, editavel, obrigatorio }) => (
                                    <TextField
                                        key={campo.id}
                                        label={campo.label}
                                        value={valores[campo.id] ?? ''}
                                        onChange={(e) => setValor(campo.id, e.target.value)}
                                        required={obrigatorio}
                                        disabled={!editavel}
                                        fullWidth
                                        helperText={!editavel ? 'Somente leitura' : undefined}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Paper>
            )}

            {subtipoNum != null && estrutura.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    {camposObrigatoriosPendentes.length > 0 && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Campos obrigatórios pendentes: {camposObrigatoriosPendentes.join(', ')}
                        </Alert>
                    )}
                    <Stack direction="row" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            disabled={camposObrigatoriosPendentes.length > 0}
                            onClick={() => alert('Ocorrência pronta para envio (persistência não implementada).')}
                        >
                            Salvar ocorrência
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
}
