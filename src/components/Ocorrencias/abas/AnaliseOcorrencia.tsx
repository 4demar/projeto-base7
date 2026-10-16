import { Stack, TextField, Typography } from '@mui/material';
import { useFormBoletimCadastro, FormActions } from '../../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../../hook/useFormularioOcorrencia';

const ID_TAB = 7;

export default function AnaliseOcorrencia() {
    const { state, dispatch } = useFormBoletimCadastro();
    const { campoEhVisivel, campoEhSomenteLeitura, campoEhObrigatorio } = useFormularioOcorrencia();

    const setValor = (nome: string, valor: string) => {
        dispatch({ type: FormActions.setCampo, payload: { nome, valor } });
    };

    const visivel = (nome: string) => campoEhVisivel(ID_TAB, nome);
    const somenteLeitura = (nome: string) => campoEhSomenteLeitura(ID_TAB, nome);
    const obrigatorio = (nome: string) => campoEhObrigatorio(ID_TAB, nome);

    return (
        <Stack spacing={2.5}>
            <Typography variant="subtitle1" fontWeight={600}>Análise da ocorrência</Typography>

            {visivel('parecerAnalise') && (
                <TextField
                    label="Parecer da análise"
                    value={state.valores['parecerAnalise'] ?? ''}
                    onChange={(e) => setValor('parecerAnalise', e.target.value)}
                    disabled={somenteLeitura('parecerAnalise')}
                    required={obrigatorio('parecerAnalise')}
                    fullWidth multiline minRows={3} size="small"
                />
            )}

            {visivel('responsavelAnalise') && (
                <TextField
                    label="Responsável pela análise"
                    value={state.valores['responsavelAnalise'] ?? ''}
                    onChange={(e) => setValor('responsavelAnalise', e.target.value)}
                    disabled={somenteLeitura('responsavelAnalise')}
                    required={obrigatorio('responsavelAnalise')}
                    fullWidth size="small"
                />
            )}

            {visivel('statusAnalise') && (
                <TextField
                    label="Status da análise"
                    value={state.valores['statusAnalise'] ?? ''}
                    onChange={(e) => setValor('statusAnalise', e.target.value)}
                    disabled={somenteLeitura('statusAnalise')}
                    required={obrigatorio('statusAnalise')}
                    fullWidth size="small"
                />
            )}
        </Stack>
    );
}
