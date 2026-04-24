import { useState } from 'react';
import {
    Box, Typography, Card, CardContent, TextField,
    Select, MenuItem, FormControl, InputLabel, Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';

export default function UnitConverter() {
    const [value, setValue] = useState('');
    const [type, setType] = useState('bytes');
    const num = parseFloat(value);
    const conversions: Record<string, { label: string; results: { name: string; value: string }[] }> = {
        bytes: {
            label: 'Bytes', results: isNaN(num) ? [] : [
                { name: 'KB', value: (num / 1024).toFixed(4) }, { name: 'MB', value: (num / 1048576).toFixed(4) },
                { name: 'GB', value: (num / 1073741824).toFixed(6) }, { name: 'TB', value: (num / 1099511627776).toFixed(8) },
            ]
        },
        time: {
            label: 'Segundos', results: isNaN(num) ? [] : [
                { name: 'Milissegundos', value: (num * 1000).toFixed(0) }, { name: 'Minutos', value: (num / 60).toFixed(4) },
                { name: 'Horas', value: (num / 3600).toFixed(6) }, { name: 'Dias', value: (num / 86400).toFixed(6) },
            ]
        },
        percentage: {
            label: 'Porcentagem', results: isNaN(num) ? [] : [
                { name: 'Decimal', value: (num / 100).toFixed(6) }, { name: 'Fração (aprox)', value: `${num}/100` },
            ]
        },
    };
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Conversão de Unidades</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Tipo</InputLabel>
                        <Select value={type} label="Tipo" onChange={(e) => setType(e.target.value)}>
                            <MenuItem value="bytes">Bytes</MenuItem><MenuItem value="time">Tempo (s)</MenuItem><MenuItem value="percentage">Porcentagem</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 8 }}>
                    <TextField fullWidth size="small" label={conversions[type].label} value={value} onChange={(e) => setValue(e.target.value)} />
                </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {conversions[type].results.map(r => (
                    <Paper key={r.name} sx={{ p: 1.5, flex: 1, minWidth: 120 }}>
                        <Typography variant="caption" color="text.secondary">{r.name}</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.value}</Typography>
                    </Paper>
                ))}
            </Box>
        </CardContent></Card>
    );
}
