import { Stack, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';
import { useFormBoletimCadastro, FormActions } from '../../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../../hook/useFormularioOcorrencia';
import { ComplementoOcorrencia, TipoOcorrencia } from '../../../types';

interface Props {
    tipos: TipoOcorrencia[];
    modoCadastro?: boolean;
}

/**
 * Aba 0 — Dados da ocorrência.
 * Campos fixos: Tipo, Subtipo, Filial, Data, Status, B.O da polícia, Auxílio central.
 * Tipo e Subtipo sempre visíveis (não controlados por regra).
 */
export default function DadosOcorrencia({ tipos, modoCadastro = false }: Props) {
    const { state, dispatch } = useFormBoletimCadastro();
    const { campoEhVisivel, campoEhSomenteLeitura, campoEhObrigatorio } = useFormularioOcorrencia();

    const idTipo = state.tipoOcorrencia;
    const idComplemento = state.complementoOcorrencia;
    const tipoObj = tipos.find(t => t.numeroTipo === idTipo) ?? null;
    const subtipos: ComplementoOcorrencia[] = (tipoObj?.complementoOcorrencia ?? []).filter(c => c.complementoInativo === 0);

    const setValor = (nome: string, valor: string) => {
        dispatch({ type: FormActions.setCampo, payload: { nome, valor } });
    };

    const handleTipo = (valor: number) => {
        dispatch({ type: FormActions.setTipoOcorrencia, payload: valor });
        dispatch({ type: FormActions.setComplementoOcorrencia, payload: 0 });
    };

    const handleSubtipo = (valor: number) => {
        dispatch({ type: FormActions.setComplementoOcorrencia, payload: valor });
    };

    const ID_TAB = 0;

    // Helpers para campos configuráveis desta aba
    const visivel = (nome: string) => campoEhVisivel(ID_TAB, nome);
    const somenteLeitura = (nome: string) => campoEhSomenteLeitura(ID_TAB, nome);
    const obrigatorio = (nome: string) => campoEhObrigatorio(ID_TAB, nome);

    return (
        <Stack spacing={2.5}>
            <Typography variant="subtitle1" fontWeight={600}>Dados da ocorrência</Typography>

            {/* Tipo e Subtipo — sempre visíveis, não controlados por regra */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth disabled={!modoCadastro}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                        label="Tipo"
                        value={idTipo === 0 ? '' : idTipo}
                        onChange={(e) => handleTipo(Number(e.target.value))}
                    >
                        {tipos.map(t => (
                            <MenuItem key={t.numeroTipo} value={t.numeroTipo}>{t.nomeTipo}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth disabled={idTipo === 0 || !modoCadastro}>
                    <InputLabel>Subtipo</InputLabel>
                    <Select
                        label="Subtipo"
                        value={idComplemento === 0 ? '' : idComplemento}
                        onChange={(e) => handleSubtipo(Number(e.target.value))}
                    >
                        {subtipos.map(c => (
                            <MenuItem key={c.numeroComplemento} value={c.numeroComplemento}>{c.nomeComplemento}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {/* Filial — campo fixo (não configurável por regra) */}
            <TextField
                label="Filial"
                value={state.valores['codigoFilial'] ?? ''}
                onChange={(e) => setValor('codigoFilial', e.target.value)}
                required
                fullWidth
                size="small"
            />

            {/* Data da ocorrência — campo fixo */}
            <TextField
                label="Data da ocorrência"
                type="date"
                value={state.valores['dataOcorrencia'] ?? ''}
                onChange={(e) => setValor('dataOcorrencia', e.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
            />

            {/* Campos configuráveis via regra */}
            {visivel('auxilioCentral') && (
                <TextField
                    label="Com auxílio da central de monitoramento"
                    value={state.valores['auxilioCentral'] ?? ''}
                    onChange={(e) => setValor('auxilioCentral', e.target.value)}
                    disabled={somenteLeitura('auxilioCentral')}
                    required={obrigatorio('auxilioCentral')}
                    fullWidth
                    size="small"
                />
            )}

            {visivel('statusOcorrencia') && (
                <TextField
                    label="Status da ocorrência"
                    value={state.valores['statusOcorrencia'] ?? ''}
                    onChange={(e) => setValor('statusOcorrencia', e.target.value)}
                    disabled={somenteLeitura('statusOcorrencia')}
                    required={obrigatorio('statusOcorrencia')}
                    fullWidth
                    size="small"
                />
            )}

            {visivel('numeroBoletimOcorrencia') && (
                <TextField
                    label="Número B.O da polícia"
                    value={state.valores['numeroBoletimOcorrencia'] ?? ''}
                    onChange={(e) => setValor('numeroBoletimOcorrencia', e.target.value)}
                    disabled={somenteLeitura('numeroBoletimOcorrencia')}
                    required={obrigatorio('numeroBoletimOcorrencia')}
                    fullWidth
                    size="small"
                />
            )}
        </Stack>
    );
}
