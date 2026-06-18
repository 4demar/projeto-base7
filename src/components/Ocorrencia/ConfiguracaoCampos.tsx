import { useMemo, useState } from 'react';
import {
    Box, Typography, Stack, Chip, CircularProgress, Checkbox, FormControlLabel,
    Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment, Divider,
} from '@mui/material';
import { ExpandMore, Search } from '@mui/icons-material';
import { useRegrasComplemento, useTabsFormulario } from '../../store/useStore';
import type { CampoTabFormulario } from '../../types';

interface ConfiguracaoCamposProps {
    idComplemento: number;
    idsTabs: number[];
}

export default function ConfiguracaoCampos({ idComplemento, idsTabs }: ConfiguracaoCamposProps) {
    const { campos, regras, loading, setExibido, setFlag } = useRegrasComplemento(idComplemento, idsTabs);
    const tabs = useTabsFormulario();
    const [busca, setBusca] = useState('');

    const regraDe = (idCampo: number) => regras.find(r => r.idCampoFormulario === idCampo);

    // Agrupa os campos por tab, respeitando a ordem das tabs do tipo.
    const gruposPorTab = useMemo(() => {
        const q = busca.trim().toLowerCase();
        return idsTabs.map(idTab => {
            const tab = tabs.find(t => t.id === idTab);
            const camposTab = campos
                .filter(c => c.idTab === idTab)
                .filter(c => !q || c.label.toLowerCase().includes(q) || c.nome.toLowerCase().includes(q));
            return { idTab, nomeTab: tab?.nome ?? `Tab ${idTab}`, descricao: tab?.descricao ?? '', campos: camposTab };
        });
    }, [idsTabs, tabs, campos, busca]);

    const totalSelecionados = regras.length;

    if (loading) {
        return <Box sx={{ p: 2, textAlign: 'center' }}><CircularProgress size={28} /></Box>;
    }

    if (idsTabs.length === 0) {
        return <Typography color="text.secondary">Este Tipo não possui Tabs configuradas.</Typography>;
    }

    return (
        <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <TextField
                    size="small"
                    placeholder="Buscar campo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    sx={{ flex: 1 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                />
                <Chip label={`${totalSelecionados} campo(s) selecionado(s)`} color="primary" size="small" />
            </Stack>

            {gruposPorTab.map(grupo => {
                const selecionadosNaTab = grupo.campos.filter(c => regraDe(c.id)).length;
                return (
                    <Accordion key={grupo.idTab} defaultExpanded disableGutters>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                                <Typography sx={{ fontWeight: 600 }}>{grupo.descricao}</Typography>
                                <Typography variant="caption" color="text.secondary">{grupo.descricao}</Typography>
                                <Box sx={{ flex: 1 }} />
                                <Chip label={`${selecionadosNaTab}/${grupo.campos.length}`} size="small" />
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            {grupo.campos.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">Nenhum campo nesta tab.</Typography>
                            ) : (
                                grupo.campos.map((campo, idx) => (
                                    <CampoLinha
                                        key={campo.id}
                                        campo={campo}
                                        primeiro={idx === 0}
                                        exibido={!!regraDe(campo.id)}
                                        editavel={!!regraDe(campo.id)?.editavel}
                                        obrigatorio={!!regraDe(campo.id)?.obrigatorio}
                                        onExibir={(v) => setExibido(campo.id, v)}
                                        onEditavel={(v) => setFlag(campo.id, 'editavel', v)}
                                        onObrigatorio={(v) => setFlag(campo.id, 'obrigatorio', v)}
                                    />
                                ))
                            )}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
}

interface CampoLinhaProps {
    campo: CampoTabFormulario;
    primeiro: boolean;
    exibido: boolean;
    editavel: boolean;
    obrigatorio: boolean;
    onExibir: (v: boolean) => void;
    onEditavel: (v: boolean) => void;
    onObrigatorio: (v: boolean) => void;
}

function CampoLinha({ campo, primeiro, exibido, editavel, obrigatorio, onExibir, onEditavel, onObrigatorio }: CampoLinhaProps) {
    return (
        <Box>
            {!primeiro && <Divider />}
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} sx={{ py: 0.2, gap: 1 }}>
                <FormControlLabel
                    sx={{ flex: 1, mr: 0 }}
                    control={<Checkbox checked={exibido} onChange={(e) => onExibir(e.target.checked)} />}
                    label={<Box><Typography variant="body2">{campo.label}</Typography></Box>}
                />
                <FormControlLabel
                    control={<Checkbox size="small" checked={editavel} disabled={!exibido} onChange={(e) => onEditavel(e.target.checked)} />}
                    label="Editável"
                />
                <FormControlLabel
                    control={<Checkbox size="small" checked={obrigatorio} disabled={!exibido} onChange={(e) => onObrigatorio(e.target.checked)} />}
                    label="Obrigatório"
                />
            </Stack>
        </Box>
    );
}
