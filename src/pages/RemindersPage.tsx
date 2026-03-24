import { useState } from 'react';
import {
    Box, Typography, Card, CardContent, TextField, Button, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Chip, Paper, alpha,
} from '@mui/material';
import { Add, Delete, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { useReminders, useAnnotations } from '../store/useStore';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function getDueLabel(dateStr: string) {
    const date = new Date(dateStr);
    if (isToday(date)) return { label: 'Hoje', color: '#FF6B6B' };
    if (isTomorrow(date)) return { label: 'Amanhã', color: '#FFA726' };
    if (isPast(date)) return { label: 'Atrasado', color: '#FF6B6B' };
    const days = differenceInDays(date, new Date());
    if (days <= 7) return { label: `Em ${days} dias`, color: '#42A5F5' };
    return { label: format(date, "dd/MM/yyyy", { locale: ptBR }), color: '#8B949E' };
}

export default function RemindersPage() {
    const { reminders, addReminder, toggleReminder, deleteReminder } = useReminders();
    const { annotations } = useAnnotations();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [annotationId, setAnnotationId] = useState('');
    const [showCompleted, setShowCompleted] = useState(false);

    const handleSave = () => {
        addReminder({ title, description, dueDate, annotationId: annotationId || undefined, completed: false });
        setOpen(false); setTitle(''); setDescription(''); setDueDate(''); setAnnotationId('');
    };

    const pending = reminders.filter(r => !r.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const completed = reminders.filter(r => r.completed);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Lembretes</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Novo Lembrete</Button>
            </Box>

            {/* Pending */}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Pendentes ({pending.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                {pending.map(rem => {
                    const due = getDueLabel(rem.dueDate);
                    const ann = annotations.find(a => a.id === rem.annotationId);
                    return (
                        <Card key={rem.id} sx={{ borderLeft: `3px solid ${due.color}` }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                <IconButton onClick={() => toggleReminder(rem.id)}>
                                    <RadioButtonUnchecked sx={{ color: due.color }} />
                                </IconButton>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2">{rem.title}</Typography>
                                    {rem.description && <Typography variant="body2" color="text.secondary">{rem.description}</Typography>}
                                    {ann && <Chip label={`📝 ${ann.title}`} size="small" variant="outlined" sx={{ mt: 0.5 }} />}
                                </Box>
                                <Chip label={due.label} size="small" sx={{ bgcolor: alpha(due.color, 0.15), color: due.color, fontWeight: 600 }} />
                                <IconButton size="small" onClick={() => deleteReminder(rem.id)} color="error"><Delete fontSize="small" /></IconButton>
                            </CardContent>
                        </Card>
                    );
                })}
                {pending.length === 0 && (
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'transparent', border: '1px dashed #30363D' }}>
                        <Typography color="text.secondary">Nenhum lembrete pendente</Typography>
                    </Paper>
                )}
            </Box>

            {/* Completed toggle */}
            {completed.length > 0 && (
                <Box>
                    <Button size="small" onClick={() => setShowCompleted(!showCompleted)} sx={{ mb: 1 }}>
                        {showCompleted ? 'Ocultar' : 'Mostrar'} concluídos ({completed.length})
                    </Button>
                    {showCompleted && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {completed.map(rem => (
                                <Card key={rem.id} sx={{ opacity: 0.6 }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, '&:last-child': { pb: 1 } }}>
                                        <IconButton onClick={() => toggleReminder(rem.id)}>
                                            <CheckCircle color="success" />
                                        </IconButton>
                                        <Typography variant="body2" sx={{ textDecoration: 'line-through', flex: 1 }}>{rem.title}</Typography>
                                        <IconButton size="small" onClick={() => deleteReminder(rem.id)} color="error"><Delete fontSize="small" /></IconButton>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            {/* Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Novo Lembrete</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Título" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 1, mb: 2 }} />
                    <TextField fullWidth label="Descrição" multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
                    <TextField fullWidth type="date" label="Data" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
                    {annotations.length > 0 && (
                        <TextField fullWidth select label="Vincular a Anotação (opcional)" value={annotationId} onChange={(e) => setAnnotationId(e.target.value)}>
                            <option value="">Nenhuma</option>
                            {annotations.map(ann => (
                                <option key={ann.id} value={ann.id}>{ann.title}</option>
                            ))}
                        </TextField>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave} disabled={!title || !dueDate}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
