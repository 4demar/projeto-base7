import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Paper, IconButton } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { copyToClipboard } from './copyToClipboard';

export default function TextNormalizer() {
    const [input, setInput] = useState('');
    const normalized = input.replace(/\s+/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    const noAccents = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Normalização e Limpeza de Texto</Typography>
            <TextField fullWidth multiline rows={3} size="small" label="Texto" value={input} onChange={(e) => setInput(e.target.value)} />
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Paper sx={{ p: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">Normalizado (espaços limpos)</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>{normalized || '—'}</Typography>
                        {normalized && <IconButton size="small" onClick={() => copyToClipboard(normalized)}><ContentCopy fontSize="small" /></IconButton>}
                    </Box>
                </Paper>
                <Paper sx={{ p: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">Sem acentos</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>{noAccents || '—'}</Typography>
                        {noAccents && <IconButton size="small" onClick={() => copyToClipboard(noAccents)}><ContentCopy fontSize="small" /></IconButton>}
                    </Box>
                </Paper>
            </Box>
        </CardContent></Card>
    );
}
