import { Stack, TextField, Typography } from '@mui/material';
import { useFormBoletimCadastro, FormActions } from '../../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../../hook/useFormularioOcorrencia';

const ID_TAB = 5;

export default function AnexarArquivos() {
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
            <Typography variant="subtitle1" fontWeight={600}>Anexar arquivos</Typography>

            {visivel('anexo') && (
                <TextField
                    label="Anexar Arquivo"
                    value={state.valores['anexo'] ?? ''}
                    onChange={(e) => setValor('anexo', e.target.value)}
                    disabled={somenteLeitura('anexo')}
                    required={obrigatorio('anexo')}
                    fullWidth size="small"
                    helperText="Simulação — no app real seria um upload"
                />
            )}
        </Stack>
    );
}
