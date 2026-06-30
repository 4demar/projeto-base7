import { Stack, TextField, Typography } from '@mui/material';
import { useFormBoletimCadastro, FormActions } from '../../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../../hook/useFormularioOcorrencia';

const ID_TAB = 4;

export default function Envolvidos() {
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
            <Typography variant="subtitle1" fontWeight={600}>Envolvidos</Typography>

            {visivel('envolvido') && (
                <TextField
                    label="Envolvido"
                    value={state.valores['envolvido'] ?? ''}
                    onChange={(e) => setValor('envolvido', e.target.value)}
                    disabled={somenteLeitura('envolvido')}
                    required={obrigatorio('envolvido')}
                    fullWidth size="small"
                />
            )}
        </Stack>
    );
}
