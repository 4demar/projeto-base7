import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Paper, IconButton } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { copyToClipboard } from './copyToClipboard';

export default function JsonCsvConverter() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'json2csv' | 'csv2json'>('json2csv');
    let output = '';
    try {
        if (mode === 'json2csv' && input) {
            const arr = JSON.parse(input);
            if (Array.isArray(arr) && arr.length > 0) {
                const headers = Object.keys(arr[0]);
                output = [headers.join(','), ...arr.map((row: Record<string, unknown>) => headers.map(h => `"${String(row[h] ?? '')}"`).join(','))].join('\n');
            }
        } else if (mode === 'csv2json' && input) {
            const lines = input.trim().split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const result = lines.slice(1).map(line => {
                const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                return Object.fromEntries(headers.map((h, i) => [h, vals[i] || '']));
            });
            output = JSON.stringify(result, null, 2);
        }
    } catch { output = 'Erro na conversão'; }
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>JSON ⇄ CSV</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button variant={mode === 'json2csv' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('json2csv')}>JSON → CSV</Button>
                <Button variant={mode === 'csv2json' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('csv2json')}>CSV → JSON</Button>
            </Box>
            <TextField fullWidth multiline rows={6} size="small" label="Entrada" value={input} onChange={(e) => setInput(e.target.value)} sx={{ '& textarea': { fontFamily: 'monospace', fontSize: 12 } }} />
            <Paper sx={{ p: 2, mt: 2, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-all', position: 'relative', overflow: 'auto', maxHeight: 250 }}>
                {output || '—'}
                {output && output !== 'Erro na conversão' && (
                    <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4 }} onClick={() => copyToClipboard(output)}><ContentCopy fontSize="small" /></IconButton>
                )}
            </Paper>
        </CardContent></Card>
    );
}
