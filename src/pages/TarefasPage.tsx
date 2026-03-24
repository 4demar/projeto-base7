import { useState, useMemo } from 'react';
import {
    Box, Typography, Card, CardContent, IconButton, Button, Chip, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
    InputLabel, Select, MenuItem, alpha, Menu, ListItemIcon, ListItemText,
    InputAdornment,
} from '@mui/material';
import {
    Add, Delete, Edit, ArrowForward, ArrowBack, MoreVert,
    FlagOutlined, KeyboardDoubleArrowUp, KeyboardArrowUp, Remove,
    Search, ExpandMore,
} from '@mui/icons-material';
import { useTarefas } from '../store/useStore';
import { TarefasColumn, TarefasTask } from '../types';

const PAGE_SIZE = 20;
const PAGINATED_COLUMNS: TarefasColumn[] = ['backlog', 'done'];

const COLUMNS: { id: TarefasColumn; label: string; color: string }[] = [
    { id: 'backlog', label: 'Backlog', color: '#8B949E' },
    { id: 'todo', label: 'A Fazer', color: '#6C63FF' },
    { id: 'doing', label: 'Em Progresso', color: '#FFA726' },
    { id: 'review', label: 'Revisão', color: '#42A5F5' },
    { id: 'done', label: 'Concluído', color: '#00BFA6' },
];

const PRIORITIES: { value: TarefasTask['priority']; label: string; color: string; icon: React.ReactElement }[] = [
    { value: 'urgent', label: 'Urgente', color: '#FF1744', icon: <KeyboardDoubleArrowUp /> },
    { value: 'high', label: 'Alta', color: '#FF6B6B', icon: <KeyboardArrowUp /> },
    { value: 'medium', label: 'Média', color: '#FFA726', icon: <Remove /> },
    { value: 'low', label: 'Baixa', color: '#8B949E', icon: <FlagOutlined /> },
];

function getPriority(p: TarefasTask['priority']) {
    return PRIORITIES.find(pr => pr.value === p) || PRIORITIES[2];
}

