import { useMemo, useState } from 'react';
import {
    Box, Typography, Button, Stack, Chip, TextField, IconButton, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel,
    Select, MenuItem, FormControlLabel, Switch, Stepper, Step, StepLabel,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { ComplementoOcorrencia, TipoOcorrencia } from '../../types';
import ConfiguracaoCampos from './ConfiguracaoCampos';

interface SubtipoDialogProps {
    tipos: TipoOcorrencia[];
    editando: ComplementoOcorrencia | null;
    onFechar: () => void;
    onCriar: (data: Omit<ComplementoOcorrencia, 'id'>) => Promise<number>;
    onAtualizar: (data: ComplementoOcorrencia) => Promise<void>;
}

export default function SubtipoDialog({ tipos, editando, onFechar, onCriar, onAtualizar }: SubtipoDialogProps) {
    const [idTipo, setIdTipo] = useState<number | ''>(editando?.idTipoOcorrencia ?? '');
    const [nome, setNome] = useState(editando?.nome ?? '');
    const [descricao, setDescricao] = useState(editando?.descricao ?? '');
    const [inativo, setInativo] = useState(editando?.inativo ?? false);
    // id do complemento já persistido (edição ou após salvar dados na criação)
    const [idComplemento, setIdComplemento] = useState<number | null>(editando?.id ?? null);
    const [passo, setPasso] = useState(0);

    const tipoSelecionado = useMemo(
        () => tipos.find(t => t.id === idTipo) ?? null,
        [tipos, idTipo]
    );

    const handleSalvarDados = async () => {
        if (idTipo === '' || !nome.trim()) return;
        const dados = { idTipoOcorrencia: idTipo, nome: nome.trim(), descricao: descricao.trim(), inativo };
        if (idComplemento !== null) {
            await onAtualizar({ id: idComplemento, ...dados });
        } else {
            const novoId = await onCriar(dados);
            setIdComplemento(novoId);
        }
        setPasso(1);
    };

    return (
        <Dialog open onClose={onFechar} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {editando ? 'Editar Subtipo' : 'Novo Subtipo'}
                    <IconButton onClick={onFechar}><Close /></IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <Stepper activeStep={passo} sx={{ mb: 3 }}>
                    <Step><StepLabel>Dados do Subtipo</StepLabel></Step>
                    <Step><StepLabel>Campos exibidos</StepLabel></Step>
                </Stepper>

                {passo === 0 ? (
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel id="tipo-pai-label">Tipo</InputLabel>
                            <Select
                                labelId="tipo-pai-label"
                                label="Tipo"
                                value={idTipo}
                                onChange={(e) => setIdTipo(e.target.value as number)}
                            >
                                {tipos.map(t => <MenuItem key={t.id} value={t.id}>{t.nome}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
                        <TextField label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} fullWidth multiline minRows={2} />
                        <FormControlLabel control={<Switch checked={!inativo} onChange={(e) => setInativo(!e.target.checked)} />} label="Status complemento" />
                    </Stack>
                ) : (
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">Tipo:</Typography>
                            <Chip label={tipoSelecionado?.nome ?? '—'} size="small" color="primary" />
                            <Typography variant="subtitle2" sx={{ ml: 1 }}>Subtipo:</Typography>
                            <Chip label={nome} size="small" />
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        {idComplemento !== null && tipoSelecionado ? (
                            <ConfiguracaoCampos idComplemento={idComplemento} idsTabs={tipoSelecionado.listaIdTabs} />
                        ) : (
                            <Typography color="text.secondary">Salve os dados do subtipo para configurar os campos.</Typography>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                {passo === 1 && (
                    <Button onClick={() => setPasso(0)} sx={{ mr: 'auto' }}>Voltar</Button>
                )}
                <Button onClick={onFechar}>Fechar</Button>
                {passo === 0 ? (
                    <Button variant="contained" disabled={idTipo === '' || !nome.trim()} onClick={handleSalvarDados}>
                        {idComplemento !== null ? 'Salvar e configurar campos' : 'Avançar e configurar campos'}
                    </Button>
                ) : (
                    <Button variant="contained" onClick={onFechar}>Concluir</Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
