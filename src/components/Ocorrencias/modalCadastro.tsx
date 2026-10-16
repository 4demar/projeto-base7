import { useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TipoOcorrencia } from '../../types';
import { useFormBoletimCadastro, FormActions } from '../../contexts/FormCadastroContext';
import { useRegrasFormulario } from '../../contexts/RegrasFormularioContext';
import { OcorrenciaSalva, carregarOcorrencias, salvarOcorrencias } from './storage';
import TabsOcorrencia from './tabs';

interface Props {
    aberto: boolean;
    onFechar: () => void;
    /** Chamado após gravar a nova ocorrência (para a listagem recarregar). */
    onSalvo: () => void;
    tipos: TipoOcorrencia[];
}

/**
 * Modal de cadastro de nova ocorrência.
 * Tipo e Subtipo ficam na primeira aba. Navegação por tabs com Voltar/Próximo.
 * showModal permanece false para que o fluxo seja "cadastro" (e não "edição").
 */
export default function ModalCadastroOcorrencia({ aberto, onFechar, onSalvo, tipos }: Props) {
    const { state, dispatch } = useFormBoletimCadastro();
    const { limparRegras } = useRegrasFormulario();

    const tipoSelecionado = useMemo(
        () => tipos.find(t => t.numeroTipo === state.tipoOcorrencia) ?? null,
        [tipos, state.tipoOcorrencia]
    );

    const handleFechar = () => {
        limparRegras();
        dispatch({ type: FormActions.resetFormulario });
        onFechar();
    };

    const handleSalvar = () => {
        const subtipoObj = tipoSelecionado?.complementoOcorrencia?.find(
            c => c.numeroComplemento === state.complementoOcorrencia
        );
        const nova: OcorrenciaSalva = {
            id: crypto.randomUUID(),
            tipoNome: tipoSelecionado?.nomeTipo ?? '',
            subtipoNome: subtipoObj?.nomeComplemento ?? '',
            numeroTipo: state.tipoOcorrencia,
            numeroComplemento: state.complementoOcorrencia,
            status: 'finalizada',
            valores: { ...state.valores },
            criadaEm: new Date().toISOString(),
        };
        salvarOcorrencias([nova, ...carregarOcorrencias()]);
        onSalvo();
        handleFechar();
    };

    return (
        <Dialog open={aberto} onClose={handleFechar} maxWidth="md" fullWidth>
            <DialogTitle sx={{ pr: 6 }}>
                Cadastro de Ocorrência
                <IconButton
                    aria-label="Fechar"
                    onClick={handleFechar}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
                <TabsOcorrencia
                    tipo={tipoSelecionado}
                    tipos={tipos}
                    modoCadastro
                    onSalvar={handleSalvar}
                />
            </DialogContent>
        </Dialog>
    );
}
