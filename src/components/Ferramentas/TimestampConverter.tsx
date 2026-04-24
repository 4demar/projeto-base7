import { useState } from 'react';
import { Typography, Card, CardContent, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function TimestampConverter() {
    const [ts, setTs] = useState('');
    const [dt, setDt] = useState('');
    const tsToDate = ts ? new Date(Number(ts) * (ts.length > 10 ? 1 : 1000)).toISOString() : '';
    const dateToTs = dt ? Math.floor(new Date(dt).getTime() / 1000).toString() : '';
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Timestamp ⇄ DateTime</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth size="small" label="Timestamp (Unix)" value={ts} onChange={(e) => setTs(e.target.value)} />
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>{tsToDate || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth size="small" label="DateTime (ISO)" value={dt} onChange={(e) => setDt(e.target.value)} placeholder="2024-01-01T00:00:00Z" />
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>{dateToTs || '—'}</Typography>
                </Grid>
            </Grid>
        </CardContent></Card>
    );
}
