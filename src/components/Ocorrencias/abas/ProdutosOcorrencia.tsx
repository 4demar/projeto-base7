import { Stack, TextField, Typography } from '@mui/material';
import { useFormBoletimCadastro, FormActions } from '../../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../../hook/useFormularioOcorrencia';

const ID_TAB = 2;

export default function ProdutosOcorrencia() {
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
            <Typography variant="subtitle1" fontWeight={600}>Produtos da ocorrência</Typography>

            {visivel('produto') && (
                <TextField
                    label="Produto"
                    value={state.valores['produto'] ?? ''}
                    onChange={(e) => setValor('produto', e.target.value)}
                    disabled={somenteLeitura('produto')}
                    required={obrigatorio('produto')}
                    fullWidth size="small"
                />
            )}

            {visivel('valor') && (
                <TextField
                    label="Valor"
                    value={state.valores['valor'] ?? ''}
                    onChange={(e) => setValor('valor', e.target.value)}
                    disabled={somenteLeitura('valor')}
                    required={obrigatorio('valor')}
                    fullWidth size="small"
                />
            )}
        </Stack>
    );
}
