import { Stack, TextField, Typography } from '@mui/material';
import { useFormBoletimCadastro, FormActions } from '../../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../../hook/useFormularioOcorrencia';

const ID_TAB = 8;

export default function Anotacoes() {
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
            <Typography variant="subtitle1" fontWeight={600}>Anotações</Typography>

            {visivel('textoAnotacao') && (
                <TextField
                    label="Insira as anotações"
                    value={state.valores['textoAnotacao'] ?? ''}
                    onChange={(e) => setValor('textoAnotacao', e.target.value)}
                    disabled={somenteLeitura('textoAnotacao')}
                    required={obrigatorio('textoAnotacao')}
                    fullWidth multiline minRows={4} size="small"
                />
            )}
        </Stack>
    );
}