export default function TarefasPage() {
    const { tasks, addTask, updateTask, moveTask, deleteTask } = useTarefas();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editTask, setEditTask] = useState<TarefasTask | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TarefasTask['priority']>('medium');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [menuTaskId, setMenuTaskId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({
        backlog: PAGE_SIZE,
        done: PAGE_SIZE,
    });

    const filteredTasks = useMemo(() => {
        if (!search.trim()) return tasks;
        const s = search.toLowerCase();
        return tasks.filter(t =>
            t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s)
        );
    }, [tasks, search]);

    const resetForm = () => {
        setTitle(''); setDescription('');
        setPriority('medium'); setTagInput(''); setTags([]); setEditTask(null);
    };

    const openNew = () => {
        resetForm();
        setDialogOpen(true);
    };

    const openEdit = (task: TarefasTask) => {
        setEditTask(task); setTitle(task.title); setDescription(task.description);
        setPriority(task.priority); setTags([...task.tags]);
        setDialogOpen(true);
    };

    const handleSave = () => {
        if (!title.trim()) return;
        if (editTask) {
            updateTask(editTask.id, { title, description, priority, tags });
        } else {
            addTask({ title, description, column: 'backlog', priority, tags });
        }
        setDialogOpen(false);
        resetForm();
    };

    const handleTagAdd = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(''); }
    };

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, taskId: string) => {
        setMenuAnchor(e.currentTarget);
        setMenuTaskId(taskId);
    };

    const handleMenuClose = () => { setMenuAnchor(null); setMenuTaskId(null); };

    const getColumnIndex = (col: TarefasColumn) => COLUMNS.findIndex(c => c.id === col);

    const handleMoveLeft = () => {
        if (!menuTaskId) return;
        const task = tasks.find(t => t.id === menuTaskId);
        if (!task) return;
        const idx = getColumnIndex(task.column);
        if (idx > 0) moveTask(menuTaskId, COLUMNS[idx - 1].id);
        handleMenuClose();
    };

    const handleMoveRight = () => {
        if (!menuTaskId) return;
        const task = tasks.find(t => t.id === menuTaskId);
        if (!task) return;
        const idx = getColumnIndex(task.column);
        if (idx < COLUMNS.length - 1) moveTask(menuTaskId, COLUMNS[idx + 1].id);
        handleMenuClose();
    };

    const showMore = (colId: string) => {
        setVisibleCounts(prev => ({ ...prev, [colId]: (prev[colId] || PAGE_SIZE) + PAGE_SIZE }));
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h5">Tarefas</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                    <TextField
                        size="small" placeholder="Buscar tarefa..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> } }}
                        sx={{ width: 280 }}
                    />
                    <Button variant="contained" startIcon={<Add />} onClick={openNew}>
                        Nova Tarefa
                    </Button>
                </Box>
            </Box>

            {/* Board */}
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 'calc(100vh - 180px)' }}>
                {COLUMNS.map(col => {
                    const allColTasks = filteredTasks
                        .filter(t => t.column === col.id)
                        .sort((a, b) => a.order - b.order);

                    const isPaginated = PAGINATED_COLUMNS.includes(col.id);
                    const limit = visibleCounts[col.id] || PAGE_SIZE;
                    const visibleTasks = isPaginated ? allColTasks.slice(0, limit) : allColTasks;
                    const hasMore = isPaginated && allColTasks.length > limit;
                    const remaining = allColTasks.length - limit;

                    return (
                        <Paper
                            key={col.id}
                            sx={{
                                minWidth: 280, maxWidth: 320, flex: '1 0 280px',
                                bgcolor: alpha(col.color, 0.04), border: `1px solid ${alpha(col.color, 0.15)}`,
                                borderRadius: 1, display: 'flex', flexDirection: 'column',
                            }}
                        >
                            {/* Column header */}
                            <Box sx={{
                                p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderBottom: `2px solid ${alpha(col.color, 0.3)}`,
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: col.color }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{col.label}</Typography>
                                    <Chip label={allColTasks.length} size="small"
                                        sx={{ height: 20, fontSize: 11, bgcolor: alpha(col.color, 0.15), color: col.color }} />
                                </Box>
                            </Box>

                            {/* Tasks */}
                            <Box sx={{ p: 1, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {visibleTasks.map(task => {
                                    const pri = getPriority(task.priority);
                                    return (
                                        <Card
                                            key={task.id}
                                            sx={{
                                                cursor: 'pointer', transition: 'all 0.15s',
                                                '&:hover': { borderColor: col.color, transform: 'translateY(-1px)', boxShadow: `0 4px 12px ${alpha(col.color, 0.15)}` },
                                                borderLeft: `3px solid ${pri.color}`,
                                            }}
                                        >
                                            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, lineHeight: 1.3 }}>
                                                        {task.title}
                                                    </Typography>
                                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, task.id)}>
                                                        <MoreVert sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </Box>
                                                {task.description && (
                                                    <Typography variant="caption" color="text.secondary" sx={{
                                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden', mt: 0.5, lineHeight: 1.4,
                                                    }}>
                                                        {task.description}
                                                    </Typography>
                                                )}
                                                <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                                    <Chip
                                                        icon={pri.icon} label={pri.label} size="small"
                                                        sx={{
                                                            height: 22, fontSize: 10, bgcolor: alpha(pri.color, 0.12), color: pri.color,
                                                            '& .MuiChip-icon': { color: pri.color, fontSize: 14 }
                                                        }}
                                                    />
                                                    {task.tags.map(tag => (
                                                        <Chip key={tag} label={tag} size="small" variant="outlined"
                                                            sx={{ height: 20, fontSize: 10 }} />
                                                    ))}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    );
                                })}

                                {/* Show more */}
                                {hasMore && (
                                    <Button
                                        size="small" startIcon={<ExpandMore />}
                                        onClick={() => showMore(col.id)}
                                        sx={{ mt: 0.5, textTransform: 'none', color: col.color }}
                                    >
                                        Exibir mais {Math.min(remaining, PAGE_SIZE)} de {remaining}
                                    </Button>
                                )}

                                {visibleTasks.length === 0 && (
                                    <Box sx={{ p: 3, textAlign: 'center', opacity: 0.4 }}>
                                        <Typography variant="caption">Sem tarefas</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    );
                })}
            </Box>

            {/* Context menu (sandwich / dropdown) */}
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { const t = tasks.find(tk => tk.id === menuTaskId); if (t) openEdit(t); handleMenuClose(); }}>
                    <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMoveLeft} disabled={!menuTaskId || getColumnIndex(tasks.find(t => t.id === menuTaskId)?.column || 'backlog') === 0}>
                    <ListItemIcon><ArrowBack fontSize="small" /></ListItemIcon>
                    <ListItemText>Mover ←</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMoveRight} disabled={!menuTaskId || getColumnIndex(tasks.find(t => t.id === menuTaskId)?.column || 'done') === COLUMNS.length - 1}>
                    <ListItemIcon><ArrowForward fontSize="small" /></ListItemIcon>
                    <ListItemText>Mover →</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { if (menuTaskId) deleteTask(menuTaskId); handleMenuClose(); }} sx={{ color: 'error.main' }}>
                    <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText>Excluir</ListItemText>
                </MenuItem>
            </Menu>

            {/* Task dialog — new tasks always go to Backlog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Título" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 1, mb: 2 }} />
                    <TextField fullWidth multiline rows={3} label="Descrição" value={description}
                        onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Prioridade</InputLabel>
                        <Select value={priority} label="Prioridade" onChange={(e) => setPriority(e.target.value as TarefasTask['priority'])}>
                            {PRIORITIES.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField size="small" label="Tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleTagAdd(); } }}
                            sx={{ flex: 1 }} />
                        <Button variant="outlined" size="small" onClick={handleTagAdd}>Add</Button>
                    </Box>
                    {tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {tags.map(tag => (
                                <Chip key={tag} label={tag} size="small" onDelete={() => setTags(tags.filter(t => t !== tag))} />
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave} disabled={!title.trim()}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
