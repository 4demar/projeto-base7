import { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Stack, Button, Breadcrumbs, Link as MuiLink,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ConfiguracaoOcorrenciaService } from '../../services/configuracaoOcorrencia';
import { useFormBoletimCadastro, FormActions } from '../../contexts/FormCadastroContext';
import { TipoOcorrencia } from '../../types';
import { OcorrenciaSalva, carregarOcorrencias, salvarOcorrencias } from './storage';
import TabsOcorrencia from './tabs';

/**
 * Tela de cadastro de nova ocorrência (rota própria: /cadastro-ocorrencia).
 * Tipo e Subtipo ficam na primeira aba. Navegação por tabs com Voltar/Próximo.
 */
export default function CadastroOcorrenciaForm() {
    const navigate = useNavigate();
    const { state, dispatch } = useFormBoletimCadastro();
    const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);

    useEffect(() => {
        ConfiguracaoOcorrenciaService.buscarTiposParaFluxo()
            .then(dados => setTipos(dados ?? []))
            .catch(() => setTipos([]));
    }, []);

    const tipoSelecionado = useMemo(
        () => tipos.find(t => t.numeroTipo === state.tipoOcorrencia) ?? null,
        [tipos, state.tipoOcorrencia]
    );

    const cancelar = () => {
        dispatch({ type: FormActions.resetFormulario });
        navigate('/ocorrencias');
    };

    const salvar = () => {
        const tipoObj = tipos.find(t => t.numeroTipo === state.tipoOcorrencia);
        const subtipoObj = tipoObj?.complementoOcorrencia?.find(
            c => c.numeroComplemento === state.complementoOcorrencia
        );
        const nova: OcorrenciaSalva = {
            id: crypto.randomUUID(),
            tipoNome: tipoObj?.nomeTipo ?? '',
            subtipoNome: subtipoObj?.nomeComplemento ?? '',
            numeroTipo: state.tipoOcorrencia,
            numeroComplemento: state.complementoOcorrencia,
            status: 'finalizada',
            valores: { ...state.valores },
            criadaEm: new Date().toISOString(),
        };
        const lista = [nova, ...carregarOcorrencias()];
        salvarOcorrencias(lista);
        dispatch({ type: FormActions.resetFormulario });
        navigate('/ocorrencias');
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Breadcrumbs sx={{ mb: 1 }}>
                <MuiLink underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/ocorrencias')}>
                    Ocorrências
                </MuiLink>
                <Typography color="text.primary">Nova Ocorrência</Typography>
            </Breadcrumbs>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Assignment color="primary" />
                    <Typography variant="h5">Cadastro de Ocorrência</Typography>
                </Stack>
                <Button variant="text" onClick={cancelar}>Cancelar</Button>
            </Stack>

            <Paper>
                <TabsOcorrencia
                    tipo={tipoSelecionado}
                    tipos={tipos}
                    modoCadastro
                    onSalvar={salvar}
                />
            </Paper>
        </Box>
    );
}
