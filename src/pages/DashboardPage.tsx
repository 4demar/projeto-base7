import { useState, useMemo } from 'react';
import {
    Box, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem,
    Chip, Link, Paper, Divider, alpha, Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Description, BarChart, AccountTree, Code, Cloud, OpenInNew, Build,
    Person, Groups, Storage, Architecture, RocketLaunch, Engineering,
} from '@mui/icons-material';
import { applications } from '../data/mockData';
import { Application, Environment, Tool } from '../types';
import { useOutletContext } from 'react-router-dom';

const iconMap: Record<string, React.ReactElement> = {
    Description: <Description />, BarChart: <BarChart />, AccountTree: <AccountTree />,
    Code: <Code />, Cloud: <Cloud />,
};

export default function DashboardPage() {
    const { search } = useOutletContext<{ search: string }>();
    const [selectedAppId, setSelectedAppId] = useState<string>('');
    const [selectedEnvId, setSelectedEnvId] = useState<string>('');
    const [selectedToolId, setSelectedToolId] = useState<string>('');

    const filteredApps = useMemo(() => {
        if (!search) return applications;
        const s = search.toLowerCase();
        return applications.filter(a => a.name.toLowerCase().includes(s) || a.description.toLowerCase().includes(s));
    }, [search]);

    const selectedApp: Application | undefined = filteredApps.find(a => a.id === selectedAppId);
    const selectedEnv: Environment | undefined = selectedApp?.environments.find(e => e.id === selectedEnvId);
    const selectedTool: Tool | undefined = selectedEnv?.tools.find(t => t.id === selectedToolId);

    const handleAppChange = (appId: string) => {
        setSelectedAppId(appId);
        setSelectedEnvId('');
        setSelectedToolId('');
    };

    const handleEnvChange = (envId: string) => {
        setSelectedEnvId(envId);
        setSelectedToolId('');
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Painel do Desenvolvedor</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Selecione o contexto para acessar ferramentas e responsáveis
            </Typography>

            {selectedAppId && (
                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    {selectedApp && <Chip label={selectedApp.name} color="primary" onDelete={() => handleAppChange('')} />}
                    {selectedEnv && <Chip label={selectedEnv.name} color="secondary" onDelete={() => handleEnvChange('')} />}
                    {selectedTool && <Chip label={selectedTool.name} variant="outlined" onDelete={() => setSelectedToolId('')} />}
                </Box>
            )}

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel>Aplicação</InputLabel>
                        <Select value={selectedAppId} label="Aplicação" onChange={(e) => handleAppChange(e.target.value)}>
                            {filteredApps.map(app => (
                                <MenuItem key={app.id} value={app.id}>{app.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth disabled={!selectedAppId}>
                        <InputLabel>Ambiente</InputLabel>
                        <Select value={selectedEnvId} label="Ambiente" onChange={(e) => handleEnvChange(e.target.value)}>
                            {selectedApp?.environments.map(env => (
                                <MenuItem key={env.id} value={env.id}>{env.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth disabled={!selectedEnvId}>
                        <InputLabel>Ferramenta</InputLabel>
                        <Select value={selectedToolId} label="Ferramenta" onChange={(e) => setSelectedToolId(e.target.value)}>
                            {selectedEnv?.tools.map(tool => (
                                <MenuItem key={tool.id} value={tool.id}>{tool.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {selectedApp && !selectedEnvId && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>{selectedApp.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedApp.description}</Typography>
                        <Link href={selectedApp.documentationUrl} target="_blank" rel="noopener"
                            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                            <OpenInNew fontSize="small" /> Documentação do Projeto
                        </Link>
                    </CardContent>
                </Card>
            )}

            {selectedEnv && !selectedToolId && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Ferramentas Disponíveis</Typography>
                    <Grid container spacing={2}>
                        {selectedEnv.tools.map(tool => (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={tool.id}>
                                <Card sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' } }}
                                    onClick={() => setSelectedToolId(tool.id)}>
                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                        <Box sx={{ color: 'primary.main', mb: 1 }}>{iconMap[tool.icon] || <Build />}</Box>
                                        <Typography variant="subtitle2">{tool.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{tool.category}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {selectedTool && selectedEnv && (
                <Box>
                    <Card sx={{ mb: 3, borderColor: 'primary.main' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Box sx={{ color: 'primary.main' }}>{iconMap[selectedTool.icon] || <Build />}</Box>
                                <Box>
                                    <Typography variant="h6">{selectedTool.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{selectedTool.category}</Typography>
                                </Box>
                            </Box>
                            <Link href={selectedTool.url} target="_blank" rel="noopener"
                                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                <OpenInNew fontSize="small" /> Abrir {selectedTool.name}
                            </Link>
                        </CardContent>
                    </Card>

                    <Typography variant="h6" gutterBottom>Responsáveis</Typography>
                    <Grid container spacing={2}>
                        {[
                            { label: 'Time Responsável', value: selectedEnv.responsibles.team, icon: <Groups />, color: '#6C63FF' },
                            { label: 'Tech Lead', value: selectedEnv.responsibles.techLead, icon: <Person />, color: '#00BFA6' },
                            { label: 'Arquitetura', value: selectedEnv.responsibles.architecture, icon: <Architecture />, color: '#FF6B6B' },
                            { label: 'Banco de Dados', value: selectedEnv.responsibles.database, icon: <Storage />, color: '#FFA726' },
                            { label: 'Infraestrutura / SRE', value: selectedEnv.responsibles.infrastructure, icon: <Engineering />, color: '#42A5F5' },
                            { label: 'Deploy', value: selectedEnv.responsibles.deploy, icon: <RocketLaunch />, color: '#AB47BC' },
                        ].map((item) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.label}>
                                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: alpha(item.color, 0.08), border: `1px solid ${alpha(item.color, 0.2)}` }}>
                                    <Avatar sx={{ bgcolor: alpha(item.color, 0.2), color: item.color }}>{item.icon}</Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                                        <Typography variant="body2">{item.value}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {selectedApp && (
                        <Box sx={{ mt: 3 }}>
                            <Divider sx={{ mb: 2 }} />
                            <Link href={selectedApp.documentationUrl} target="_blank" rel="noopener"
                                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                <OpenInNew fontSize="small" /> Documentação - {selectedApp.name}
                            </Link>
                        </Box>
                    )}
                </Box>
            )}

            {!selectedAppId && (
                <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'transparent', border: '1px dashed #30363D' }}>
                    <Typography variant="h6" color="text.secondary">Selecione uma aplicação para começar</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Use os filtros acima para navegar pelo contexto de ferramentas e responsáveis
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
