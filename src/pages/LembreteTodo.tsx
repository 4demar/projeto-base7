import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box, Typography, Card, CardContent, TextField, Button, IconButton,
    Chip, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
    Tooltip, Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Add, Delete, CheckCircle, RadioButtonUnchecked,
    NotificationsActive, NotificationsOff,
} from '@mui/icons-material';
import { format, isPast, isToday, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLembrete } from '../store/useStore';
import { LembreteDto } from '../types';

function getStatusColor(dueDate: string, completed: boolean) {
    if (completed) return 'success';
    const due = new Date(dueDate);
    if (isPast(due)) return 'error';
    if (isToday(due)) return 'warning';
    return 'info';
}

function getStatusLabel(dueDate: string, completed: boolean) {
    if (completed) return 'Concluído';
    const due = new Date(dueDate);
    if (isPast(due)) return 'Atrasado';
    if (isToday(due)) return 'Hoje';
    return 'Pendente';
}

export default function LembreteTodo() {
    const { lembrete, addLembrete, toggleLembrete, deleteLembrete } = useLembrete();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [notifPermission, setNotifPermission] = useState(Notification.permission);
    const notifiedRef = useRef<Set<string>>(new Set());

    const requestPermission = useCallback(async () => {
        const perm = await Notification.requestPermission();
        setNotifPermission(perm);
    }, []);

    const sendNotification = useCallback((item: LembreteDto) => {
        if (Notification.permission !== 'granted') return;
        if (notifiedRef.current.has(item.id)) return;
        notifiedRef.current.add(item.id);
        new Notification('⏰ Lembrete - PortalDev', {
            body: `${item.title}\n${item.description}`,
            icon: '/vite.svg',
            tag: item.id,
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            lembrete
                .filter(r => !r.completed && !notifiedRef.current.has(r.id))
                .forEach(r => {
                    const due = new Date(r.dueDate);
                    const diff = differenceInMinutes(due, now);
                    if (diff <= 5 && diff >= -1) {
                        sendNotification(r);
                    }
                });
        }, 30_000);
        return () => clearInterval(interval);
    }, [lembrete, sendNotification]);

    const handleAdd = () => {
        if (!title.trim() || !dueDate) return;
        addLembrete({ title: title.trim(), description: description.trim(), dueDate, completed: false });
        setTitle('');
        setDescription('');
        setDueDate('');
        setOpen(false);
    };

    const pending = lembrete.filter(r => !r.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const completed = lembrete.filter(r => r.completed);

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Lembretes</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {notifPermission !== 'granted' && (
                        <Tooltip title="Ativar notificações do navegador">
                            <Button variant="outlined" size="small" startIcon={<NotificationsOff />} onClick={requestPermission}>
                                Ativar Notificações
                            </Button>
                        </Tooltip>
                    )}
                    <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                        Novo Lembrete
                    </Button>
                </Box>
            </Box>

            {notifPermission === 'granted' && (
                <Alert severity="success" icon={<NotificationsActive />} sx={{ mb: 2 }}>
                    Notificações ativadas — você receberá um pop-up 5 minutos antes do horário.
                </Alert>
            )}
            {notifPermission === 'denied' && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Notificações bloqueadas pelo navegador. Habilite nas configurações do navegador para receber alertas.
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                        Pendentes ({pending.length})
                    </Typography>
                    {pending.length === 0 && (
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">Nenhum lembrete pendente</Typography>
                        </Paper>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {pending.map(item => (
                            <LembreteCard key={item.id} item={item} onToggle={toggleLembrete} onDelete={deleteLembrete} />
                        ))}
                    </Box>

                    {completed.length > 0 && (
                        <>
                            <Typography variant="subtitle1" sx={{ mt: 4, mb: 1, color: 'text.secondary' }}>
                                Concluídos ({completed.length})
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {completed.map(item => (
                                    <LembreteCard key={item.id} item={item} onToggle={toggleLembrete} onDelete={deleteLembrete} />
                                ))}
                            </Box>
                        </>
                    )}
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>Resumo</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Total</Typography>
                                    <Typography variant="body2">{lembrete.length}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Pendentes</Typography>
                                    <Typography variant="body2" color="warning.main">{pending.length}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Atrasados</Typography>
                                    <Typography variant="body2" color="error.main">
                                        {pending.filter(r => isPast(new Date(r.dueDate))).length}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Concluídos</Typography>
                                    <Typography variant="body2" color="success.main">{completed.length}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Novo Lembrete</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
                    <TextField label="Título" fullWidth size="small" value={title} onChange={e => setTitle(e.target.value)} />
                    <TextField label="Descrição" fullWidth size="small" multiline rows={3} value={description} onChange={e => setDescription(e.target.value)} />
                    <TextField label="Data e Hora" type="datetime-local" fullWidth size="small" value={dueDate} onChange={e => setDueDate(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleAdd} disabled={!title.trim() || !dueDate}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

function LembreteCard({ item, onToggle, onDelete }: { item: LembreteDto; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
    const status = getStatusColor(item.dueDate, item.completed);
    const label = getStatusLabel(item.dueDate, item.completed);
    return (
        <Card sx={{ opacity: item.completed ? 0.6 : 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <IconButton size="small" onClick={() => onToggle(item.id)} sx={{ mt: 0.25 }}>
                    {item.completed ? <CheckCircle color="success" /> : <RadioButtonUnchecked />}
                </IconButton>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                            {item.title}
                        </Typography>
                        <Chip label={label} color={status} size="small" variant="outlined" />
                    </Box>
                    {item.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{item.description}</Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                        {format(new Date(item.dueDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </Typography>
                </Box>
                <Tooltip title="Excluir">
                    <IconButton size="small" onClick={() => onDelete(item.id)} color="error">
                        <Delete fontSize="small" />
                    </IconButton>
                </Tooltip>
            </CardContent>
        </Card>
    );
}
