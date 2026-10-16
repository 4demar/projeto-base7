import { Stack, TextField, Typography } from '@mui/material';
import { useFormBoletimCadastro, FormActions } from '../../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../../hook/useFormularioOcorrencia';

const ID_TAB = 6;

export default function DevolucaoCliente() {
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
            <Typography variant="subtitle1" fontWeight={600}>Devolução ao cliente</Typography>

            {visivel('nomeClienteDevolucao') && (
                <TextField
                    label="Nome completo"
                    value={state.valores['nomeClienteDevolucao'] ?? ''}
                    onChange={(e) => setValor('nomeClienteDevolucao', e.target.value)}
                    disabled={somenteLeitura('nomeClienteDevolucao')}
                    required={obrigatorio('nomeClienteDevolucao')}
                    fullWidth size="small"
                />
            )}

            {visivel('cpfClienteDevolucao') && (
                <TextField
                    label="CPF"
                    value={state.valores['cpfClienteDevolucao'] ?? ''}
                    onChange={(e) => setValor('cpfClienteDevolucao', e.target.value)}
                    disabled={somenteLeitura('cpfClienteDevolucao')}
                    required={obrigatorio('cpfClienteDevolucao')}
                    fullWidth size="small"
                />
            )}
        </Stack>
    );
}
