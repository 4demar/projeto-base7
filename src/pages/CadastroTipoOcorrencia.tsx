import { useState } from 'react';
import {
    Box, Typography, Tabs, Tab, Breadcrumbs, Link as MuiLink, Stack,
} from '@mui/material';
import { SettingsSuggest } from '@mui/icons-material';
import TiposTab from '../components/Ocorrencia/TiposTab';
import SubtiposTab from '../components/Ocorrencia/SubtiposTab';

export default function CadastroTipoOcorrencia() {
    const [tab, setTab] = useState(0);

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
            <Breadcrumbs sx={{ mb: 1 }}>
                <MuiLink underline="hover" color="inherit" href="#">Administração</MuiLink>
                <Typography color="text.primary">Configuração de Ocorrências</Typography>
            </Breadcrumbs>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <SettingsSuggest color="primary" />
                <Box>
                    <Typography variant="h5">Configuração de Ocorrências</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Configure Tipos (definem as Tabs) e Subtipos (definem os Campos exibidos).
                    </Typography>
                </Box>
            </Stack>

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{ mb: 3, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}
            >
                <Tab label="Tipos" />
                <Tab label="Subtipos" />
            </Tabs>

            {tab === 0 && <TiposTab />}
            {tab === 1 && <SubtiposTab />}
        </Box>
    );
}
