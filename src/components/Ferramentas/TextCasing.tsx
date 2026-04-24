import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Paper, Tooltip } from '@mui/material';
import { copyToClipboard } from './copyToClipboard';

export default function TextCasing() {
    const [input, setInput] = useState('');
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Alteração de Casing</Typography>
            <TextField fullWidth multiline rows={3} size="small" label="Texto" value={input} onChange={(e) => setInput(e.target.value)} />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                    { label: 'UPPER', fn: (s: string) => s.toUpperCase() },
                    { label: 'lower', fn: (s: string) => s.toLowerCase() },
                    { label: 'Title Case', fn: (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
                    { label: 'camelCase', fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
                    { label: 'snake_case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
                    { label: 'kebab-case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
                ].map(c => (
                    <Tooltip key={c.label} title={input ? c.fn(input) : ''}>
                        <Button size="small" variant="outlined" onClick={() => { if (input) copyToClipboard(c.fn(input)); }}>{c.label}</Button>
                    </Tooltip>
                ))}
            </Box>
            {input && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {[
                        { label: 'UPPER', value: input.toUpperCase() },
                        { label: 'lower', value: input.toLowerCase() },
                        { label: 'Title', value: input.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
                    ].map(r => (
                        <Paper key={r.label} sx={{ p: 1.5, flex: 1, minWidth: 150 }}>
                            <Typography variant="caption" color="text.secondary">{r.label}</Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{r.value}</Typography>
                        </Paper>
                    ))}
                </Box>
            )}
        </CardContent></Card>
    );
}
