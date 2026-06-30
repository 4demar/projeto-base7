import { Stack, TextField, Typography } from '@mui/material';
import { useFormBoletimCadastro, FormActions } from '../../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../../hook/useFormularioOcorrencia';

const ID_TAB = 3;

export default function VeiculosOcorrencia() {
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
            <Typography variant="subtitle1" fontWeight={600}>Informações do veículo</Typography>

            {visivel('placaVeiculo') && (
                <TextField
                    label="Placa do veículo"
                    value={state.valores['placaVeiculo'] ?? ''}
                    onChange={(e) => setValor('placaVeiculo', e.target.value)}
                    disabled={somenteLeitura('placaVeiculo')}
                    required={obrigatorio('placaVeiculo')}
                    fullWidth size="small"
                />
            )}

            {visivel('tipoVeiculo') && (
                <TextField
                    label="Tipo Veículo"
                    value={state.valores['tipoVeiculo'] ?? ''}
                    onChange={(e) => setValor('tipoVeiculo', e.target.value)}
                    disabled={somenteLeitura('tipoVeiculo')}
                    required={obrigatorio('tipoVeiculo')}
                    fullWidth size="small"
                />
            )}
        </Stack>
    );
}
