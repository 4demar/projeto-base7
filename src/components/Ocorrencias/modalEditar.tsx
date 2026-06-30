import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { TipoOcorrencia } from '../../types';
import { useFormBoletimCadastro, FormActions } from '../../contexts/FormCadastroContext';
import { useFormularioOcorrencia } from '../../hook/useFormularioOcorrencia';
import { useRegrasFormulario } from '../../contexts/RegrasFormularioContext';
import TabsOcorrencia from './tabs';

interface Props {
    aberto: boolean;
    onFechar: () => void;
    tipo: TipoOcorrencia | null;
}

/**
 * Modal para editar ou visualizar uma ocorrência existente.
 * Carrega as mesmas tabs com navegação Voltar/Próximo e click direto na tab.
 */
export default function ModalEditarOcorrencia({ aberto, onFechar, tipo }: Props) {
    const { dispatch } = useFormBoletimCadastro();
    const { fluxoAtual } = useFormularioOcorrencia();
    const { limparRegras } = useRegrasFormulario();

    const titulo = fluxoAtual === 'visualizacao'
        ? 'Visualizar Ocorrência'
        : 'Editar Ocorrência';

    const handleFechar = () => {
        limparRegras();
        dispatch({ type: FormActions.setShowModal, payload: false });
        onFechar();
    };

    const handleSalvar = () => {
        // Simulação — no app real gravaria via API
        alert('Ocorrência atualizada com sucesso (simulação).');
        handleFechar();
    };

    return (
        <Dialog open={aberto} onClose={handleFechar} maxWidth="md" fullWidth>
            <DialogTitle>{titulo}</DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
                <TabsOcorrencia
                    tipo={tipo}
                    onSalvar={handleSalvar}
                />
            </DialogContent>
        </Dialog>
    );
}
