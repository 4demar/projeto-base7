import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TipoOcorrencia } from '../../types';
import { useFormBoletimCadastro, FormActions } from '../../contexts/FormCadastroContext';
import { useControleBoletimOcorrencia } from '../../contexts/ControleBoletimContext';
import { useFormularioOcorrencia, FluxoOcorrencia } from '../../hook/useFormularioOcorrencia';
import { useRegrasFormulario } from '../../contexts/RegrasFormularioContext';
import { OcorrenciaSalva } from './storage';
import TabsOcorrencia from './tabs';

interface Props {
    aberto: boolean;
    onFechar: () => void;
    tipo: TipoOcorrencia | null;
    // Catálogo completo (inclusive inativos) para resolver Tipo/Subtipo da ocorrência.
    tipos: TipoOcorrencia[];
    ocorrencia: OcorrenciaSalva | null;
}

/**
 * Modal para editar ou visualizar uma ocorrência existente.
 * Carrega as mesmas tabs com navegação Voltar/Próximo e click direto na tab.
 */
export default function ModalEditarOcorrencia({ aberto, onFechar, tipo, tipos, ocorrencia }: Props) {
    const { dispatch } = useFormBoletimCadastro();
    const { setSomenteVisualizacao } = useControleBoletimOcorrencia();
    const { fluxoAtual } = useFormularioOcorrencia();
    const { limparRegras } = useRegrasFormulario();

    const titulo = fluxoAtual === FluxoOcorrencia.Visualizacao
        ? 'Visualizar Ocorrência'
        : 'Editar Ocorrência';

    const handleFechar = () => {
        limparRegras();
        dispatch({ type: FormActions.setShowModal, payload: false });
        setSomenteVisualizacao(false);
        onFechar();
    };

    const handleSalvar = () => {
        // Simulação — no app real gravaria via API
        alert('Ocorrência atualizada com sucesso (simulação).');
        handleFechar();
    };

    return (
        <Dialog open={aberto} onClose={handleFechar} maxWidth="md" fullWidth>
            <DialogTitle sx={{ pr: 6 }}>
                {titulo}
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
                    tipo={tipo}
                    tipos={tipos}
                    onSalvar={handleSalvar}
                    nomeTipoSalvo={ocorrencia?.tipoNome}
                    nomeSubtipoSalvo={ocorrencia?.subtipoNome}
                />
            </DialogContent>
        </Dialog>
    );
}
