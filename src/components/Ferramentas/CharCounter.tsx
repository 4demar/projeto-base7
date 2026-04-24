import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Paper } from '@mui/material';

export default function CharCounter() {
    const [input, setInput] = useState('');
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lines = input ? input.split('\n').length : 0;
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Contador de Caracteres</Typography>
            <TextField fullWidth multiline rows={4} size="small" label="Texto" value={input} onChange={(e) => setInput(e.target.value)} />
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {[
                    { label: 'Caracteres', value: input.length },
                    { label: 'Sem espaços', value: input.replace(/\s/g, '').length },
                    { label: 'Palavras', value: words },
                    { label: 'Linhas', value: lines },
                ].map(r => (
                    <Paper key={r.label} sx={{ p: 1.5, flex: 1, minWidth: 100, textAlign: 'center' }}>
                        <Typography variant="h5" color="primary.main">{r.value}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.label}</Typography>
                    </Paper>
                ))}
            </Box>
        </CardContent></Card>
    );
}
