import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Box, Typography, Button, IconButton, Chip, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, Tooltip, Switch,
    FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, PersonOff, CheckCircle } from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUsuario } from '../hook/useStore';
import { UsuarioDto, PerfilUsuario } from '../types';

const PERFIS: PerfilUsuario[] = ['Administrador', 'Gerente', 'Operador', 'Consulta'];

type FormState = {
    nome: string;
    email: string;
    perfil: PerfilUsuario;
    ativo: boolean;
};

const formInicial: FormState = { nome: '', email: '', perfil: 'Consulta', ativo: true };

function emailValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CadastroUsuario() {
    const { usuarios, addUsuario, updateUsuario, toggleUsuarioAtivo, deleteUsuario } = useUsuario();
    const { search } = useOutletContext<{ search: string }>();

    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const listaFiltrada = useMemo(() => {
        const termo = search.trim().toLowerCase();
        if (!termo) return usuarios;
        return usuarios.filter(u =>
            u.nome.toLowerCase().includes(termo) ||
            u.email.toLowerCase().includes(termo) ||
            u.perfil.toLowerCase().includes(termo)
        );
    }, [usuarios, search]);

    const abrirNovo = () => {
        setEditId(null);
        setForm(formInicial);
        setOpen(true);
    };

    const abrirEdicao = (usuario: UsuarioDto) => {
        setEditId(usuario.id);
        setForm({ nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, ativo: usuario.ativo });
        setOpen(true);
    };

    const fechar = () => setOpen(false);

    const nomeValido = form.nome.trim().length > 0;
    const formValido = nomeValido && emailValido(form.email);

    const salvar = () => {
        if (!formValido) return;
        const dados = {
            nome: form.nome.trim(),
            email: form.email.trim(),
            perfil: form.perfil,
            ativo: form.ativo,
        };
        if (editId) {
            const original = usuarios.find(u => u.id === editId);
            if (original) updateUsuario({ ...original, ...dados });
        } else {
            addUsuario(dados);
        }
        setOpen(false);
    };

    const remover = (id: string) => {
        if (window.confirm('Deseja realmente excluir este usuário?')) {
            deleteUsuario(id);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Usuários</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={abrirNovo}>
                    Novo Usuário
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Perfil</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell>Criado em</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listaFiltrada.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    Nenhum usuário cadastrado
                                </TableCell>
                            </TableRow>
                        )}
                        {listaFiltrada.map(usuario => (
                            <TableRow key={usuario.id} hover>
                                <TableCell>{usuario.nome}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>
                                    <Chip label={usuario.perfil} size="small" variant="outlined" color="primary" />
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={usuario.ativo ? 'Ativo' : 'Inativo'}
                                        size="small"
                                        color={usuario.ativo ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    {format(new Date(usuario.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title={usuario.ativo ? 'Inativar' : 'Ativar'}>
                                        <IconButton size="small" onClick={() => toggleUsuarioAtivo(usuario.id)}>
                                            {usuario.ativo ? <PersonOff fontSize="small" /> : <CheckCircle fontSize="small" color="success" />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton size="small" onClick={() => abrirEdicao(usuario)}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <IconButton size="small" color="error" onClick={() => remover(usuario.id)}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={fechar} maxWidth="sm" fullWidth>
                <DialogTitle>{editId ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
                    <TextField
                        label="Nome"
                        fullWidth
                        size="small"
                        value={form.nome}
                        onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                        error={form.nome.length > 0 && !nomeValido}
                        helperText={form.nome.length > 0 && !nomeValido ? 'Informe o nome' : ''}
                    />
                    <TextField
                        label="E-mail"
                        type="email"
                        fullWidth
                        size="small"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        error={form.email.length > 0 && !emailValido(form.email)}
                        helperText={form.email.length > 0 && !emailValido(form.email) ? 'E-mail inválido' : ''}
                    />
                    <TextField
                        label="Perfil"
                        select
                        fullWidth
                        size="small"
                        value={form.perfil}
                        onChange={e => setForm(f => ({ ...f, perfil: e.target.value as PerfilUsuario }))}
                    >
                        {PERFIS.map(perfil => (
                            <MenuItem key={perfil} value={perfil}>{perfil}</MenuItem>
                        ))}
                    </TextField>
                    <FormControlLabel
                        control={<Switch checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} />}
                        label="Ativo"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={fechar}>Cancelar</Button>
                    <Button variant="contained" onClick={salvar} disabled={!formValido}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
