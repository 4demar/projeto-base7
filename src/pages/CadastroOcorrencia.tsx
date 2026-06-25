import { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Stack, Chip, Breadcrumbs, Link as MuiLink,
    FormControl, InputLabel, Select, MenuItem, Tabs, Tab, TextField,
    CircularProgress, Button, Alert,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { ConfiguracaoOcorrenciaService } from '../services/configuracaoOcorrencia';
import { useRegrasFormulario } from '../contexts/RegrasFormularioContext';
import { FormActions, useFormBoletimCadastro } from '../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../hook/useFormularioOcorrencia';
import { listaNavegacaoBase } from '../components/ConfiguracaoOcorrencias/types';
import { CampoTabFormulario, ComplementoOcorrencia, TipoOcorrencia } from '../types';

// Resolve o nome da aba a partir do catálogo hardcoded (listaNavegacaoBase).
const nomeTab = (idTab: number) => listaNavegacaoBase.find(t => t.id === idTab)?.descricao ?? `Aba ${idTab}`;

export default function CadastroOcorrencia() {
    const { dispatch, state } = useFormBoletimCadastro();
    const { carregarRegras, limparRegras, carregarCamposTab, obterCamposTab } = useRegrasFormulario();
    const { campoEhVisivel, campoEhSomenteLeitura, campoEhObrigatorio } = useFormularioOcorrencia();

    const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);
    const [carregandoTipos, setCarregandoTipos] = useState(true);
    const [carregandoRegras, setCarregandoRegras] = useState(false);
    const [tabAtiva, setTabAtiva] = useState(0);

    const idTipo = state.tipoOcorrencia;
    const idComplemento = state.complementoOcorrencia;

    useEffect(() => {
        let ativo = true;
        ConfiguracaoOcorrenciaService.buscarTiposParaFluxo()
            .then(dados => { if (ativo) setTipos(dados ?? []); })
            .catch(() => { if (ativo) setTipos([]); })
            .finally(() => { if (ativo) setCarregandoTipos(false); });
        return () => { ativo = false; };
    }, []);

    const tipoSelecionado = useMemo(
        () => tipos.find(t => t.numeroTipo === idTipo) ?? null,
        [tipos, idTipo]
    );

    const subtiposDoTipo = useMemo<ComplementoOcorrencia[]>(
        () => (tipoSelecionado?.complementoOcorrencia ?? []).filter(c => c.complementoInativo === 0),
        [tipoSelecionado]
    );

    // Abas habilitadas no fluxo de Cadastro, na ordem configurada no Tipo.
    const tabsDoTipo = useMemo(() => {
        return [...(tipoSelecionado?.tabsConfiguracao ?? [])]
            .filter(tab => tab.cadastrar)
            .sort((a, b) => a.ordem - b.ordem)
            .map(tab => tab.idTab);
    }, [tipoSelecionado]);

    // Ao escolher um subtipo, carrega regras e o catálogo de campos das abas do tipo.
    useEffect(() => {
        if (idComplemento === 0 || tabsDoTipo.length === 0) {
            limparRegras();
            return;
        }
        let ativo = true;
        setCarregandoRegras(true);
        (async () => {
            await carregarRegras(idTipo, idComplemento);
            await Promise.all(tabsDoTipo.map(idTab => carregarCamposTab(idTab)));
        })().finally(() => { if (ativo) setCarregandoRegras(false); });
        return () => { ativo = false; };
    }, [idTipo, idComplemento, tabsDoTipo, carregarRegras, carregarCamposTab, limparRegras]);

    const handleTipo = (valor: number) => {
        dispatch({ type: FormActions.setTipoOcorrencia, payload: valor });
        dispatch({ type: FormActions.setComplementoOcorrencia, payload: 0 });
        setTabAtiva(0);
    };

    const handleSubtipo = (valor: number) => {
        dispatch({ type: FormActions.setComplementoOcorrencia, payload: valor });
        setTabAtiva(0);
    };

    const setValor = (nome: string, valor: string) => {
        dispatch({ type: FormActions.setCampo, payload: { nome, valor } });
    };

    // Campos visíveis de uma aba, conforme as regras do subtipo selecionado.
    const camposVisiveis = (idTab: number): CampoTabFormulario[] =>
        obterCamposTab(idTab).filter(campo => campoEhVisivel(idTab, campo.nome));

    const abasComCampos = useMemo(
        () => tabsDoTipo.filter(idTab => camposVisiveis(idTab).length > 0),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [tabsDoTipo, idComplemento, carregandoRegras]
    );

    const idTabAtiva = abasComCampos[tabAtiva];

    const camposObrigatoriosPendentes = useMemo(() => {
        return abasComCampos.flatMap(idTab =>
            camposVisiveis(idTab)
                .filter(campo => campoEhObrigatorio(idTab, campo.nome) && !(state.valores[campo.nome] ?? '').trim())
                .map(campo => campo.label)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [abasComCampos, state.valores, carregandoRegras]);

    const subtipoSelecionado = idComplemento !== 0;

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
                    <FormControl fullWidth disabled={carregandoTipos}>
                        <InputLabel id="tipo-label">Tipo</InputLabel>
                        <Select
                            labelId="tipo-label"
                            label="Tipo"
                            value={idTipo === 0 ? '' : idTipo}
                            onChange={(e) => handleTipo(Number(e.target.value))}
                        >
                            {tipos.length === 0 && <MenuItem disabled>Nenhum tipo disponível</MenuItem>}
                            {tipos.map(t => <MenuItem key={t.numeroTipo} value={t.numeroTipo}>{t.nomeTipo}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth disabled={idTipo === 0}>
                        <InputLabel id="subtipo-label">Subtipo</InputLabel>
                        <Select
                            labelId="subtipo-label"
                            label="Subtipo"
                            value={idComplemento === 0 ? '' : idComplemento}
                            onChange={(e) => handleSubtipo(Number(e.target.value))}
                        >
                            {subtiposDoTipo.length === 0 && <MenuItem disabled>Nenhum subtipo para este tipo</MenuItem>}
                            {subtiposDoTipo.map(c => (
                                <MenuItem key={c.numeroComplemento} value={c.numeroComplemento}>{c.nomeComplemento}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Paper>

            {!subtipoSelecionado ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        Selecione um tipo e um subtipo para começar o preenchimento.
                    </Typography>
                </Paper>
            ) : carregandoRegras ? (
                <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={28} /></Box>
            ) : abasComCampos.length === 0 ? (
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
                        {abasComCampos.map((idTab, i) => (
                            <Tab
                                key={idTab}
                                label={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <span>{nomeTab(idTab)}</span>
                                        <Chip label={camposVisiveis(idTab).length} size="small" />
                                    </Stack>
                                }
                                value={i}
                            />
                        ))}
                    </Tabs>

                    {idTabAtiva !== undefined && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>{nomeTab(idTabAtiva)}</Typography>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                {camposVisiveis(idTabAtiva).map(campo => {
                                    const somenteLeitura = campoEhSomenteLeitura(idTabAtiva, campo.nome);
                                    return (
                                        <TextField
                                            key={campo.id}
                                            label={campo.label}
                                            value={state.valores[campo.nome] ?? ''}
                                            onChange={(e) => setValor(campo.nome, e.target.value)}
                                            required={campoEhObrigatorio(idTabAtiva, campo.nome)}
                                            disabled={somenteLeitura}
                                            fullWidth
                                            helperText={somenteLeitura ? 'Somente leitura' : undefined}
                                        />
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}
                </Paper>
            )}

            {subtipoSelecionado && abasComCampos.length > 0 && (
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
