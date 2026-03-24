import { useState, useRef } from 'react';
import {
    Box, Typography, Card, CardContent, TextField, Button, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel,
    Select, MenuItem, Chip, Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add, Delete, Edit, Image as ImageIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { useAnnotations } from '../store/useStore';
import { applications } from '../data/mockData';

export default function AnnotationsPage() {
    const { annotations, addAnnotation, updateAnnotation, deleteAnnotation } = useAnnotations();
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [appId, setAppId] = useState('');
    const [envId, setEnvId] = useState('');
    const [toolId, setToolId] = useState('');
    const [filterApp, setFilterApp] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const selectedApp = applications.find(a => a.id === appId);
    const selectedEnv = selectedApp?.environments.find(e => e.id === envId);

    const resetForm = () => {
        setTitle(''); setContent(''); setImages([]); setAppId(''); setEnvId(''); setToolId(''); setEditId(null);
    };

    const handleOpen = (id?: string) => {
        if (id) {
            const ann = annotations.find(a => a.id === id);
            if (ann) {
                setEditId(id); setTitle(ann.title); setContent(ann.content); setImages(ann.images);
                setAppId(ann.applicationId || ''); setEnvId(ann.environmentId || ''); setToolId(ann.toolId || '');
            }
        } else { resetForm(); }
        setOpen(true);
    };

    const handleSave = () => {
        const data = { title, content, images, applicationId: appId || undefined, environmentId: envId || undefined, toolId: toolId || undefined };
        if (editId) { updateAnnotation(editId, data); }
        else { addAnnotation(data); }
        setOpen(false); resetForm();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { if (ev.target?.result) setImages(prev => [...prev, ev.target!.result as string]); };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => { if (ev.target?.result) setImages(prev => [...prev, ev.target!.result as string]); };
            reader.readAsDataURL(file);
        });
    };

    const filtered = filterApp ? annotations.filter(a => a.applicationId === filterApp) : annotations;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Anotações</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Nova Anotação</Button>
            </Box>

            <FormControl size="small" sx={{ mb: 3, minWidth: 200 }}>
                <InputLabel>Filtrar por Aplicação</InputLabel>
                <Select value={filterApp} label="Filtrar por Aplicação" onChange={(e) => setFilterApp(e.target.value)}>
                    <MenuItem value="">Todas</MenuItem>
                    {applications.map(app => <MenuItem key={app.id} value={app.id}>{app.name}</MenuItem>)}
                </Select>
            </FormControl>

            <Grid container spacing={2}>
                {filtered.map(ann => {
                    const app = applications.find(a => a.id === ann.applicationId);
                    return (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={ann.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{ann.title}</Typography>
                                        <Box>
                                            <IconButton size="small" onClick={() => handleOpen(ann.id)}><Edit fontSize="small" /></IconButton>
                                            <IconButton size="small" onClick={() => deleteAnnotation(ann.id)} color="error"><Delete fontSize="small" /></IconButton>
                                        </Box>
                                    </Box>
                                    {app && <Chip label={app.name} size="small" sx={{ mb: 1 }} />}
                                    <Box sx={{ '& p': { m: 0, fontSize: 14 }, '& pre': { bgcolor: '#1E1E1E', p: 1, borderRadius: 1, overflow: 'auto' }, maxHeight: 200, overflow: 'auto' }}>
                                        <ReactMarkdown>{ann.content}</ReactMarkdown>
                                    </Box>
                                    {ann.images.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                            {ann.images.map((img, i) => (
                                                <Box key={i} component="img" src={img} sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1, border: '1px solid #30363D' }} />
                                            ))}
                                        </Box>
                                    )}
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        {new Date(ann.updatedAt).toLocaleString('pt-BR')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {filtered.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', border: '1px dashed #30363D' }}>
                    <Typography color="text.secondary">Nenhuma anotação encontrada</Typography>
                </Paper>
            )}

            {/* Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editId ? 'Editar Anotação' : 'Nova Anotação'}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Título" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 1, mb: 2 }} />
                    <TextField fullWidth multiline rows={8} label="Conteúdo (Markdown)" value={content}
                        onChange={(e) => setContent(e.target.value)} onPaste={handlePaste}
                        sx={{ mb: 2, '& textarea': { fontFamily: 'monospace', fontSize: 13 } }} />
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button variant="outlined" size="small" startIcon={<ImageIcon />} onClick={() => fileRef.current?.click()}>
                            Upload Imagem
                        </Button>
                        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleFileUpload} />
                        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                            Ou cole uma imagem (Ctrl+V)
                        </Typography>
                    </Box>
                    {images.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            {images.map((img, i) => (
                                <Box key={i} sx={{ position: 'relative' }}>
                                    <Box component="img" src={img} sx={{ width: 100, height: 75, objectFit: 'cover', borderRadius: 1 }} />
                                    <IconButton size="small" sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
                                        onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}>
                                        <Delete sx={{ fontSize: 14 }} />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Aplicação</InputLabel>
                                <Select value={appId} label="Aplicação" onChange={(e) => { setAppId(e.target.value); setEnvId(''); setToolId(''); }}>
                                    <MenuItem value="">Nenhuma</MenuItem>
                                    {applications.map(app => <MenuItem key={app.id} value={app.id}>{app.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <FormControl fullWidth size="small" disabled={!appId}>
                                <InputLabel>Ambiente</InputLabel>
                                <Select value={envId} label="Ambiente" onChange={(e) => { setEnvId(e.target.value); setToolId(''); }}>
                                    <MenuItem value="">Nenhum</MenuItem>
                                    {selectedApp?.environments.map(env => <MenuItem key={env.id} value={env.id}>{env.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <FormControl fullWidth size="small" disabled={!envId}>
                                <InputLabel>Ferramenta</InputLabel>
                                <Select value={toolId} label="Ferramenta" onChange={(e) => setToolId(e.target.value)}>
                                    <MenuItem value="">Nenhuma</MenuItem>
                                    {selectedEnv?.tools.map(tool => <MenuItem key={tool.id} value={tool.id}>{tool.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave} disabled={!title || !content}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
