import { useState } from 'react';
import {
    Box, Typography, Card, CardContent, TextField,
    Select, MenuItem, FormControl, InputLabel, Paper, IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ContentCopy } from '@mui/icons-material';
import { copyToClipboard } from './copyToClipboard';

export default function NumberConverter() {
    const [input, setInput] = useState('');
    const [base, setBase] = useState<'dec' | 'hex' | 'bin'>('dec');
    const parse = (v: string, b: 'dec' | 'hex' | 'bin') => {
        try { return parseInt(v, b === 'dec' ? 10 : b === 'hex' ? 16 : 2); } catch { return NaN; }
    };
    const num = parse(input, base);
    const results = isNaN(num) ? { dec: '', hex: '', bin: '' } : { dec: num.toString(10), hex: num.toString(16).toUpperCase(), bin: num.toString(2) };
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Decimal ⇄ Hexadecimal ⇄ Binário</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 4 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Base</InputLabel>
                        <Select value={base} label="Base" onChange={(e) => setBase(e.target.value as 'dec' | 'hex' | 'bin')}>
                            <MenuItem value="dec">Decimal</MenuItem><MenuItem value="hex">Hexadecimal</MenuItem><MenuItem value="bin">Binário</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 8 }}>
                    <TextField fullWidth size="small" label="Valor" value={input} onChange={(e) => setInput(e.target.value)} />
                </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {(['dec', 'hex', 'bin'] as const).filter(b => b !== base).map(b => (
                    <Paper key={b} sx={{ p: 1.5, flex: 1, minWidth: 150 }}>
                        <Typography variant="caption" color="text.secondary">{b === 'dec' ? 'Decimal' : b === 'hex' ? 'Hex' : 'Binário'}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{results[b] || '—'}</Typography>
                            {results[b] && <IconButton size="small" onClick={() => copyToClipboard(results[b])}><ContentCopy fontSize="small" /></IconButton>}
                        </Box>
                    </Paper>
                ))}
            </Box>
        </CardContent></Card>
    );
}
