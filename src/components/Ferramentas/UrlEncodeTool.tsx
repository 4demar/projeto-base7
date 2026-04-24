import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Paper, IconButton } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { copyToClipboard } from './copyToClipboard';

export default function UrlEncodeTool() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    let output = '';
    try { output = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input); } catch { output = 'Erro na conversão'; }
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>URL Encode/Decode</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button variant={mode === 'encode' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('encode')}>Encode</Button>
                <Button variant={mode === 'decode' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('decode')}>Decode</Button>
            </Box>
            <TextField fullWidth multiline rows={3} size="small" label="Entrada" value={input} onChange={(e) => setInput(e.target.value)} />
            <Paper sx={{ p: 2, mt: 2, fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all', position: 'relative' }}>
                {output || '—'}
                {output && output !== 'Erro na conversão' && (
                    <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4 }} onClick={() => copyToClipboard(output)}><ContentCopy fontSize="small" /></IconButton>
                )}
            </Paper>
        </CardContent></Card>
    );
}
