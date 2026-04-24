import { useState } from 'react';
import { Typography, Card, CardContent, TextField, Paper } from '@mui/material';

export default function UtcConverter() {
    const [utc, setUtc] = useState('');
    const local = utc ? new Date(utc).toLocaleString('pt-BR', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }) : '';
    const nowUtc = new Date().toISOString();
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>UTC ⇄ Fuso Local</Typography>
            <TextField fullWidth size="small" label="Data UTC (ISO)" value={utc} onChange={(e) => setUtc(e.target.value)} placeholder={nowUtc} />
            <Paper sx={{ p: 2, mt: 2, fontFamily: 'monospace' }}>
                <Typography variant="caption" color="text.secondary">Horário Local ({Intl.DateTimeFormat().resolvedOptions().timeZone})</Typography>
                <Typography variant="body2">{local || '—'}</Typography>
            </Paper>
        </CardContent></Card>
    );
}
