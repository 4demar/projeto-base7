import { Stack, TextField, Typography } from '@mui/material';
import { useFormBoletimCadastro, FormActions } from '../../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../../hook/useFormularioOcorrencia';

const ID_TAB = 9;

export default function OcorrenciasRelacionadas() {
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
            <Typography variant="subtitle1" fontWeight={600}>Ocorrências relacionadas</Typography>

            {visivel('ocorrenciasRelacionada') && (
                <TextField
                    label="Ocorrências relacionada"
                    value={state.valores['ocorrenciasRelacionada'] ?? ''}
                    onChange={(e) => setValor('ocorrenciasRelacionada', e.target.value)}
                    disabled={somenteLeitura('ocorrenciasRelacionada')}
                    required={obrigatorio('ocorrenciasRelacionada')}
                    fullWidth size="small"
                />
            )}
        </Stack>
    );
}
