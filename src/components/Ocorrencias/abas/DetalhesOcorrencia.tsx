import { Stack, TextField, Typography } from '@mui/material';
import { useFormBoletimCadastro, FormActions } from '../../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../../hook/useFormularioOcorrencia';

const ID_TAB = 1;

export default function DetalhesOcorrencia() {
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
            <Typography variant="subtitle1" fontWeight={600}>Detalhes da ocorrência</Typography>

            {visivel('tituloOcorrencia') && (
                <TextField
                    label="Título da ocorrência"
                    value={state.valores['tituloOcorrencia'] ?? ''}
                    onChange={(e) => setValor('tituloOcorrencia', e.target.value)}
                    disabled={somenteLeitura('tituloOcorrencia')}
                    required={obrigatorio('tituloOcorrencia')}
                    fullWidth size="small"
                />
            )}

            {visivel('descricaoOcorrencia') && (
                <TextField
                    label="Descrição da ocorrência"
                    value={state.valores['descricaoOcorrencia'] ?? ''}
                    onChange={(e) => setValor('descricaoOcorrencia', e.target.value)}
                    disabled={somenteLeitura('descricaoOcorrencia')}
                    required={obrigatorio('descricaoOcorrencia')}
                    fullWidth multiline minRows={3} size="small"
                />
            )}

            {visivel('providenciasTomadas') && (
                <TextField
                    label="Providências tomadas"
                    value={state.valores['providenciasTomadas'] ?? ''}
                    onChange={(e) => setValor('providenciasTomadas', e.target.value)}
                    disabled={somenteLeitura('providenciasTomadas')}
                    required={obrigatorio('providenciasTomadas')}
                    fullWidth multiline minRows={2} size="small"
                />
            )}
        </Stack>
    );
}
