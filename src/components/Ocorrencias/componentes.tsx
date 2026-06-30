import { Stack, TextField, Typography } from '@mui/material';
import { useFormularioOcorrencia } from '../../hook/useFormularioOcorrencia';
import { useFormBoletimCadastro, FormActions } from '../../contexts/FormCadastroContext';
import { useRegrasFormulario } from '../../contexts/RegrasFormularioContext';

interface Props {
    idTab: number;
}

/**
 * Renderiza os campos visíveis de uma aba, aplicando as regras de editável/obrigatório
 * conforme o fluxo atual (Cadastro, Edição ou Visualização).
 */
export default function CamposTab({ idTab }: Props) {
    const { obterCamposTab } = useRegrasFormulario();
    const { campoEhVisivel, campoEhSomenteLeitura, campoEhObrigatorio } = useFormularioOcorrencia();
    const { state, dispatch } = useFormBoletimCadastro();

    const todosCampos = obterCamposTab(idTab);
    const camposVisiveis = todosCampos.filter(
        campo => campoEhVisivel(idTab, campo.nome)
    );
    // Fallback: se nenhum campo é visível por regra mas a aba tem campos no catálogo,
    // exibe todos (sem restrição — admin não configurou regras para este subtipo).
    const campos = camposVisiveis.length > 0 ? camposVisiveis : todosCampos;

    if (campos.length === 0) {
        return (
            <Typography color="text.secondary" sx={{ p: 2 }}>
                Nenhum campo disponível nesta aba.
            </Typography>
        );
    }

    return (
        <Stack spacing={2} sx={{ mt: 1 }}>
            {campos.map(campo => {
                const somenteLeitura = campoEhSomenteLeitura(idTab, campo.nome);
                const obrigatorio = campoEhObrigatorio(idTab, campo.nome);

                return (
                    <TextField
                        key={campo.id}
                        label={campo.label}
                        value={state.valores[campo.nome] ?? ''}
                        onChange={(e) => dispatch({
                            type: FormActions.setCampo,
                            payload: { nome: campo.nome, valor: e.target.value },
                        })}
                        required={obrigatorio}
                        disabled={somenteLeitura}
                        fullWidth
                        size="small"
                        helperText={somenteLeitura ? 'Somente leitura' : undefined}
                    />
                );
            })}
        </Stack>
    );
}
