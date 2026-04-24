import { useState } from 'react';
import { Typography, Card, CardContent, TextField, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function JwtDecoder() {
    const [token, setToken] = useState('');
    let header = '', payload = '';
    try {
        if (token) {
            const parts = token.split('.');
            header = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
            payload = JSON.stringify(JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
        }
    } catch { payload = 'Token JWT inválido'; }
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>JWT Decode</Typography>
            <TextField fullWidth multiline rows={3} size="small" label="Token JWT" value={token} onChange={(e) => setToken(e.target.value)} sx={{ '& textarea': { fontFamily: 'monospace', fontSize: 11 } }} />
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Header</Typography>
                    <Paper sx={{ p: 2, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>{header || '—'}</Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Payload</Typography>
                    <Paper sx={{ p: 2, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>{payload || '—'}</Paper>
                </Grid>
            </Grid>
        </CardContent></Card>
    );
}
