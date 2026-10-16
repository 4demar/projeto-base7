import { useEffect, useMemo, useState } from 'react';
import { Box, Tabs, Tab, Stack, Button, CircularProgress } from '@mui/material';
import { ArrowBack, ArrowForward, Save } from '@mui/icons-material';
import { useRegrasFormulario } from '../../contexts/RegrasFormularioContext';
import { useFormularioOcorrencia, FluxoOcorrencia } from '../../hook/useFormularioOcorrencia';
import { listaNavegacaoBase } from '../ConfiguracaoOcorrencias/types';
import { TipoOcorrencia } from '../../types';
import { useFormBoletimCadastro } from '../../contexts/FormCadastroContext';

// Componentes de cada aba
import DadosOcorrencia from './abas/DadosOcorrencia';
import DetalhesOcorrencia from './abas/DetalhesOcorrencia';
import ProdutosOcorrencia from './abas/ProdutosOcorrencia';
import VeiculosOcorrencia from './abas/VeiculosOcorrencia';
import Envolvidos from './abas/Envolvidos';
import AnexarArquivos from './abas/AnexarArquivos';
import DevolucaoCliente from './abas/DevolucaoCliente';
import AnaliseOcorrencia from './abas/AnaliseOcorrencia';
import Anotacoes from './abas/Anotacoes';
import OcorrenciasRelacionadas from './abas/OcorrenciasRelacionadas';

interface Props {
    tipo: TipoOcorrencia | null;
    tipos?: TipoOcorrencia[];
    modoCadastro?: boolean;
    onSalvar?: () => void;
}

const nomeTab = (idTab: number) =>
    listaNavegacaoBase.find(t => t.id === idTab)?.descricao ?? `Aba ${idTab}`;

/** Renderiza o componente da aba pelo id */
function renderizarAba(idTab: number, tipos: TipoOcorrencia[], modoCadastro: boolean) {
    switch (idTab) {
        case 0: return <DadosOcorrencia tipos={tipos} modoCadastro={modoCadastro} />;
        case 1: return <DetalhesOcorrencia />;
        case 2: return <ProdutosOcorrencia />;
        case 3: return <VeiculosOcorrencia />;
        case 4: return <Envolvidos />;
        case 5: return <AnexarArquivos />;
        case 6: return <DevolucaoCliente />;
        case 7: return <AnaliseOcorrencia />;
        case 8: return <Anotacoes />;
        case 9: return <OcorrenciasRelacionadas />;
        default: return null;
    }
}

export default function TabsOcorrencia({ tipo, tipos = [], modoCadastro = false, onSalvar }: Props) {
    const { state } = useFormBoletimCadastro();
    const { carregarRegras, carregarCamposTab, limparRegras } = useRegrasFormulario();
    const { fluxoAtual } = useFormularioOcorrencia();
    const [tabAtiva, setTabAtiva] = useState(0);
    const [carregando, setCarregando] = useState(false);

    const idTipo = state.tipoOcorrencia;
    const idComplemento = state.complementoOcorrencia;
    const subtipoSelecionado = idComplemento !== 0;

    // Tabs permitidas para o fluxo atual, na ordem configurada pelo tipo.
    const tabsVisiveis = useMemo(() => {
        if (!tipo?.tabsConfiguracao) return [0]; // Ao menos a aba 0 (Dados)
        const filtradas = [...tipo.tabsConfiguracao]
            .filter(tab => {
                switch (fluxoAtual) {
                    case FluxoOcorrencia.Cadastro: return tab.cadastrar;
                    case FluxoOcorrencia.Edicao: return tab.editar;
                    case FluxoOcorrencia.Visualizacao: return tab.visualizar;
                    default: return false;
                }
            })
            .sort((a, b) => a.ordem - b.ordem)
            .map(tab => tab.idTab);
        return filtradas.length > 0 ? filtradas : [0];
    }, [tipo, fluxoAtual]);

    // Carrega regras e campos quando subtipo muda.
    useEffect(() => {
        if (idComplemento === 0 || tabsVisiveis.length === 0) {
            limparRegras();
            return;
        }
        let ativo = true;
        setCarregando(true);
        (async () => {
            await carregarRegras(idTipo, idComplemento);
            await Promise.all(tabsVisiveis.map(idTab => carregarCamposTab(idTab)));
        })().finally(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idTipo, idComplemento]);

    const indiceAtivo = Math.min(tabAtiva, tabsVisiveis.length - 1);
    const idTabAtual = tabsVisiveis[indiceAtivo];
    const ehPrimeira = indiceAtivo === 0;
    const ehUltima = indiceAtivo === tabsVisiveis.length - 1;

    const voltar = () => setTabAtiva(prev => Math.max(0, prev - 1));
    const proximo = () => setTabAtiva(prev => Math.min(tabsVisiveis.length - 1, prev + 1));

    // No modo cadastro, só pode avançar da aba 0 se tipo+subtipo estão preenchidos.
    const podeAvancar = modoCadastro && ehPrimeira ? subtipoSelecionado : true;

    return (
        <Box>
            <Tabs
                value={indiceAtivo}
                onChange={(_, v) => setTabAtiva(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { textTransform: 'none' } }}
            >
                {tabsVisiveis.map((idTab, i) => (
                    <Tab key={idTab} value={i} label={nomeTab(idTab)} />
                ))}
            </Tabs>

            <Box sx={{ p: 3 }}>
                {carregando ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}><CircularProgress size={24} /></Box>
                ) : (
                    renderizarAba(idTabAtual, tipos, modoCadastro)
                )}
            </Box>

            <Stack direction="row" justifyContent="space-between" sx={{ px: 3, pb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={voltar}
                    disabled={ehPrimeira}
                >
                    Voltar
                </Button>

                {ehUltima && subtipoSelecionado ? (
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={onSalvar}
                        color="success"
                    >
                        Salvar Ocorrência
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        endIcon={<ArrowForward />}
                        onClick={proximo}
                        disabled={!podeAvancar}
                    >
                        Próximo
                    </Button>
                )}
            </Stack>
        </Box>
    );
}
